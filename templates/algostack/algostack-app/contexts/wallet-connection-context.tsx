"use client";

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
import { Networks } from "../utils/constants/common";
import { AnyAction } from "redux";
import authSelectors from "../redux/auth/authSelectors";
import { NetworkDetails } from "@/avm/types";
import { networkConfig } from "@/avm/network-config";
import algorandGlobalSelectors from '@/dashboard/redux/algorand/global/globalSelectors';

export interface GlobalPipeState {
  provider: string;
  address: string;
  mainNet: boolean;
  isMainNet: boolean;
  isAltChainEnabled: boolean;
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

// default network config - Algorand Mainnet or Voi Testnet

const configurePipeline = (
  globalPipeState: GlobalPipeState,
  isMainNet: boolean,
  isAltChainEnabled: boolean,
) => {
  if (isAltChainEnabled && !isMainNet) {
    const voiTestnetConfig = networkConfig["1"].testnet;
    Pipeline.EnableDeveloperAPI = true;
    Pipeline.indexer = voiTestnetConfig.algod;
    Pipeline.algod = voiTestnetConfig.algod;
    Pipeline.token = voiTestnetConfig.token;
    Pipeline.devGenHash = voiTestnetConfig.genesisHash;
    Pipeline.devGenId = voiTestnetConfig.genesisId;
  } else if (isAltChainEnabled && isMainNet) {
    const voiMainnetConfig = networkConfig["1"].mainnet;
    Pipeline.EnableDeveloperAPI = true;
    Pipeline.indexer = voiMainnetConfig.algod;
    Pipeline.algod = voiMainnetConfig.algod;
    Pipeline.token = voiMainnetConfig.token;
    Pipeline.devGenHash = voiMainnetConfig.genesisHash;
    Pipeline.devGenId = voiMainnetConfig.genesisId;
  } else if (!isAltChainEnabled && !isMainNet) {
    const algorandTestnetConfig = networkConfig["0"].testnet;
    Pipeline.EnableDeveloperAPI = true;
    Pipeline.indexer = algorandTestnetConfig.algod;
    Pipeline.algod = algorandTestnetConfig.algod;
    Pipeline.token = algorandTestnetConfig.token;
    Pipeline.devGenHash = algorandTestnetConfig.genesisHash;
    Pipeline.devGenId = algorandTestnetConfig.genesisId;
  } else {
    const algorandMainnetConfig = networkConfig["0"].mainnet;
    Pipeline.EnableDeveloperAPI = true;
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
  const [isConnected, setConnected] = useState(false);
  const [networkDetails, setNetworkDetails] = useState<
    NetworkDetails | undefined
  >();
  const [status, setStatus] = useState("disconnected");
  const dispatch: Dispatch<any> = useDispatch();

  const token = useSelector(authSelectors.selectToken);
  const [accountAddress, setAccountAddress] = useState("");
  const [loading, setLoading] = useState(true);

  const globalPipeState = useSelector(
    algorandGlobalSelectors.selectCurrentPipeConnectState,
  );

  const isMainNet = globalPipeState.isMainNet;
  const isAltChainEnabled = globalPipeState.isAltChainEnabled;

  const [pipeState, setPipeState] = useState<GlobalPipeState>({
    provider: globalPipeState.provider || "",
    address: globalPipeState.address || "",
    mainNet: Networks.MainNet ? true : false,
    isMainNet: globalPipeState.isMainNet,
    isAltChainEnabled: globalPipeState.isAltChainEnabled,
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
    configurePipeline(globalPipeState, isMainNet, isAltChainEnabled);
    setPipeState((prevState) => ({
      ...prevState,
      address: globalPipeState.address,
      mainNet: globalPipeState.mainNet,
      chain: globalPipeState.chain,
      algod: globalPipeState.algod,
    }));
    setLoading(false);
  }, [globalPipeState, isAltChainEnabled, isMainNet]);

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

export const getChainIcon = (chainId: string) => {
  const chain = networkConfig[chainId];
  return chain?.mainnet?.logoUrl ?? "";
};
