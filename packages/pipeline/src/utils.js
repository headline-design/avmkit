import algosdk from 'algosdk'
import { Buffer }  from 'buffer'

async function configClient(main, api, ref) {

    let paramServer = ''
    let transServer = ''

    if (main) {
        paramServer = 'https://mainnet-api.algonode.cloud/v2/transactions/params'
        transServer = 'https://mainnet-api.algonode.cloud/v2/transactions'
    }
    else {
        paramServer = "https://testnet-api.algonode.network/v2/transactions/params"
        transServer = "https://testnet-api.algonode.network/v2/transactions"
    }

    if (api) {
        paramServer = ref.algod + "/v2/transactions/params";
        transServer = ref.algod + "/v2/transactions";
    }

    let fetchObject = {}
    if (api) {
        fetchObject = {
            method: "GET",
            headers: {
                'X-Algo-API-Token': ref.token,
            }
        }
    }

    let params = await (await fetch(paramServer, fetchObject)).json()

    if (!main) {
        params.genesisID = 'testnet-v1.0';
        params.genesisHash = 'SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=';
    }
    else {
        params.genesisID = 'mainnet-v1.0'
        params.genesisHash = 'wGHE2Pwdvd7S12BL5FaOP20EGYesN73ktiC1qzkkit8='
    }

    if (api) {
        params.genesisID = ref.devGenId;
        params.genesisHash = ref.devGenHash;
    }

    params.firstRound = params["last-round"]
    params.lastRound = params["last-round"] + 1000

    return {
        paramServer: paramServer,
        tranServer: transServer,
        params: params
    }
}

function configIndexer(main, api, ref) {
    let indexerURL = ""

    if (main) {
        indexerURL = "https://mainnet-idx.algonode.cloud"
    }
    else {
        indexerURL = "https://testnet-idx.algonode.cloud"
    }

    if (api) { indexerURL = ref.indexer }

    return indexerURL
}

async function sendTxns(txns, transServer, api = false, token = "", alerts) {
    let requestHeaders = { 'Content-Type': 'application/x-binary' };

    if (api) {
        requestHeaders = {
            'X-Algo-API-Token': token
        }
    }

    let transactionID = await fetch(transServer, {
        method: 'POST',
        headers: requestHeaders,
        body: txns
    })
        .then(response => response.json())
        .then(data => {
            if (data.txId !== undefined) {
                return data.txId
            }
            else {
                if (data.message !== undefined) {
                    if (alerts) {
                        alert(data.message)
                    }
                    return undefined
                }
            }
        })
        .catch(error => {
            console.error('Error:', error)
        })

    return transactionID

}

function configAlgosdk(ref) {

    let algodClient = ""

    if (ref.EnableDeveloperAPI) {
        algodClient = new algosdk.Algodv2("", ref.algod, ref.token);
    }
    else {
        if (!ref.main) {
            algodClient = new algosdk.Algodv2("", 'https://testnet-api.algonode.network', '');
        }
        else {
            algodClient = new algosdk.Algodv2("", 'https://mainnet-api.algonode.cloud', '');
        }
    }
    return algodClient

}

export { configClient, configIndexer, sendTxns, configAlgosdk }