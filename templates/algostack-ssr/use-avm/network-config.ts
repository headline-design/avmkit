export const networkConfig = {
  "0": {
    mainnet: {
      name: "Algorand",
      token: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      logoUrl: "/_static/assets/algorand-icon.jpg",
      genesisId: "mainnet-v1.0",
      algod: "https://mainnet-api.algonode.cloud",
      port: "443",
      decimals: "6",
      genesisHash: "wGHE2Pwdvd7S12BL5FaOP20EGYesN73ktiC1qzkkit8=",
      additionalOptions: {
        apiUrl: "https://api.algorand.network/mainnet",
        explorerUrl: "https://blockpack.app/#/explorer",
        explorerTxnSegment: "transaction",
      },
    },
    testnet: {
      name: "Algorand",
      token: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      logoUrl: "/_static/assets/algorand-icon.jpg",
      algod: "https://testnet-api.algonode.cloud",
      port: "443",
      decimals: "6",
      genesisId: "testnet-v1.0",
      genesisHash: "SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=",
      additionalOptions: {
        apiUrl: "https://api.algorand.network/testnet",
        explorerUrl: "https://testnet.blockpack.app/#/explorer",
        explorerTxnSegment: "transaction",
      },
    },
  },
  "1": {
    mainnet: {
      name: "Voi Network",
      logoUrl: "/_static/assets/voi-icon.jpg",
      algod: "https://mainnet-api.voi.nodly.io",
      port: "443",
      decimals: "6",
      token: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      genesisHash: "EF46QWW34JKVEVXEWGRLZUK42A5LLYK54SU2L3RLNO4TSCW5KWNA",
      genesisId: "voimain-v1",
      additionalOptions: {
        apiUrl: "https://api.voi.network/mainnet",
        explorerUrl: "https://voi.observer/explorer",
        explorerTxnSegment: "transaction",
      },
    },
    testnet: {
      name: "Voi Network",
      token: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      logoUrl: "/_static/assets/voi-icon.jpg",
      algod: "https://testnet-api.voi.nodly.io",
      port: "443",
      decimals: "6",
      genesisHash: "IXnoWtviVVJW5LGivNFc0Dq14V3kqaXuK2u5OQrdVZo=",
      genesisId: "voitest-v1",
      additionalOptions: {
        apiUrl: "https://api.voi.network/testnet",
        explorerUrl: "https://voi.observer/explorer",
        explorerTxnSegment: "transaction",
      },
    },
  },
};