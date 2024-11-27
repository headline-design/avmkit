import { useWalletConnection } from '@/dashboard/contexts/wallet-connection-context';

const useSIWAAccount = () => {
  const { pipeState } = useWalletConnection();

  const address = pipeState?.address;

  return {
    address,
    chain: { id: 1 },
  };
};

export default useSIWAAccount;
