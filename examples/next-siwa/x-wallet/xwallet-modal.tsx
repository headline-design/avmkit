import React, { useEffect } from 'react';
import { useXWallet } from './xwallet-context';
import { BaseModal } from './ui/base-modal/base-modal';
import algorandGlobalSelectors from '@/dashboard/redux/algorand/global/globalSelctors';

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
} from './screens';
import './globals.css';
import { useSelector } from 'react-redux';

const XWalletModal = ({ PipeConnectors }: { PipeConnectors: any }) => {
  const { modalState, closeXWalletModal, isXWalletModalOpen, isXWalletUnlocked, openXWalletModal } =
    useXWallet();

  const pipeState = useSelector(algorandGlobalSelectors.selectCurrentPipeConnectState);

  const handleXWalletClose = () => {
    closeXWalletModal();
  };

  const ActiveScreen = () => {
    switch (modalState.state) {
      case 'unlock':
        return <UnlockScreen pipeState={pipeState}/>;
      case 'connect':
        return <ConnectScreen pipeState={pipeState} />;
      case 'home':
        return <HomeScreen  pipeState={pipeState}/>;
      case 'actions':
        return <HomeScreen  pipeState={pipeState}/>;
      case 'send':
        return <SendScreen />;
      case 'receive':
        return <ReceiveScreen />;
      case 'asset':
        return <AssetScreen asset={{}} />;
      case 'settings':
        return <SettingsScreen />;
      case 'history':
        return <HistoryScreen />;
      case 'chains':
        return <NetworksScreen />;
      case 'confirmation':
        return <ConfirmationScreen />;
      case 'loading':
        return <LoadingScreen />;
      default:
        return <UnlockScreen />;
    }
  };

  return (
    <BaseModal
      atlasUi={true}
      onClose={handleXWalletClose}
      open={isXWalletModalOpen}
      title={modalState.title}
      header={modalState.header}
    >
      <ActiveScreen />
    </BaseModal>
  );
};

export default XWalletModal;
