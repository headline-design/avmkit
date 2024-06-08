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
import { getChain } from "@/dashboard/utils/endPoints";
import { Networks } from "../utils/constants/common";
import { AnyAction } from "redux";
import { SIWASession } from "@/siwa";
import authSelectors from "../redux/auth/authSelectors";
import { NetworkDetails } from "@/avm/types";

export interface GlobalPipeState {
  provider: string;
  address: string;
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
  networkConfig: typeof networkConfig;
  getChainIcon: (chainId: string) => string;
}

export const WalletConnectionContext = createContext<
  WalletConnectionContextData | undefined
>(undefined);

export async function UserLoginRequest(signIn: () => Promise<SIWASession>) {
  try {
    const result = await signIn().then((session?: SIWASession) => {
      console.log("---session", session);
      return session;
    });
    console.log("Logged in successfully with SIWA", result);
    return result?.data;
  } catch (error) {
    console.error("SIWA Login Request Error:", error);
    throw error;
  }
}

// default network config - Algorand Mainnet or Voi Testnet

const configurePipeline = (
  isAltChainEnabled: boolean,
  globalPipeState: GlobalPipeState,
) => {
  if (isAltChainEnabled) {
    const voiTestnetConfig = networkConfig["1"].testnet;
    Pipeline.EnableDeveloperAPI = true;
    Pipeline.indexer = voiTestnetConfig.algod;
    Pipeline.algod = voiTestnetConfig.algod;
    Pipeline.token = voiTestnetConfig.token;
    Pipeline.devGenHash = voiTestnetConfig.genesisHash;
    Pipeline.devGenId = voiTestnetConfig.genesisId;
  } else {
    const algorandMainnetConfig = networkConfig["0"].mainnet;
    Pipeline.EnableDeveloperAPI = false;
    Pipeline.indexer = algorandMainnetConfig.algod;
    Pipeline.algod = algorandMainnetConfig.algod;
    Pipeline.token = algorandMainnetConfig.token;
    Pipeline.devGenHash = algorandMainnetConfig.genesisHash;
    Pipeline.devGenId = algorandMainnetConfig.genesisId;
  }

  Pipeline.pipeConnector = globalPipeState.provider;
  Pipeline.address = globalPipeState.address;
};

export const WalletConnectionProvider: React.FC<PropsWithChildren<{}>> = ({
  children,
}) => {
  const isAltChainEnabled = getChain();
  const [isConnected, setConnected] = useState(false);
  const [networkDetails, setNetworkDetails] = useState<
    NetworkDetails | undefined
  >();
  const [status, setStatus] = useState("disconnected");
  const dispatch: Dispatch<any> = useDispatch();
  const globalPipeState = useSelector(
    algorandGlobalSelectors.selectCurrentPipeConnectState,
  );
  const token = useSelector(authSelectors.selectToken);
  const [accountAddress, setAccountAddress] = useState("");
  const [loading, setLoading] = useState(true);

  const [pipeState, setPipeState] = useState<GlobalPipeState>({
    provider: globalPipeState.provider,
    address: globalPipeState.address || "",
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
              address: address,
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
  }, [dispatch, globalPipeState, pipeState.chain]);

  const disconnectWallet = useCallback(() => {
    dispatch(authActions.doSignOut() as unknown as AnyAction);
    Pipeline.pipeConnector = "";
    setStatus("disconnected");
    window.location.reload();
  }, [dispatch]);

  const openWallet = useCallback(async () => {
    if (pipeState.provider !== "escrow") {
      let wallet = Pipeline.pipeConnector;
      Pipeline.connect(wallet);
    }
  }, [pipeState.provider]);

  const refresh = useCallback(() => {
    if (Pipeline.pipeConnector && pipeState.address) {
      if (Pipeline.address !== "") {
        setConnected(true);
        setLoading(false);
      }
    }
  }, [pipeState.address]);

  const checkConnected = useCallback(() => {
    setLoading(true);
    const interval = setInterval(refresh, 1000);
    return () => clearInterval(interval);
  }, [refresh]);

  useEffect(() => {
    if (pipeState.address) {
      const cleanup = checkConnected();
      return cleanup;
    }
  }, [pipeState.address, checkConnected]);

  useEffect(() => {
    configurePipeline(isAltChainEnabled, globalPipeState);
    setPipeState((prevState) => ({
      ...prevState,
      address: globalPipeState.address,
      mainNet: globalPipeState.mainNet,
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
        networkConfig,
        getChainIcon,
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

export const networkConfig = {
  "0": {
    mainnet: {
      name: "Algorand",
      token: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      logoUrl: "/_static/assets/algorand-icon.jpg",
      genesisId: "mainnet-v1.0",
      algod: "https://mainnet-api.algonode.network",
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
      algod: "https://testnet-api.algonode.network",
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

export const getChainIcon = (chainId: string) => {
  const chain = networkConfig[chainId];
  return chain?.mainnet?.logoUrl ?? "";
};
