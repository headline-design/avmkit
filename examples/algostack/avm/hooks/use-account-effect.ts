import { useEffect } from 'react';
import { useWallet } from '../wallet-context';

const useAccountEffect = ({ onDisconnect }) => {
  const { instance } = useWallet();

  useEffect(() => {
    // Listen for disconnect events on the blockchain wallet instance
    const handleDisconnect = () => {
      if (onDisconnect) {
        onDisconnect();
      }
    };

    instance?.on('disconnect', handleDisconnect);

    return () => instance?.off('disconnect', handleDisconnect);
  }, [instance, onDisconnect]);
};

export default useAccountEffect;
