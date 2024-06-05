import React, {
  createContext,
  useState,
  useContext,
  PropsWithChildren,
  useEffect,
  useCallback,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import XWalletModal from "./xwallet-modal";
import {
  PipeConnectors,
  Chains,
  Networks,
} from "@/dashboard/utils/constants/common";
import { useWalletConnection } from "@/dashboard/contexts/wallet-connection-context";
import { Escrow, Pipeline } from "@avmkit/pipeline";
import { removeHttp } from "./utils";
import { NetworkConfig, NetworkDetails } from "@/avm/types";
import { networkConfig } from "@/avm/constants/network-config";

export interface ModalState {
  title: string;
  header: boolean;
  state: string;
  request?: string;
  message?: string;
  address?: string;
}

export interface AppConfig {
  name: string;
  url: string;
  icon: string;
  description?: string;
}

interface XWalletContextData {
  modalState: ModalState;
  isXWalletUnlocked: boolean;
  isXWalletModalOpen: boolean;
  unlockXWallet: () => void;
  setXWalletUnlocked: (unlocked: boolean) => void;
  setModalState: (state: ModalState) => void;
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

export const XWalletProvider: React.FC<PropsWithChildren<{}>> = ({
  children,
}) => {
  const [modalState, setModalState] = useState<ModalState>({
    title: "",
    header: false,
    state: "unlock",
    message: "",
    request: "",
  });
  const [isXWalletModalOpen, setXWalletModalOpen] = useState(false);
  const [isXWalletUnlocked, setXWalletUnlocked] = useState(false);
  const { isConnected, connectWallet, disconnectWallet } =
    useWalletConnection();
  const dispatch = useDispatch();

  const appConfig = {
    name: "Voiager",
    url: removeHttp(window.location.origin),
    icon: `${window.location.origin}/favicon.ico`,
  };

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
    setModalState({
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
        modalState,
        isXWalletUnlocked,
        isXWalletModalOpen,
        unlockXWallet,
        setXWalletUnlocked,
        setModalState,
        openXWalletModal,
        closeXWalletModal,
        networks: networkConfig,
        getNetworkDetails,
        getActiveNetwork,
        appConfig,
      }}
    >
      {children}
      {isXWalletModalOpen && <XWalletModal PipeConnectors={PipeConnectors} />}
    </XWalletContext.Provider>
  );
};

export const useXWallet = () => useContext(XWalletContext);
