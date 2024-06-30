import { Pipeline } from "@avmkit/pipeline";

export function switchNets(netObj) {
    Pipeline.indexer = netObj.indexer;
    Pipeline.algod = netObj.algod;
    Pipeline.token = netObj.token;
    Pipeline.devGenHash = netObj.genesisHash;
    Pipeline.devGenId = netObj.genesisId;
}
