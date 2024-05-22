import { ALT_CHAIN_NETWORK_KEY, CHAIN_NETWORK_KEY } from '@/dashboard/utils/constants/common';
import localStore from 'store';
import {
  INDEXER_URL,
  INDEXER_ALT_URL,
  NODE_URL,
  NODE_ALT_URL,
  INDEXER_HEALTH_URL,
  INDEXER_HEALTH_ALT_URL,
  IPFS_URL,
  EXPLORER_URL,
  ALGO_PRICE_URL,
  ASSET_PRICE_URL,
  ASSET_PRICES_URL,
  STAMP_URL,
  loadConfig,
} from '@siwa/sdk';

// A helper function to get network type
export const getNetworkType = () =>
  localStore.get(CHAIN_NETWORK_KEY) ?? process.env.NEXT_NETWORK_TYPE === 'mainnet';

export const getChain = () => localStore.get(ALT_CHAIN_NETWORK_KEY);

// Common endpoints object
const commonEndpoints = {
  priceApi: 'https://api.myalgo.com/asset/prices/',
  ipfs: IPFS_URL,
};

export const getEndpoints = () => {
  const isMainnet = getNetworkType();
  const isAltChainEnabled = getChain();

  loadConfig({
    network: isMainnet ? 'mainnet' : 'testnet',
    chain: isAltChainEnabled ? 'voi' : 'algorand',
  });

  const endpoints = {
    false: {
      ...commonEndpoints,
      indexer: INDEXER_URL,
      indexerAlt: INDEXER_ALT_URL,
      node: NODE_URL,
      nodeAlt: NODE_ALT_URL,
      indexerHealth: INDEXER_HEALTH_URL,
      indexerHealthAlt: INDEXER_HEALTH_ALT_URL,
      explorer: EXPLORER_URL,
    },
    true: {
      ...commonEndpoints,
      indexer: INDEXER_URL,
      indexerAlt: INDEXER_ALT_URL,
      node: NODE_ALT_URL,
      nodeAlt: NODE_ALT_URL,
      indexerHealth: INDEXER_HEALTH_URL,
      indexerHealthAlt: INDEXER_HEALTH_ALT_URL,
      explorer: EXPLORER_URL,
    },
  };

  return endpoints[String(isMainnet)];
};

export const staticEndpoints = {
  algoPrice: ALGO_PRICE_URL,
  assetPrice: ASSET_PRICE_URL,
  assetPrices: ASSET_PRICES_URL,
  stamp: STAMP_URL,
  ipfs: IPFS_URL,
};

export const staticValues = {
  roundTime: 3.4,
};
