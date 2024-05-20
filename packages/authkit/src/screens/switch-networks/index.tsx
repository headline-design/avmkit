import React from 'react';

import {
  PageContent,
  ModalContent,
  ModalBody,
} from '../../components/common/modal/styles';

import useLocales from '../../hooks/use-locales';

import Button from '../../components/common/button';
import { DisconnectIcon } from '../../assets/icons';
import { OrDivider } from '../../components/common/modal';
import { useAccount } from '@/siwa/hooks/use-account';
import { useWalletConnection } from '@/dashboard/contexts/wallet-connection-context';

export const useChainIsSupported = (chainId: string | null) => {
  return chainId === '1';
}

const SwitchNetworks: React.FC = () => {

const {connectWallet}= useWalletConnection();
  const reset = connectWallet('');

  const {  chain } = useAccount();
  const isChainSupported = useChainIsSupported(chain?.id);

  const locales = useLocales({});

  const onDisconnect = () => {
   connectWallet('');
  };

  return (
    <PageContent style={{ width: 278 }}>
      <ModalContent style={{ padding: 0, marginTop: -10 }}>
        {!isChainSupported && (
          <ModalBody>
            {locales.warnings_chainUnsupported}{' '}
            {locales.warnings_chainUnsupportedResolve}
          </ModalBody>
        )}

        <div style={{ padding: '6px 8px' }}>
         CHAIN SELECTOR
        </div>

        {!isChainSupported && (
          <div style={{ paddingTop: 12 }}>
            <OrDivider />
            <Button
              icon={<DisconnectIcon />}
              variant="secondary"
              onClick={onDisconnect}
            >
              {locales.disconnect}
            </Button>
          </div>
        )}
      </ModalContent>
    </PageContent>
  );
};

export default SwitchNetworks;
