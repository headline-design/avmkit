import { Pipeline } from "../../../packages/pipeline/src";

export function switchNets(netObj) {
    Pipeline.indexer = netObj.indexer;
    Pipeline.algod = netObj.algod;
    Pipeline.token = netObj.token;
    Pipeline.devGenHash = netObj.genesisHash;
    Pipeline.devGenId = netObj.genesisId;
}
