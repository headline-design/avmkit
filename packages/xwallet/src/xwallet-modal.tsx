import { useXWallet } from "./xwallet-context";
import { BaseModal } from "./ui/base-modal/base-modal";

import {
  ConnectScreen,
  HomeScreen,
  UnlockScreen,
  SendScreen,
  ReceiveScreen,
  AssetScreen,
  SettingsScreen,
  HistoryScreen,
  NetworksScreen,
  ConfirmationScreen,
  LoadingScreen,
} from "./screens";

const XWalletModal = ({
  pipeState,
  useWalletConnection,
  PipeConnectors,
}: {
  pipeState: any;
  useWalletConnection: any;
  PipeConnectors: any;
}) => {
  const {
    xWalletState,
    closeXWalletModal,
    isXWalletModalOpen,
    isXWalletUnlocked,
    openXWalletModal,
  } = useXWallet();

  const handleXWalletClose = () => {
    closeXWalletModal();
  };

  const ActiveScreen = () => {
    switch (xWalletState.state) {
      case "unlock":
        return (
          <UnlockScreen
            useWalletConnection={useWalletConnection}
            PipeConnectors={PipeConnectors}
          />
        );
      case "connect":
        return (
          <ConnectScreen
            pipeState={pipeState}
            useWalletConnection={useWalletConnection}
            PipeConnectors={PipeConnectors}
          />
        );
      case "home":
        return <HomeScreen pipeState={pipeState} />;
      case "actions":
        return <HomeScreen pipeState={pipeState} />;
      case "send":
        return <SendScreen />;
      case "receive":
        return <ReceiveScreen />;
      case "asset":
        return <AssetScreen asset={{}} />;
      case "settings":
        return <SettingsScreen />;
      case "history":
        return <HistoryScreen />;
      case "chains":
        return <NetworksScreen />;
      case "confirmation":
        return (
          <ConfirmationScreen
            PipeConnectors={PipeConnectors}
            useWalletConnection={useWalletConnection}
          />
        );
      case "loading":
        return <LoadingScreen />;
      default:
        return (
          <UnlockScreen
            useWalletConnection={useWalletConnection}
            PipeConnectors={PipeConnectors}
          />
        );
    }
  };

  return (
    <BaseModal
      onClose={handleXWalletClose}
      showModal={isXWalletModalOpen}
      title={xWalletState.title}
      header={xWalletState.header}
    >
      <ActiveScreen />
    </BaseModal>
  );
};

export default XWalletModal;
