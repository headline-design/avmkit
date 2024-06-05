import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  PropsWithChildren,
  useCallback,
  Dispatch,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Pipeline } from "@avmkit/pipeline";
import algorandGlobalActions from "@/dashboard/redux/algorand/global/globalActions";
import authActions from "@/dashboard/redux/auth/authActions";
import { getCurrentGlobalPipeState } from "@/dashboard/utils/functions";
import algorandGlobalSelectors from "@/dashboard/redux/algorand/global/globalSelctors";
import { getChain, getEndpoints } from "@/dashboard/utils/endPoints";
import { Chains, Networks } from "../utils/constants/common";
import { AnyAction } from "redux";
import { SIWASession } from "@/siwa";
import authSelectors from "../redux/auth/authSelectors";
import { NetworkDetails } from "@/avm/types";

export interface GlobalPipeState {
  provider: string;
  myAddress: string;
  mainNet: boolean;
  chain: any;
}

interface WalletConnectionContextData {
  isConnected: boolean;
  pipeState: GlobalPipeState;
  setPipeState: React.Dispatch<React.SetStateAction<GlobalPipeState>>;
  status: string;
  networkDetails: NetworkDetails | undefined;
  connectWallet: (walletType: string) => Promise<void>;
  disconnectWallet: () => void;
  openWallet: () => void;
}

export const WalletConnectionContext = createContext<
  WalletConnectionContextData | undefined
>(undefined);

export async function UserLoginRequest(signIn) {
  const result = await signIn()?.then((session?: SIWASession) => {
    console.log("---session", session);
  });
  console.log("Logged in successfully with SIWA", result);
  return result.data;
}

export const loginAttempt = async (accountAddress, dispatch) => {
  if (accountAddress) {
    try {
      const data = await UserLoginRequest({ walletAddress: accountAddress });
      console.log("Login attempt successful:", data);
    } catch (err) {
      console.log("Login attempt failed:", err);
    }
  }
};

export const WalletConnectionProvider: React.FC<PropsWithChildren<{}>> = ({
  children,
}) => {
  const isAltChainEnabled = getChain();
  const endPoints = getEndpoints();
  const [isConnected, setConnected] = useState(false);
  const [networkDetails, setNetworkDetails] = useState<
    NetworkDetails | undefined
  >();
  const [status, setStatus] = useState("disconnected");
  const dispatch: Dispatch<any> = useDispatch();
  const globalPipeState = useSelector(
    algorandGlobalSelectors.selectCurrentPipeConnectState,
  );
  const isPipeSignedIn = useSelector(algorandGlobalSelectors.selectSignedIn);
  const token = useSelector(authSelectors.selectToken);
  const [accountAddress, setAccountAddress] = useState("");
  const [loading, setLoading] = useState(true);

  const [pipeState, setPipeState] = useState<GlobalPipeState>({
    provider: globalPipeState.provider,
    myAddress: "",
    mainNet: Networks.MainNet ? true : false,
    chain: globalPipeState.chain,
  });

  const connectWallet = useCallback(async () => {
    let wallet = Pipeline.init();
    if (wallet) {
      try {
        let address = await Pipeline.connect(wallet);
        if (address) {
          setAccountAddress(address);
          console.log("----- Pipeline.connect SUCCESS:", address);
          dispatch(
            algorandGlobalActions.doPipeConnectChange({
              ...getCurrentGlobalPipeState(globalPipeState),
              myAddress: address,
              provider: Pipeline.pipeConnector,
              chain: pipeState.chain,
            }),
          );
        } else {
          console.log("----- Pipeline.connect ERROR: No address returned");
        }
      } catch (err) {
        console.log("----- Pipeline.connect ERROR:", err);
        setAccountAddress("");
        dispatch(authActions.doSignOut());
      }
    } else {
      console.log("----- Pipeline init Error: Wallet not initialized");
    }
  }, [dispatch, globalPipeState]);

  const disconnectWallet = useCallback(() => {
    dispatch(authActions.doSignOut() as unknown as AnyAction);
    Pipeline.pipeConnector = "";
    setStatus("disconnected");
    window.location.reload();
  }, [dispatch]);

  const openWallet = useCallback(async () => {
    if (pipeState.provider === "escrow") {
      return;
    } else if (pipeState.provider !== "escrow") {
      let wallet = Pipeline.pipeConnector;
      Pipeline.connect(wallet);
    }
  }, [pipeState.provider]);

  const refresh = useCallback(() => {
    if (Pipeline.pipeConnector && pipeState.myAddress) {
      if (Pipeline.address !== "") {
        setConnected(true);
        setLoading(false);
      }
    }
  }, [pipeState.myAddress]);

  const checkConnected = useCallback(() => {
    setLoading(true);
    const interval = setInterval(refresh, 1000);
    return () => clearInterval(interval);
  }, [refresh]);

  useEffect(() => {
    if (pipeState.myAddress) {
      const cleanup = checkConnected();
      return cleanup;
    }
  }, [pipeState.myAddress, checkConnected]);

  useEffect(() => {
    if (isAltChainEnabled) {
      Pipeline.EnableDeveloperAPI = true;
      Pipeline.indexer = endPoints.indexer;
      Pipeline.algod = endPoints.node;
      Pipeline.token =
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
      Pipeline.devGenHash = "IXnoWtviVVJW5LGivNFc0Dq14V3kqaXuK2u5OQrdVZo=";
      Pipeline.devGenId = "voitest-v1";
    }

    Pipeline.pipeConnector = globalPipeState.provider;
    Pipeline.address = globalPipeState.myAddress;
    setPipeState((prevState) => ({
      ...prevState,
      myAddress: globalPipeState.myAddress,
      checked: globalPipeState.mainNet,
      labelNet: globalPipeState.mainNet ? Networks.MainNet : Networks.TestNet,
      chain: globalPipeState.chain,
    }));
    setLoading(false);
  }, [globalPipeState, isAltChainEnabled]);

  const handleTransactionSuccess = useCallback(() => {
    console.log("----- Transaction Success");
  }, []);

  return (
    <WalletConnectionContext.Provider
      value={{
        isConnected,
        networkDetails,
        pipeState,
        setPipeState,
        status,
        connectWallet,
        disconnectWallet,
        openWallet,
      }}
    >
      {children}
    </WalletConnectionContext.Provider>
  );
};

export const useWalletConnection = () => {
  const context = useContext(WalletConnectionContext);
  if (!context) {
    throw new Error(
      "useWalletConnection must be used within a WalletConnectionProvider",
    );
  }
  return context;
};
