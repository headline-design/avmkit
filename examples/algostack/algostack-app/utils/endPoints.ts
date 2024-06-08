import { ALT_CHAIN_NETWORK_KEY, CHAIN_NETWORK_KEY } from '@/dashboard/utils/constants/common';
import localStore from 'store';

// A helper function to get network type
export const getNetworkType = () =>
  localStore.get(CHAIN_NETWORK_KEY) ?? process.env.NEXT_NETWORK_TYPE === 'mainnet';

export const getChain = () => localStore.get(ALT_CHAIN_NETWORK_KEY);

export const staticValues = {
  roundTime: 3.4,
};
