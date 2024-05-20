import { Pipeline } from '@siwa/pipeline';
export function shortenAddress(str = '') {
  return `${str.slice(0, 6)}...${str.slice(str.length - 4)}`;
}

export function shorten(str: string, key?: any): string {
  if (!str) return str;
  let limit;
  if (typeof key === 'number') limit = key;
  if (key === 'symbol') limit = 6;
  if (key === 'name') limit = 64;
  if (key === 'choice') limit = 12;
  if (limit) return str.length > limit ? `${str.slice(0, limit).trim()}...` : str;
  return shortenAddress(str);
}

export function switchNets(netObj) {
  Pipeline.indexer = netObj.indexer;
  Pipeline.algod = netObj.algod;
  Pipeline.token = netObj.token;
  Pipeline.devGenHash = netObj.genesisHash;
  Pipeline.devGenId = netObj.genesisId;
}

const cBuffer = (text) => Uint8Array.from([...text].map((ch) => ch.charCodeAt(0)));
const deBuffer = (uintArray) =>
  uintArray.reduce((str, byte) => str + String.fromCharCode(byte), '');
const pad = (uarray) => Uint8Array.from({ length: 32 }, (_, i) => uarray[i] || 0);
const nonce = new Uint8Array(24).fill(0);

export { cBuffer, deBuffer, pad, nonce };

export function removeHttp(url) {
  return url.replace(/^(http:\/\/|https:\/\/)/, "");
}