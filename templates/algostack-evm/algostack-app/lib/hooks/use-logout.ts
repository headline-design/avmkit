import { useState, useCallback, useMemo } from "react";
import { signOut, useSession } from "next-auth/react";
import { useSelector } from "react-redux";
import algorandGlobalSelectors from "@/dashboard/redux/algorand/global/globalSelectors";
import { debounce} from "lodash";
import { useSIWA } from "@/use-siwa";
import { siweConfig } from "@/algostack-app/contexts/web3/evm-context";
import { useWalletConnection } from "@/algostack-app/contexts/wallet-connection-context";
import { useSIWE } from "connectkit";

export const useLogout = () => {
  const [signingOut, setSigningOut] = useState(false);
  const [logoutError, setLogoutError] = useState(null);
  const globalPipeState = useSelector(
    algorandGlobalSelectors.selectCurrentPipeConnectState,
  );

  // Wrap pipeState initialization in its own useMemo
  const pipeState = useMemo(() => globalPipeState || {}, [globalPipeState]);
  const { data: session } = useSession();
  const { signOut: signOutWithSIWA, data: siwaData } = useSIWA();
  const { signOut: signOutWithSIWE, data: siweData } = useSIWE();

  const { disconnectWallet: signOutWithPipeline } = useWalletConnection();
  const urlCallback = "/"

  // Create the debounced function using useMemo
  const debouncedDisconnect = useMemo(
    () =>
      debounce(async () => {
        try {
          setLogoutError(null); // Reset error state before attempting logout

          if (siwaData?.address) {
            await signOutWithSIWA();
            siwaData.address = null; // Reflect that the address is now null
          }

          if (!siwaData?.address && pipeState.address) {
            await signOutWithPipeline();
            pipeState.address = null; // Reflect that the address is now null
          }

          if (siweData?.address) {
            await siweConfig.signOut();
            await signOutWithSIWE().then(() => {});
            siweData.address = null; // Reflect that the address is now null
          }

          if (
            !siwaData?.address &&
            !pipeState.address &&
            !siweData?.address
          ) {
            setSigningOut(true);
            await signOut({
              callbackUrl: urlCallback,
              redirect: false,
            });
          } else {
            console.log(
              "Either SIWA or Pipeline state address was found, not calling signOut",
              siwaData?.address,
              pipeState.address,
            );
          }
        } catch (error) {
          console.error("Error during logout:", error);
          setLogoutError("Failed to log out. Please try again." as any);
        }
      }, 300),
    [siwaData, pipeState, signOutWithSIWA, signOutWithPipeline],
  );

  // Memoize the debounced function with useCallback
  const handleDisconnect = useCallback(() => {
    debouncedDisconnect();
  }, [debouncedDisconnect]);

  return { handleDisconnect, signingOut, logoutError };
};
