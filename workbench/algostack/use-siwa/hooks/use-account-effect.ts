import { useWalletConnection } from "@/dashboard/contexts/wallet-connection-context";
import useSIWAAccount from "./use-siwa-account";
import { useEffect } from "react";

export const useAccountEffect = ({ onConnect, onDisconnect }) => {
    const { pipeState } = useWalletConnection();
    const account = useSIWAAccount();
    useEffect(() => {
      if (account) {
        onConnect?.({
          address: account.address,
          chain: pipeState.chain,
        });
      } else {
        onDisconnect?.();
      }
    }, [account, onConnect, onDisconnect, pipeState.chain]);
  };