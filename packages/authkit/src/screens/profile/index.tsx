import React, { useEffect, useState } from 'react';
import { useContext } from '../../components/authkit';
import {
  isSafeConnector,
  nFormatter,
  truncateEthAddress,
} from '../../utils';


import {
  AvatarContainer,
  AvatarInner,
  ChainSelectorContainer,
  BalanceContainer,
  LoadingBalance,
  Balance,
} from './styles';

import {
  PageContent,
  ModalBody,
  ModalContent,
  ModalH1,
} from '../../components/common/modal/styles';
import Button from '../../components/common/button';
import Avatar from '../../avatar/avatar';

import { DisconnectIcon } from '../../assets/icons';
import CopyToClipboard from '../../components/common/copy-to-clipboard';
import { AnimatePresence } from 'framer-motion';
import { useThemeContext } from '../../components/authkit-theme-provider/authkit-theme-provider';
import useLocales from '../../hooks/use-locales';
import { useAccount } from '@/siwa/hooks/use-account';

const Profile: React.FC<{ closeModal?: () => void }> = ({ closeModal }) => {
  const context = useContext();
  const themeContext = useThemeContext();

  const locales = useLocales();

  const { address, isConnected, chain } = useAccount();

  const [shouldDisconnect, setShouldDisconnect] = useState(false);

  useEffect(() => {
    if (!isConnected) context.setOpen(false);
  }, [isConnected]);

  useEffect(() => {
    if (!shouldDisconnect) return;

    // Close before disconnecting to avoid layout shifting while modal is still open
    if (closeModal) {
      closeModal();
    } else {
      context.setOpen(false);
    }
    return () => {
    console.log('disconnecting');
    };
  }, [shouldDisconnect ]);

  const separator = ['web95', 'rounded', 'minimal'].includes(
    themeContext.theme ?? context.theme ?? ''
  )
    ? '....'
    : undefined;
  return (
    <PageContent>
      <ModalContent style={{ paddingBottom: 22, gap: 6 }}>
        <AvatarContainer>
          <AvatarInner>
            <ChainSelectorContainer>
              CHAIN SELECTOR
            </ChainSelectorContainer>
            <Avatar address={address} />
          </AvatarInner>
        </AvatarContainer>
        <ModalH1>
          <CopyToClipboard string={address}>
            {address ?? truncateEthAddress(address, separator)}
          </CopyToClipboard>
        </ModalH1>
        {context?.options?.hideBalance ? null : (
          <ModalBody>
            <BalanceContainer>
              <AnimatePresence exitBeforeEnter initial={false}>
                {address && (
                  <Balance
                    key={`chain-${chain?.id}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {nFormatter(Number(address?.formatted))}
                    {` `}
                    {address?.symbol}
                  </Balance>
                )}
                {!address && (
                  <LoadingBalance
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    &nbsp;
                  </LoadingBalance>
                )}
              </AnimatePresence>
            </BalanceContainer>
          </ModalBody>
        )}
      </ModalContent>
      {!isSafeConnector(address) && (
        <Button
          onClick={() => setShouldDisconnect(true)}
          icon={<DisconnectIcon />}
        >
          {locales.disconnect}
        </Button>
      )}
    </PageContent>
  );
};

export default Profile;
