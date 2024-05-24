// componet to save as file blob
import { Escrow, Pipeline } from '@avmkit/pipeline';
import { cBuffer, deBuffer, pad, nonce } from '../utils';
import nacl from 'tweetnacl';

export function unlockWallet() {
  let savedMnemonic = localStorage.getItem('xMnemonic');
  let unpaddedPassword = prompt();
  const paddedPassword = pad(cBuffer(unpaddedPassword));
  try {
    const decryptedArray = nacl.secretbox.open(cBuffer(savedMnemonic), nonce, paddedPassword);
    const unlockedKey = deBuffer(decryptedArray);

    return unlockedKey;
  } catch (e) {
    console.error('Incorrect password');
    return 'Incorrect password';
  }
}

export function importMnemonic() {
  let newMnemonicString = prompt();
  let arrayedMnemonic = newMnemonicString?.split(' ');
  let length = arrayedMnemonic?.length;
  if (length !== 25) {
    console.error('Invalid mnemonic');
    return;
  }
  Escrow.importAccount(newMnemonicString);
  console.log('escrow address', Escrow.address);
}

export async function sendTransaction(to, note, amount) {
  // we assume wallet is Pipeline.Escrow
  let mnemonic = unlockWallet();
  Escrow.importAccount(mnemonic);
  console.log(Pipeline.pipeConnector);
  //Pipeline.address = Escrow.address;
  console.log(Pipeline.address);
  console.log(Escrow.address);

  let data = await Pipeline.send(to, amount, note, undefined, undefined, 0);

  console.log(data);
}
