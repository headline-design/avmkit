import algosdk, { SignedTransaction } from "algosdk";
import nacl from "tweetnacl";

export const parseIntegerNumber = (number: string): number => {
  const parsed = parseInt(number);
  //@ts-ignore
  if (parsed === NaN) throw new Error("Invalid number.");
  if (parsed === Infinity) throw new Error("Invalid number.");
  return parsed;
};

export function verifySignedTransaction(stxn: SignedTransaction) {
  if (stxn.sig === undefined) return false;

  const pk_bytes = stxn.txn.from.publicKey;

  const sig_bytes = new Uint8Array(stxn.sig);

  const txn_bytes = algosdk.encodeObj(stxn.txn.get_obj_for_encoding());
  const msg_bytes = new Uint8Array(txn_bytes.length + 2);
  msg_bytes.set(Buffer.from("TX"));
  msg_bytes.set(txn_bytes, 2);
  const isValid = nacl.sign.detached.verify(msg_bytes, sig_bytes, pk_bytes);
  const signature = Buffer.from(stxn.sig).toString("base64");

  return {
    isValid,
    signature,
  }
}
