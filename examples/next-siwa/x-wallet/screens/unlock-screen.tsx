import React, { useState, useEffect } from 'react';
import nacl from 'tweetnacl';
import { Escrow, Pipeline } from '@siwa/pipeline';
import { useXWallet } from '@/wallet/xwallet-context';
import { IconCross } from '../icons';
import { cn } from '@/dashboard/lib/utils';
import { cBuffer, deBuffer, nonce, pad } from '../utils';
import { useWalletConnection } from '@/dashboard/contexts/wallet-connection-context';
import { PipeConnectors } from '@/dashboard/utils/constants/common';
import { wallet } from '../constants';

const UnlockScreen = () => {
  const [password, setPassword] = useState('');
  const { closeXWalletModal, openXWalletModal, isXWalletModalOpen, setModalState, modalState } =
    useXWallet();
  const [walletFirstCreated, setWalletFirstCreated] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [savedMnemonic, setSavedMnemonic] = useState(localStorage.getItem('xMnemonic'));
  const [passwordErrorObj, setPasswordErrorObj] = useState({
    isError: false,
    text: '',
  });

  const handlePasswordInput = (e) => {
    setPassword(e.target.value);
    setPasswordErrorObj({ isError: false, text: '' }); // Reset the error object when changing the password
  };

  const { unlockXWallet } = useXWallet();
  const { connectWallet } = useWalletConnection();

  const handleConfirm = () => {
    Pipeline.connector = PipeConnectors[wallet.connector]; // Update the connector
    console.log('Pipeline.connector', Pipeline.connector);
    connectWallet(PipeConnectors[wallet.connector]);
    unlockXWallet();
    setModalState({
      title: 'Actions',
      header: false,
      state: 'actions',
    });
  };

  const handleSubmit = () => {
    const paddedPassword = pad(cBuffer(password));

    if (savedMnemonic) {
      const decryptedArray = nacl.secretbox.open(cBuffer(savedMnemonic), nonce, paddedPassword);
      if (!decryptedArray) {
        setPasswordErrorObj({ isError: true, text: 'Incorrect password' });
        return;
      }
      const decryptedMnemonic = deBuffer(decryptedArray);
      Escrow.importAccount(decryptedMnemonic);
      //console.log('escrow address', Escrow.address);
      setWalletAddress(Escrow.address);
      unlockXWallet(); // Set the wallet to unlocked
if(modalState.request === 'open') {
  setModalState({
    title: 'XWallet',
    header: true,
    state: 'actions',
    address: Escrow.address,
  });
}

      if (modalState.request === 'connect') {
        // Third-party request to connect to the wallet
        setModalState({
          title: 'Connect account',
          header: true,
          state: 'connect',
          request: 'connect',
          address: Escrow.address,
        });
      }
      if (modalState.request === 'login') {
        handleConfirm();
      }
    } else {
      const account = Escrow.createAccount();
      const encryptedMnemonic = cBuffer(account.mnemonic);
      const encrypted = nacl.secretbox(encryptedMnemonic, nonce, paddedPassword);
      localStorage.setItem('xMnemonic', deBuffer(encrypted));
      localStorage.setItem('xAddress', Escrow.address);
      setWalletFirstCreated(true); // <-- set the wallet to unlocked
      setSavedMnemonic(localStorage.getItem('xMnemonic'));
      Pipeline.pipeConnector = PipeConnectors.XWallet;
      connectWallet(PipeConnectors.XWallet);
    }
  };

  useEffect(() => {
    if (!savedMnemonic) openXWalletModal();
  }, [savedMnemonic]);

  return (
      <div className="wallet-container wallet-main-wrapper" style={{ overflowY: 'auto' }}>
        <div
          className="coverWrapper"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            flexDirection: 'row',
          }}
        >
          <div className="onboard-cover-wrapper-icon">
            <IconCross width={60} height={60} className="onboard-cover-icon" />
          </div>
        </div>
        <div
          className="wallet-space wallet-space-padding"
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          <div className="wallet-space-item space-w-full">
            <div className="wallet-space-title" style={{ fontWeight: 700 }}>
              Your portal to Web3
            </div>
          </div>
          <div className="wallet-space-item space-w-full">
            <div className="wallet-space-text space-w-full">Wallet · Trade · NFT · DeFi · DApp</div>
          </div>
        </div>
        <div className="wallet-content-main">
          <form className="xwallet-form xwallet-form-vertical">
            <div className="_password_p99nf_29 xwallet-form-item-md xwallet-form-item xwallet-form-item-no-label">
              <div className="xwallet-form-item-control">
                <div className="xwallet-form-item-control-input">
                  <div className="xwallet-form-item-control-input-content">
                    <div className="xwallet-input xwallet-input-xl">
                      <div className="xwallet-input-box">
                        <input
                          autoComplete="off"
                          className="xwallet-input-password xwallet-input-input"
                          placeholder="Enter your password"
                          type="password"
                          value={password}
                          onChange={handlePasswordInput}
                          maxLength={50}
                          autoCapitalize="off"
                          autoCorrect="off"
                          defaultValue=""
                          autoSave="off"
                        />
                        <div className="xwallet-input-suffix">
                          <i className="icon iconfont xwallet-input-switch-icon suffix-icon xds-eye-hide-filled" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="_btn_p99nf_44 xwallet-form-item-md xwallet-form-item xwallet-form-item-no-label">
              <div className="xwallet-form-item-control">
                <div className="xwallet-form-item-control-input">
                  <div className="xwallet-form-item-control-input-content">
                    <button
                      disabled={password.length === 0}
                      className={cn(
                        password.length === 0 ? 'btn-disabled' : 'xwallet-btn-fill-highlight',
                        'xwallet-btn xwallet-btn-xl btn-fill-highlight block mobile',
                      )}
                      onClick={handleSubmit}
                      type="submit"
                    >
                      <span className="btn-content">
                        {' '}
                        {savedMnemonic && !walletFirstCreated ? 'Unlock' : 'Create'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
          <a href="#forget-password" target="_self" className="forgotPassword">
            <div className="xwallet-btn-ghost-content" style={{ fontWeight: 500 }}>
              Forgot password?
            </div>
          </a>
        </div>
      </div>
  );
};

export default UnlockScreen;
