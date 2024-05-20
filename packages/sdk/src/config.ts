import {
  ALGO_TESTNET_INDEXER_URL,
  ALGO_TESTNET_INDEXER_HEALTH_URL,
  ALGO_TESTNET_INDEXER_HEALTH_ALT_URL,
  ALGO_TESTNET_NODE_URL,
  ALGO_TESTNET_NODE_ALT_URL,
  ALGO_TESTNET_BALANCE_INDEXER_URL,
  ALGO_TESTNET_EXPLORER_URL,
  ALGO_MAINNET_INDEXER_URL,
  ALGO_MAINNET_INDEXER_ALT_URL,
  ALGO_MAINNET_INDEXER_HEALTH_URL,
  ALGO_MAINNET_INDEXER_HEALTH_ALT_URL,
  ALGO_MAINNET_NODE_URL,
  ALGO_MAINNET_NODE_ALT_URL,
  ALGO_MAINNET_EXPLORER_URL,
  VOI_TESTNET_INDEXER_URL,
  VOI_TESTNET_INDEXER_HEALTH_URL,
  VOI_TESTNET_INDEXER_HEALTH_ALT_URL,
  VOI_TESTNET_NODE_URL,
  VOI_TESTNET_NODE_ALT_URL,
  VOI_TESTNET_BALANCE_INDEXER_URL,
  VOI_TESTNET_EXPLORER_URL,
  VOI_MAINNET_INDEXER_URL,
  VOI_MAINNET_INDEXER_ALT_URL,
  VOI_MAINNET_INDEXER_HEALTH_URL,
  VOI_MAINNET_INDEXER_HEALTH_ALT_URL,
  VOI_MAINNET_NODE_URL,
  VOI_MAINNET_NODE_ALT_URL,
  VOI_MAINNET_EXPLORER_URL,
  STATIC_ALGO_PRICE_URL,
  STATIC_ASSET_PRICE_URL,
  STATIC_ASSET_PRICES_URL,
  STATIC_STAMP_URL,
} from './constants';

let local_network_env = 'mainnet';
let local_db_env = 'remote';
let local_chain_env = 'algorand';
let local_runtime_env = 'node';

let INDEXER_URL: string;
let INDEXER_ALT_URL: string;
let NODE_URL: string;
let NODE_ALT_URL: string;
let INDEXER_HEALTH_URL: string;
let INDEXER_HEALTH_ALT_URL: string;
let IPFS_URL: string;
let SERVER_URL: string;
let EXPLORER_URL: string;
let BALANCE_INDEXER_URL: string;
let ALGO_PRICE_URL: string;
let ASSET_PRICE_URL: string;
let ASSET_PRICES_URL: string;
let STAMP_URL: string;

const configureURLs = () => {
  const network_env: string = process.env.NETWORK_ENV || local_network_env;
  const db_env: string = process.env.DB_ENV || local_db_env;
  const chain_env: string = process.env.CHAIN_ENV || local_chain_env;
  const runtime_env: string = process.env.RUNTIME_ENV || local_runtime_env;

  if (chain_env === 'algorand') {
    if (network_env === 'testnet') {
      // Algo Testnet
      INDEXER_URL = ALGO_TESTNET_INDEXER_URL;
      INDEXER_ALT_URL = ALGO_TESTNET_INDEXER_HEALTH_ALT_URL;
      INDEXER_HEALTH_URL = ALGO_TESTNET_INDEXER_HEALTH_URL;
      INDEXER_HEALTH_ALT_URL = ALGO_TESTNET_INDEXER_HEALTH_ALT_URL;
      NODE_URL = ALGO_TESTNET_NODE_URL;
      NODE_ALT_URL = ALGO_TESTNET_NODE_ALT_URL;
      BALANCE_INDEXER_URL = ALGO_TESTNET_BALANCE_INDEXER_URL;
      EXPLORER_URL = ALGO_TESTNET_EXPLORER_URL;
    } else if (network_env === 'mainnet') {
      // Algo Mainnet
      INDEXER_URL = ALGO_MAINNET_INDEXER_URL;
      INDEXER_ALT_URL = ALGO_MAINNET_INDEXER_ALT_URL;
      INDEXER_HEALTH_URL = ALGO_MAINNET_INDEXER_HEALTH_URL;
      INDEXER_HEALTH_ALT_URL = ALGO_MAINNET_INDEXER_HEALTH_ALT_URL;
      NODE_URL = ALGO_MAINNET_NODE_URL;
      NODE_ALT_URL = ALGO_MAINNET_NODE_ALT_URL;
      EXPLORER_URL = ALGO_MAINNET_EXPLORER_URL;
    }
  } else if (chain_env === 'voi') {
    if (network_env === 'testnet') {
      // Voi Testnet
      INDEXER_URL = VOI_TESTNET_INDEXER_URL;
      INDEXER_ALT_URL = VOI_TESTNET_INDEXER_HEALTH_ALT_URL;
      INDEXER_HEALTH_URL = VOI_TESTNET_INDEXER_HEALTH_URL;
      INDEXER_HEALTH_ALT_URL = VOI_TESTNET_INDEXER_HEALTH_ALT_URL;
      NODE_URL = VOI_TESTNET_NODE_URL;
      NODE_ALT_URL = VOI_TESTNET_NODE_ALT_URL;
      BALANCE_INDEXER_URL = VOI_TESTNET_BALANCE_INDEXER_URL;
      EXPLORER_URL = VOI_TESTNET_EXPLORER_URL;
    } else if (network_env === 'mainnet') {
      // Voi Mainnet
      INDEXER_URL = VOI_MAINNET_INDEXER_URL;
      INDEXER_ALT_URL = VOI_MAINNET_INDEXER_ALT_URL;
      INDEXER_HEALTH_URL = VOI_MAINNET_INDEXER_HEALTH_URL;
      INDEXER_HEALTH_ALT_URL = VOI_MAINNET_INDEXER_HEALTH_ALT_URL;
      NODE_URL = VOI_MAINNET_NODE_URL;
      NODE_ALT_URL = VOI_MAINNET_NODE_ALT_URL;
      EXPLORER_URL = VOI_MAINNET_EXPLORER_URL;
    }
  }

  ALGO_PRICE_URL = STATIC_ALGO_PRICE_URL;
  ASSET_PRICE_URL = STATIC_ASSET_PRICE_URL;
  ASSET_PRICES_URL = STATIC_ASSET_PRICES_URL;
  STAMP_URL = STATIC_STAMP_URL;
};

configureURLs(); // Initial configuration

export const loadConfig = (
  { network, chain, db, runtime } = {
    network: local_network_env,
    chain: local_chain_env,
    db: local_db_env,
    runtime: local_runtime_env,
  }
) => {
  if (network) {
    local_network_env = network;
  }
  if (chain) {
    local_chain_env = chain;
  }
  if (db) {
    local_db_env = db;
  }
  if (runtime) {
    local_runtime_env = runtime;
  }
  configureURLs();
};

// Export variables
export {
  INDEXER_URL,
  INDEXER_ALT_URL,
  NODE_URL,
  NODE_ALT_URL,
  INDEXER_HEALTH_URL,
  INDEXER_HEALTH_ALT_URL,
  IPFS_URL,
  SERVER_URL,
  EXPLORER_URL,
  BALANCE_INDEXER_URL,
  ALGO_PRICE_URL,
  ASSET_PRICE_URL,
  ASSET_PRICES_URL,
  STAMP_URL,
};
