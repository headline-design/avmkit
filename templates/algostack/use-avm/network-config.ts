export const networkConfig = {
  '0': {
    mainnet: {
      name: 'Algorand',
      net: 'mainnet',
      token: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      logoUrl: '/_static/assets/algorand-icon.jpg',
      genesisId: 'mainnet-v1.0',
      algod: 'https://mainnet-api.algonode.cloud',
      indexer: 'https://mainnet-idx.algonode.cloud/v2/',
      port: '443',
      decimals: '6',
      genesisHash: 'wGHE2Pwdvd7S12BL5FaOP20EGYesN73ktiC1qzkkit8=',
      additionalOptions: {
        apiUrl: 'https://api.algorand.network/mainnet',
        explorerUrl: 'https://blockpack.app/#/explorer',
        explorerTxnSegment: 'transaction',
      },
    },
    testnet: {
      name: 'Algorand',
      net: 'testnet',
      token: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      logoUrl: '/_static/assets/algorand-icon.jpg',
      algod: 'https://testnet-api.algonode.network',
      indexer: 'https://testnet-idx.algonode.cloud/v2/',
      port: '443',
      decimals: '6',
      genesisId: 'testnet-v1.0',
      genesisHash: 'SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=',
      additionalOptions: {
        apiUrl: 'https://api.algorand.network/testnet',
        explorerUrl: 'https://testnet.blockpack.app/#/explorer',
        explorerTxnSegment: 'transaction',
      },
    },
  },
  '1': {
    mainnet: {
      name: 'Voi Network',
      net: 'mainnet',
      logoUrl: '/_static/assets/voi-icon.jpg',
      algod: 'https://testnet-api.voi.nodly.io',
      indexer: 'https://testnet-idx.voi.nodly.io/v2/',
      port: '443',
      decimals: '6',
      token: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      genesisHash: 'EF46QWW34JKVEVXEWGRLZUK42A5LLYK54SU2L3RLNO4TSCW5KWNA',
      genesisId: 'voimain-v1',
      additionalOptions: {
        apiUrl: 'https://api.voi.network/mainnet',
        explorerUrl: 'https://voi.observer/explorer',
        explorerTxnSegment: 'transaction',
      },
    },
    testnet: {
      name: 'Voi Network',
      net: 'testnet',
      token: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      logoUrl: '/_static/assets/voi-icon.jpg',
      algod: 'https://testnet-api.voi.nodly.io',
      indexer: 'https://testnet-idx.voi.nodly.io/v2/',
      port: '443',
      decimals: '6',
      genesisHash: 'IXnoWtviVVJW5LGivNFc0Dq14V3kqaXuK2u5OQrdVZo=',
      genesisId: 'voitest-v1',
      additionalOptions: {
        apiUrl: 'https://api.voi.network/testnet',
        explorerUrl: 'https://voi.observer/explorer',
        explorerTxnSegment: 'transaction',
      },
    },
  },
};

export const getChainIcon = (chainId: string) => {
  const chain = networkConfig[chainId];
  return chain?.mainnet?.logoUrl ?? '';
};
