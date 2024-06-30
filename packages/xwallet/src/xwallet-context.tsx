import React, {
  createContext,
  useState,
  useContext,
  PropsWithChildren,
  useEffect,
  useCallback,
} from "react";
import XWalletModal from "./xwallet-modal";
import { Escrow, Pipeline } from "@avmkit/pipeline";
import { removeHttp } from "./utils";
import { NetworkConfig, NetworkDetails } from "./types";
import "./globals.css";

export interface XWalletModalState {
  title: string;
  header: boolean;
  state: string;
  request?: string;
  message?: string;
  loadingMessage?: string;
  address?: string;
}

export interface AppConfig {
  name: string;
  url: string;
  icon: string;
  description?: string;
}

interface XWalletContextData {
  xWalletState: XWalletModalState;
  isXWalletUnlocked: boolean;
  isXWalletModalOpen: boolean;
  unlockXWallet: () => void;
  setXWalletUnlocked: (unlocked: boolean) => void;
  setXWalletState: (state: XWalletModalState) => void;
  openXWalletModal: () => void;
  closeXWalletModal: () => void;
  networks: NetworkConfig;
  appConfig: AppConfig;
  getNetworkDetails: (
    networkName: string,
    type: "Mainnet" | "Testnet",
  ) => NetworkDetails | undefined;
  getActiveNetwork: () => NetworkDetails | undefined;
}

export const XWalletContext = createContext<XWalletContextData>(null!);

export const XWalletProvider: React.FC<
  PropsWithChildren<{
    useWalletConnection: any;
    PipeConnectors;
  }>
> = ({ children, useWalletConnection, PipeConnectors }) => {
  const [xWalletState, setXWalletState] = useState<XWalletModalState>({
    title: "",
    header: false,
    state: "unlock",
    message: "",
    request: "",
  });
  const [isXWalletModalOpen, setXWalletModalOpen] = useState(false);
  const [isXWalletUnlocked, setXWalletUnlocked] = useState(false);
  const {
    isConnected,
    connectWallet,
    disconnectWallet,
    networkConfig,
    pipeState,
  } = useWalletConnection();

  let appConfig = { name: "", url: "", icon: "" };
  if (typeof window !== "undefined") {
    appConfig = {
      name: `${window.location.origin}`,
      url: removeHttp(window.location.origin),
      icon: `${window.location.origin}/favicon.ico`,
    };
  }

  const unlockXWallet = useCallback(() => {
    setXWalletUnlocked(true);
    if (!isConnected) {
      openXWalletModal();
    }
  }, [isConnected]);

  const openXWalletModal = () => {
    setXWalletModalOpen(true);
  };

  const closeXWalletModal = () => {
    setXWalletModalOpen(false);
    setXWalletState({
      title: "",
      header: false,
      state: "unlock",
      request: "",
      message: "",
    });
  };

  const getNetworkDetails = (networkName, type) => {
    const networkDetail = networkConfig[networkName]
      ? networkConfig[networkName][type]
      : undefined;
    if (networkDetail) {
      return {
        ...networkDetail,
        status: Pipeline.algod === networkDetail.algod ? "active" : "inactive",
      };
    }
    return undefined;
  };

  const getActiveNetwork = () => {
    for (let networkName in networkConfig) {
      for (let type in networkConfig[networkName]) {
        const detail = getNetworkDetails(networkName, type);
        if (detail && detail.status === "active") {
          return detail;
        }
      }
    }
    return undefined;
  };

  const checkAndOpenModalForTransaction = () => {
    if (!isXWalletUnlocked || !Escrow.address) {
      //console.log('not unlocked', typeof Escrow.address);
    }
  };

  // Automatically check and possibly open the modal when the component mounts
  useEffect(() => {
    checkAndOpenModalForTransaction();
  }, [Escrow, isXWalletUnlocked]);

  return (
    <XWalletContext.Provider
      value={{
        xWalletState,
        isXWalletUnlocked,
        isXWalletModalOpen,
        unlockXWallet,
        setXWalletUnlocked,
        setXWalletState,
        openXWalletModal,
        closeXWalletModal,
        networks: networkConfig,
        getNetworkDetails,
        getActiveNetwork,
        appConfig,
      }}
    >
      {children}
      {isXWalletModalOpen && (
        <XWalletModal
          pipeState={pipeState}
          useWalletConnection={useWalletConnection}
          PipeConnectors={PipeConnectors}
        />
      )}
    </XWalletContext.Provider>
  );
};

export const useXWallet = () => useContext(XWalletContext);
