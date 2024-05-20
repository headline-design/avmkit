import { useWalletConnection } from "@/dashboard/contexts/wallet-connection-context";
import useSIWAAccount from "./use-siwa-account";
import { useEffect } from "react";

export const useAccount = () => {
    const { pipeState } = useWalletConnection();
    const account = useSIWAAccount();
    return {
  isConnected: !!account,
      address: account.address,
      chain: pipeState.chain,
    };
  }
