import { useConfig } from './useChainIsSupported';

export type Chain = {
  id: number;
  name: string;
  logo: string;
  color: string;
  symbol: string;
  decimals: number;
  rpc: string;
};

export function useChains() {
  const wagmi = useConfig();
  const chains = wagmi?.chains ?? [];
  return chains.map((c) => c) as Chain[];
}
