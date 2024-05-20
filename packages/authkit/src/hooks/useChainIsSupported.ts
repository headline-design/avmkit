export function useConfig() {
  return {
    chains: [
      {
        id: 1,
        name: 'Ethereum',
        logo: 'ethereum',
        color: '#627EEA',
        symbol: 'ETH',
        decimals: 18,
        rpc: 'https://mainnet.infura.io/v3/0f9d4b0f9f6f4b1aae1b9e2c7f6c6a2a',
      },
      {
        id: 56,
        name: 'Binance Smart Chain',
        logo: 'binance',
        color: '#F0B90B',
        symbol: 'BNB',
        decimals: 18,
        rpc: 'https://bsc-dataseed.binance.org/',
      },
      {
        id: 137,
        name: 'Polygon',
        logo: 'polygon',
        color: '#8247E5',
        symbol: 'MATIC',
        decimals: 18,
        rpc: 'https://rpc-mainnet.maticvigil.com/',
      },
    ],
  };
}

export function useChainIsSupported(chainId?: number): boolean | null {
  const { chains } = useConfig();
  if (!chainId) return false;
  return chains.some((x) => x.id === chainId);
}
