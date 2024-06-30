//@ts-nocheck

//import WalletConnect from "@walletconnect/client";
//import { WalletConnectModalSign } from "@walletconnect/modal-sign-html";

//import QRCodeModal from "algorand-walletconnect-qrcode-modal";

import createAsaTxn from './createAsaTxn.js';
import {
  getAppIndex,
  getAsaIndex,
  readGlobalState,
  u8array,
} from './teal_utils.js';
import algosdk from 'algosdk';
import {
  configAlgosdk,
  configClient,
  configIndexer,
  sendTxns,
} from './utils.js';
import 'regenerator-runtime';
//import PipeWallet from "./pwallet.js";
import Escrow from './escrow';
//in order to solve undiagnosed "missing parenthetical" error, PeraWallet cannot be installed via there instructions. In order to integrate PeraWallet, prior to building Pipeline, in terminal run: cd connect && npm install
import { PeraWalletConnect } from '@perawallet/connect';
import encodeUint64 from './encode64.js';

export { sendTxns, Escrow, configClient /*PipeWallet*/ };

type AsaObject = {
  name?: string;
  symbol?: string;
  total?: number;
  decimals?: number;
  defaultFrozen?: boolean;
  manager?: string;
  reserve?: string;
  freeze?: string;
  clawback?: string;
  note?: Uint8Array;
};

async function waitForUnlock() {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined') {
      (window as any).approve = () => {
        resolve(true);
      };
    } else {
      reject(new Error("Window is not defined"));
    }
  });
}

//Note: this class is a work in progress. May be unstable. Roll back to version 1.2.7 if issues encountered

export class Pipeline {
  static alerts = true;
  static EnableDeveloperAPI = false;
  static indexer = 'http://localhost:8980';
  static algod = 'http://localhost:4001';
  static token =
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
  static devGenHash = 'sC3P7e2SdbqKJK0tbiCdK9tdSpbe6XeCGKdoNzmlj0E=';
  static devGenId = 'devnet-v1.0';
  static index = 0;
  static pipeConnector = 'escrow';
  static chainId = 0;
  static main = true;
  static XWallet = true;
  static address = '';
  static txID = '';
  static myBalance = 0;
  /* static connector = new WalletConnect({
    bridge: "https://bridge.walletconnect.org", // Required
    qrcodeModal: QRCodeModal,
  }); */

  static wizard = undefined;

  static wcId = '85663294acf9ea5f7b367dbf260038bc';

  static connector: any = {};
  static genesisID = '';
  static fee = algosdk.ALGORAND_MIN_TX_FEE;

  /*

  static connector = new WalletConnectModalSign({
    projectId: Pipeline.wcId,
    metadata: {
      name: "My Dapp",
      description: "My Dapp description",
      url: "https://my-dapp.com",
      icons: ["https://my-dapp.com/logo.png"],
    },
  });
  */

  static init = () => {
    return new Escrow();
  }; //backwards compatibility

  static wallet = new Escrow();

  static peraWallet: PeraWalletConnect = new PeraWalletConnect();

  static async balance(address) {
    let indexerURL = configIndexer(this.main, this.EnableDeveloperAPI, this);

    let url2 = indexerURL + '/v2/accounts/' + address;
    try {
      let data = await fetch(url2);
      let data2 = await data.json();
      let data3 = JSON.stringify(data2.account.amount / 1000000);
      this.myBalance = parseFloat(data3);
      return data3;
    } catch (error) {
      console.log(error);
      return 0;
    }
  }

  static async readAccount(address) {
    let indexerURL = configIndexer(this.main, this.EnableDeveloperAPI, this);

    let url2 = indexerURL + '/v2/accounts/' + address;
    try {
      let data = await fetch(url2);
      let data2 = await data.json();
      return data2;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  static async connect(wallet) {
    switch (this.pipeConnector) {
      case 'PeraWallet':
        let newAccounts = await this.peraWallet.connect();

        this.address = newAccounts[0];

        try {
          const peraAccounts = await this.peraWallet.reconnectSession()

          if (peraAccounts.length > 0) {
            this.peraWallet.connector?.on("disconnect", function () {
              Pipeline.peraWallet.disconnect()
              Pipeline.address = ""
            })
            this.address = peraAccounts[0]
          }
          else { }
        }
        catch (error) {
          let newAccounts = await this.peraWallet.connect()
          // Setup the disconnect event listener
          this.peraWallet.connector?.on("disconnect", function () {
            Pipeline.peraWallet.disconnect()
            Pipeline.address = ""
          })

          this.address = newAccounts[0];
        }

        break;
      case 'WalletConnect':
        try {
          alert(
            'Wallet Connect no longer supported due to mind-blowing stupidity'
          );
        } catch (err) {
          alert(err);
        }
        break;


      case 'Kibisis':
        await injectKibisis();
        break;

      /*case "PipeWallet":
        PipeWallet.openWallet();
        break;
        */
      case 'escrow':
        Pipeline.address = Escrow.address;
        break;
      default:
        break;
    }
    return this.address;
  }

  static async sign(
    mytxnb,
    group = false,
    signed = [],
    callback = () => {
      console.log('a callback function will go here');
    }
  ) {
    console.log(mytxnb);
    let signedTxn: Uint8Array[] = [];


    if (this.pipeConnector === 'PeraWallet') {
      try {
        let peraAccounts = await this.peraWallet.reconnectSession()
        if (!group && peraAccounts.length > 0) {
          try {
            signedTxn = await this.peraWallet.signTransaction([
              [{ txn: mytxnb, signers: [Pipeline.address] }],
            ]);
            return signedTxn[0];
          } catch (e) {
            console.log(e);
          }
        } else if (peraAccounts.length > 0) {
          let index = 0;
          let groupToSign = [];
          mytxnb.forEach((txn) => {
            groupToSign.push([
              { txn: txn, signers: [signed[index] || Pipeline.address] },
            ]);
            index++;
          });
          signedTxn = await this.peraWallet.signTransaction(groupToSign);
          let txnsb = [];
          signedTxn.forEach((item) => {
            txnsb.push(item);
          });
          return txnsb;
        }
      } catch (e) {
        if (typeof window !== 'undefined') {
          window.pipelineErrors.push(e);
        }
      }
    } else {
      if (this.pipeConnector === 'escrow') {
        console.log('Escrow Address: ' + Escrow.address);

        if (this.XWallet) {
          console.log('XWallet');
          if (!Escrow.address) {
            callback();
          }
          await waitForUnlock();
        }

        if (!group) {
          let signedTxn = Escrow.sign(mytxnb);
          return signedTxn;
        } else {
          let signedGroup = [];

          mytxnb.forEach((transaction) => {
            let signed = Escrow.sign(transaction);
            signedGroup.push(signed);
          });

          console.log('Signed Group:');
          console.log(signedGroup);
          return signedGroup;
        }
      } else {
        if (this.pipeConnector === 'Kibisis') {
          let transactionBytes = Buffer.from(mytxnb.toByte()).toString(
            'base64'
          );
          let sts = { txns: [{ txn: transactionBytes }] };

          try {
            const result = await window.algorand.signTxns(sts);
            let signedTransactionBytes;
            signedTransactionBytes = result.stxns[0];

            console.log(signedTransactionBytes);
            return base64ToArrayBuffer(signedTransactionBytes);
          } catch (e) {
            console.log(e);
          }
        } else {
          let txns: any = [];
          if (!group) {
            txns[0] = mytxnb;
          } else {
            txns = mytxnb;
          }

          console.log('Unencoded txns:');
          console.log(txns);

          /*
                        let prototxn = {
                            "amt": mytxnb.amount,
                            "fee": 1000,
                            "fv": mytxnb.lastRound - 1000,
                            "gen": mytxnb.genesisID,
                            "gh": new Uint8Array(Buffer.from(mytxnb.genesisHash, 'base64')),
                            "lv": mytxnb.lastRound,
                            "note": mytxnb.note,
                            "rcv": new Uint8Array(base32.decode.asBytes(mytxnb.to).slice(0, 32)),
                            "snd": new Uint8Array(base32.decode.asBytes(this.address).slice(0, 32)),
                            "type": "pay"
                        }

                        let prototxnASA = {};
                        let prototxnb = encode(prototxn);
                        let txns = [];
                        txns[0] = prototxnb;

                        if (this.index !== 0) {
                            prototxnASA = {
                                "aamt": mytxnb.amount,
                                "arcv": new Uint8Array(base32.decode.asBytes(mytxnb.to).slice(0, 32)),
                                "fee": 1000,
                                "fv": mytxnb.lastRound - 1000,
                                "gen": mytxnb.genesisID,
                                "gh": new Uint8Array(Buffer.from(mytxnb.genesisHash, 'base64')),
                                "lv": mytxnb.lastRound,
                                "note": mytxnb.note,
                                "snd": new Uint8Array(base32.decode.asBytes(this.address).slice(0, 32)),
                                "type": "axfer",
                                "xaid": parseInt(mytxnb.assetIndex)
                            }
                            prototxnb = encode(prototxnASA);
                            txns[0] = prototxnb;
                        }

                                console.log(prototxnb)
                                console.log(new TextDecoder().decode(prototxnb))
                                console.log(JSON.stringify(decode(prototxnb)))
                        */
          // Sign transaction

          let txnsToSign = txns.map((txnb) => {
            let packed = algosdk.encodeUnsignedTransaction(txnb);
            let encodedTxn = Buffer.from(packed).toString('base64');

            if (this.pipeConnector === 'WalletConnect') {
              return {
                txn: encodedTxn,
                message: '',
                // Note: if the transaction does not need to be signed (because it's part of an atomic group
                // that will be signed by another party), specify an empty singers array like so:
                // signers: [],
              };
            } else {
              return { txn: encodedTxn };
            }
          });

          let nestedArray = [];


          if (group && signed.length !== 0) {
            for (let i = 0; i < signed.length; i++) {
              if (signed[i] !== Pipeline.address) {
                txnsToSign[i].signers = [];
              }
            }
          }

          let requestParams = [txnsToSign];
          console.log('TXNs to Sign:');
          console.log(requestParams);

          if (this.pipeConnector === 'WalletConnect') {
            alert(
              'Wallet Connect no longer supported due to mind-blowing stupidity'
            );
            /*

          let request = formatJsonRpcRequest("algo_signTxn", requestParams);

          //request.id = this.chainId

          console.log(request);

          try {
            let result = await this.connector.sendCustomRequest(request);

            console.log("Response from walletconnect: ", result)

            let binarySignedTxs = await result.map((tx) => {

              if (tx !== null) {
                return new Uint8Array(Buffer.from(tx, "base64"));
              }
              else { return tx }
            });
            return !group ? binarySignedTxs[0] : binarySignedTxs;
          } catch (error) {
            console.log(error);
          }
        */
          } else {
            let signedTxns = algosdk.signTransaction(txns, Pipeline.address as any);
            return signedTxns;
          }
        }
      }
    }
  }

  static makeAppCall(
    appId,
    appArgs,
    params,
    accounts,
    assets,
    applications,
    boxes
  ) {
    let id = parseInt(appId);
    let converted = [];
    appArgs.forEach((arg) => {
      converted.push(
        typeof arg === 'number' ? encodeUint64(arg) : u8array(arg)
      );
    });
    appArgs = converted;

    let txn = algosdk.makeApplicationNoOpTxn(
      this.address,
      params,
      id,
      appArgs,
      accounts,
      applications,
      assets,
      undefined,
      undefined,
      undefined,
      boxes
    );

    return txn;
  }

  static makeTransfer(address, amt, myNote, index = 0, params: any = {}) {
    const buf = new Array(myNote.length);
    const encodedNote = new Uint8Array(buf);
    for (let i = 0, strLen = myNote.length; i < strLen; i++) {
      encodedNote[i] = myNote.charCodeAt(i);
    }

    console.log('My encoded note: ' + encodedNote);

    let txn: any = {
      from: this.address,
      to: address,
      amount: parseInt(amt),
      note: encodedNote,
      genesisId: params.genesisID,
      genesisHash: params.genesisHash,
      type: 'pay',
      flatFee: true,
      fee: algosdk.ALGORAND_MIN_TX_FEE,
      firstRound: parseInt(params['last-round'].toString()),
      lastRound: parseInt(params['last-round'].toString()) + 1000,
    };

    console.log('TXN', txn);

    if (index !== 0) {
      this.index = index;
      txn.type = 'axfer';
      txn.assetIndex = parseInt(index as any);

      txn = algosdk.makeAssetTransferTxnWithSuggestedParams(
        txn.from,
        txn.to,
        undefined,
        undefined,
        txn.amount,
        txn.note,
        txn.assetIndex,
        params,
        undefined
      );
    } else {
      txn = algosdk.makePaymentTxnWithSuggestedParams(
        txn.from,
        txn.to,
        txn.amount,
        undefined,
        txn.note,
        params,
        undefined
      );
    }

    txn.fee = algosdk.ALGORAND_MIN_TX_FEE;

    console.log(txn);
    return txn;
  }

  static async send(address, amt, myNote, _sendingAddress, _wallet, index = 0) {
    let client = await configClient(this.main, this.EnableDeveloperAPI, this);
    let transServer = client.tranServer;
    let params = client.params;

    try {
      let txn = this.makeTransfer(address, amt, myNote, index, params);

      let signedTxn = {};

      signedTxn = await this.sign(txn);

      console.log(signedTxn);

      let transactionID = await sendTxns(
        signedTxn,
        transServer,
        this.EnableDeveloperAPI,
        this.token,
        this.alerts
      );

      this.txID = transactionID;
      if (transactionID === undefined) {
        transactionID = 'Transaction failed';
      }
      return transactionID;
    } catch (err) {
      console.error(err);
    }
  }

  static async createAsa(asaObject: AsaObject = {}) {
    let txn: any = {};

    let client = await configClient(this.main, this.EnableDeveloperAPI, this);
    let transServer = client.tranServer;
    let params = client.params;

    let myNote: any = asaObject.note || 'New Asa';

    let buf = new Array(myNote.length);
    let encodedNote = new Uint8Array(buf);
    for (let i = 0, strLen = myNote.length; i < strLen; i++) {
      encodedNote[i] = myNote.charCodeAt(i);
    }

    asaObject.note = encodedNote;

    console.log('My encoded note: ' + encodedNote);

    txn = createAsaTxn(params, asaObject);

    txn.fee = algosdk.ALGORAND_MIN_TX_FEE;

    console.log(txn);

    let signedTxn = {};

    signedTxn = await this.sign(txn, false);

    console.log(signedTxn);

    try {
      let transactionID = await sendTxns(
        signedTxn,
        transServer,
        this.EnableDeveloperAPI,
        this.token,
        this.alerts
      );

      this.txID = transactionID;
      if (transactionID === undefined) {
        return 'Transaction failed';
      } else {
        let assetID = await getAsaIndex(transactionID, this.main, this);
        console.log(assetID);
        return assetID;
      }
    } catch (err) {
      console.error(err);
    }
  }

  static async compileProgram(client, teal) {
    let encoder = new TextEncoder();
    let programBytes = encoder.encode(teal);
    try {
      let compileResponse = await client.compile(programBytes).do();
      return compileResponse;
    } catch (error) {
      console.log(error);
    }
  }

  static async deployTeal(
    teal = '',
    teal2 = '',
    bytesInts = [],
    appArgs = [],
    onComplete = 0
  ) {
    if (teal !== '') {
      let algodClient: any = configAlgosdk(this);

      let clientb = await configClient(
        this.main,
        this.EnableDeveloperAPI,
        this
      );
      let transServer = clientb.tranServer;

      let compiled: any = '';

      compiled = await this.compileProgram(algodClient, teal);
      let compiledClear = await this.compileProgram(algodClient, teal2);

      let params = {};

      params = await algodClient.getTransactionParams().do();

      let converted = [];
      appArgs.forEach((arg) => {
        converted.push(
          typeof arg === 'number' ? encodeUint64(arg) : u8array(arg)
        );
      });
      appArgs = converted;

      console.log(appArgs);

      let lbytes = bytesInts[0];
      let gbytes = bytesInts[1];
      let lints = bytesInts[2];
      let gints = bytesInts[3];

      let txn = algosdk.makeApplicationCreateTxnFromObject({
        suggestedParams: params as any,
        from: this.address,
        numLocalByteSlices: lbytes,
        numGlobalByteSlices: gbytes,
        numLocalInts: lints,
        numGlobalInts: gints,
        appArgs: appArgs,
        approvalProgram: new Uint8Array(Buffer.from(compiled.result, 'base64')),
        clearProgram: new Uint8Array(
          Buffer.from(compiledClear.result, 'base64')
        ),
        onComplete: onComplete,
      });

      try {
        let signedTxn = await this.sign(txn);
        console.log(signedTxn);
        let response = await sendTxns(
          signedTxn,
          transServer,
          this.EnableDeveloperAPI,
          this.token,
          this.alerts
        );

        console.log(response);
        this.txID = response;
        let appId = await getAppIndex(response, this.main, this);
        console.log(appId);

        if (appId === undefined) {
          appId = 'Transaction failed';
        }
        return appId;
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log('Teal program or clear program empty');
    }
  }

  static async optIn(appId = 0, appArgs = []) {
    let algodClient: any = configAlgosdk(this);

    let clientb = await configClient(this.main, this.EnableDeveloperAPI, this);
    let transServer = clientb.tranServer;

    let params = await algodClient.getTransactionParams().do();

    let converted = [];
    appArgs.forEach((arg) => {
      converted.push(
        typeof arg === 'number' ? algosdk.encodeUint64(arg) : u8array(arg)
      );
    });
    appArgs = converted;

    let txn: any = '';

    txn = algosdk.makeApplicationOptInTxnFromObject({
      suggestedParams: params,
      from: this.address,
      appIndex: parseInt(appId as any),
      appArgs: appArgs,
    });

    try {
      let signedTxn = await this.sign(txn);
      console.log(signedTxn);
      let response = await sendTxns(
        signedTxn,
        transServer,
        this.EnableDeveloperAPI,
        this.token,
        this.alerts
      );
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  static async appCall(
    appId,
    appArgs,
    accounts = undefined,
    assets = undefined,
    applications = undefined,
    boxes = undefined
  ) {
    let clientb = await configClient(this.main, this.EnableDeveloperAPI, this);
    let transServer = clientb.tranServer;
    let params = clientb.params;

    let txn = this.makeAppCall(
      appId,
      appArgs,
      params,
      accounts,
      assets,
      applications,
      boxes
    );

    try {
      let signedTxn = await this.sign(txn);
      console.log(signedTxn);
      let response = await sendTxns(
        signedTxn,
        transServer,
        this.EnableDeveloperAPI,
        this.token,
        this.alerts
      );
      console.log(response);

      return response;
    } catch (error) {
      console.log(error);
    }
  }

  static async getParams() {
    let client = await configClient(this.main, this.EnableDeveloperAPI, this);
    return client.params;
  }

  static async deleteApp(appId = 0) {
    let algodClient: any = configAlgosdk(this);
    let params = await algodClient.getTransactionParams().do();

    let txn = algosdk.makeApplicationDeleteTxnFromObject({
      suggestedParams: params,
      from: this.address,
      appIndex: parseInt(appId as any),
    });

    let signedTxn = await this.sign(txn);

    let clientb = await configClient(this.main, this.EnableDeveloperAPI, this);
    let transServer = clientb.tranServer;

    try {
      let response = await sendTxns(
        signedTxn,
        transServer,
        this.EnableDeveloperAPI,
        this.token,
        this.alerts
      );
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  static async appCallWithTxn(
    appId = 0,
    appArgs = [],
    reciever = '',
    amount = 0,
    note = '',
    index = 0,
    accounts = undefined,
    assets = undefined
  ) {
    let id = parseInt(appId as any);

    let algodClient = configAlgosdk(this) as any;

    let clientb = await configClient(this.main, this.EnableDeveloperAPI, this);
    let params = clientb.params;

    let txns = [
      this.makeAppCall(id, appArgs, params, accounts, assets, undefined, undefined),
      this.makeTransfer(reciever, amount, note, index, params),
    ];

    txns = algosdk.assignGroupID(txns as any);

    console.log(txns);

    let signedTxn = await this.sign(txns, true);

    console.log(signedTxn);

    try {
      let response = await algodClient.sendRawTransaction(signedTxn).do();
      if (response.txId !== undefined) {
        return response.txId;
      } else {
        if (this.alerts) {
          alert(response.message);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  static async getAppCreator(appid) {
    let data = undefined;
    let dataObj = undefined;
    let id = undefined;

    let url = '';

    url = configIndexer(this.main, this.EnableDeveloperAPI, this);

    data = await fetch(url + '/v2/applications/' + parseInt(appid));
    dataObj = await data.json();
    id = await dataObj.application.params.creator;
    return id;
  }

  static async readGlobalState(appId) {
    let data = await readGlobalState(this.main, appId, this);
    return data;
  }

  static async kibisisSignBytes(bytes) {
    if (typeof window !== 'undefined') {
      let result = await window.algorand.signBytes({ data: bytes });
      console.log('Signature result:', result.signature);
      return result.signature;
    } else {
      throw new Error("Window is not defined");
    }
  }

  static async peraSignBytes(bytes) {
    let result = await this.peraWallet.signData([
      {
        data: new Uint8Array(Buffer.from(bytes)),
        message: ''
      },
    ], Pipeline.address);
    return result;
  }

  static getMessageBytes(message) {
    return new Uint8Array(Buffer.from(message, 'utf8'));
  }
}

declare global {
  interface Window {
    pipeline: typeof Pipeline;
    pipeEscrow: typeof Escrow;
    pipelineErrors: any[];
    handleWalletError: (error: string) => void;
  }
}

if (typeof window !== 'undefined') {
  window.pipeline = Pipeline;
  //window.PipeWallet = PipeWallet;
  window.pipeEscrow = Escrow;
  window.pipelineErrors = [];
}

async function injectKibisis() {
  console.log('Injecting Kibisis script...');

  async function enableWallet() {
    if (typeof window === 'undefined' || !window.algorand) {
      console.error('AVM Wallets not available');
      return null; // No Algorand wallets available, handle as an error.
    }

    try {
      const result = await window.algorand.enable('kibisis');
      console.log('Wallet enabled:', result);
      if (result.accounts && result.accounts.length > 0) {
        return result.accounts[0].address;
      } else {
        throw new Error('No accounts available'); // Throwing error if no accounts found.
      }
    } catch (error) {
      console.error('Error enabling wallet:', error);
      return null; // Returning null on user cancellation or any other error.
    }
  }

  let address = await enableWallet();
  if (address) {
    Pipeline.address = address;
    return address;
  } else {
    console.log('No address obtained or user cancelled.');
    if (typeof window !== 'undefined') {
      window.handleWalletError('User cancelled or no accounts available'); // Handling errors or cancellations globally.
    }
    throw new Error('User cancelled or no accounts available');
  }
}

function base64ToArrayBuffer(base64) {
  var binaryString = atob(base64);
  var bytes = new Uint8Array(binaryString.length);
  for (var i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}
