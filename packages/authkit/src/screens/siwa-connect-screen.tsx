import { useWalletConnection } from '@/dashboard/contexts/wallet-connection-context';
import Avatar from '../avatar/avatar';
import { useEffect, useState } from 'react';
import { SIWAContext, useSIWA } from '@/siwa';
import { AnimatePresence, motion } from 'framer-motion';
import {
  StatusGraphic,
  LogoContainer,
  StatusIcon,
  StatusGraphicBgSvg,
  ContentContainer,
} from './styles';
import { flattenChildren, isMobile } from '../utils';
import FitText from '../components/common/fit-text';
import useLocales from '../hooks/use-locales';
import { TickIcon } from '../assets/icons';
import { ModalBody, ModalContent, PageContent } from '../components/common/modal/styles';
import LazyImage from '../components/common/lazy-image';
import { Chains } from '@/dashboard/utils/constants/common';
import { SIWAButton } from '../components/standard/siwa-button';
import { useContext } from '../components/authkit';

export const SiwaAvatar = ({ signIn }: { signIn: () => void }) => {
  return (
    <div
      className="absolute w-5 h-5 left-3 top-[20px] flex items-center rounded-full p-[6px] text-md text-skin-link transition-colors duration-200"
      onClick={signIn}
    >
      <div className="absolute inset-0 pointer-events-none opacity-100 transform-none">
        <div className="siwa-tooltip">
          You’re not signed in to this app.
          <br />
          <strong>Sign In With Ethereum</strong> to continue.
        </div>
      </div>
      {/* User Icon Button */}
      <button aria-label="[object Object]" className="opacity-100">
        <div className="relative">
          <div className="absolute top-[-2px] right-[-2px] bg-blue-600 rounded-full shadow-lg w-2 h-2"></div>
          <svg
            aria-hidden="true"
            width="20"
            height="20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2"></circle>
            <path
              d="M16.5 16.775C14.8618 15.0649 12.5552 14 10 14C7.44477 14 5.13825 15.0649 3.5 16.775"
              stroke="currentColor"
              strokeWidth="2"
            ></path>
            <circle cx="10" cy="8" r="3" stroke="currentColor" strokeWidth="2"></circle>
          </svg>
        </div>
      </button>
    </div>
  );
};

const transition = { duration: 0.2, ease: [0.26, 0.08, 0.25, 1] };
const copyTransition = { duration: 0.16, ease: [0.26, 0.08, 0.25, 1] };

export const SIWAConnectScreen = () => {
  const {
    status: walletStatus,
    connectWallet,
    disconnectWallet,
    pipeState,
  } = useWalletConnection();
  const context = useContext();
  const mobile = isMobile();

  const { isSignedIn } = useSIWA();

  const [status, setStatus] = useState<'signedOut' | 'signedIn'>(
    isSignedIn ? 'signedIn' : 'signedOut',
  );

  useEffect(() => {
    if (isSignedIn) setStatus('signedIn');
  }, []);

  useEffect(() => {
    if (!isSignedIn) setStatus('signedOut');
  }, [isSignedIn]);

  const locales = useLocales({});
  const copy =
    status === 'signedIn'
      ? {
          heading: locales.signInWithAlgorandScreen_signedIn_heading,
          h1: locales.signInWithAlgorandScreen_signedIn_h1,
          p: locales.signInWithAlgorandScreen_signedIn_p,
          button: locales.signInWithAlgorandScreen_signedIn_button,
        }
      : {
          heading: locales.signInWithAlgorandScreen_signedOut_heading,
          h1: locales.signInWithAlgorandScreen_signedOut_h1,
          p: locales.signInWithAlgorandScreen_signedOut_p,
          button: locales.signInWithAlgorandScreen_signedOut_button,
        };

  // We use the favicon for the dApp logo because that's how the connectors do it
  // TODO: Allow for dev customisation
  const getFavicons = () => {
    const favicons: { svg: string | null; default: string | null } = {
      svg: null,
      default: null,
    };
    const nodeList: HTMLCollectionOf<HTMLLinkElement> = document.getElementsByTagName('link');
    Array.from(nodeList).forEach((node) => {
      if (
        (node.getAttribute('rel') === 'icon' || node.getAttribute('rel') === 'shortcut icon') &&
        node.getAttribute('href')
      ) {
        if (node.getAttribute('type') === 'image/svg+xml') {
          favicons.svg = node.getAttribute('href');
        } else {
          favicons.default = node.getAttribute('href');
        }
      }
    });
    return favicons;
  };
  const favicons = getFavicons();
  const favicon = favicons.default;

  return (
    <>
      <PageContent style={{ width: 278 }}>
        <ModalContent style={{ padding: 0, marginTop: -10 }}>
          <ContentContainer>
            <AnimatePresence exitBeforeEnter>
              <motion.div
                key={flattenChildren(copy.h1).toString()}
                initial={mobile ? false : { opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={copyTransition}
              >
                <ModalBody style={{ height: 42 }}>
                  <FitText>{copy.h1}</FitText>
                </ModalBody>
              </motion.div>
            </AnimatePresence>
          </ContentContainer>
          <StatusGraphic $connected={isSignedIn} key="status">
            <div style={{ position: 'absolute', inset: 0 }}>
              <StatusGraphicBgSvg
                width="262"
                height="134"
                viewBox="0 0 262 134"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <motion.rect
                  x="0"
                  y="0"
                  rx="12"
                  width="262"
                  height="134"
                  strokeDasharray="3 3"
                  animate={{
                    strokeDashoffset: [0, -6],
                  }}
                  transition={{
                    duration: 0.4,
                    ease: 'linear',
                    repeat: Infinity,
                  }}
                />
              </StatusGraphicBgSvg>
            </div>

            <motion.div
              key="avatarImage"
              initial={
                mobile
                  ? false
                  : {
                      opacity: 0,
                      x: 50,
                      scale: 0.8,
                    }
              }
              animate={{
                opacity: 1,
                x: 0,
                scale: 1,
              }}
              transition={transition}
            >
              <LogoContainer>
                <Avatar address={pipeState.myAddress} size={64} />
              </LogoContainer>
            </motion.div>
            <motion.div
              key="tickIcon"
              initial={
                mobile
                  ? false
                  : {
                      scale: 0.6,
                    }
              }
              animate={{
                scale: 1,
              }}
              transition={{
                ...transition,
              }}
            >
              <StatusIcon>
                <TickIcon />
              </StatusIcon>
            </motion.div>
            <motion.div
              key="appLogo"
              initial={
                mobile
                  ? false
                  : {
                      opacity: 0,
                      x: -40,
                      scale: 0.8,
                    }
              }
              animate={{
                opacity: 1,
                x: 0,
                scale: 1,
              }}
              transition={{
                ...transition,
              }}
            >
              <LogoContainer>
                {favicon ? <LazyImage src={favicon} alt={'app'} /> : <Chains.UnknownChain />}
              </LogoContainer>
            </motion.div>
          </StatusGraphic>
          <AnimatePresence exitBeforeEnter>
            <motion.div
              key={flattenChildren(copy.p).toString()}
              style={{ paddingBottom: mobile ? 24 : 12 }}
              initial={mobile ? false : { opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={copyTransition}
            >
              <ModalBody style={{ height: 42, marginTop: -1, marginBottom: -3 }}>
                <FitText>{copy.p}</FitText>
              </ModalBody>
            </motion.div>
          </AnimatePresence>
          <SIWAButton
            showSignOutButton={status === 'signedIn'}
            onSignIn={() => {
              setTimeout(() => {
                context.setOpen(false);
              }, 1000);
            }}
          />
        </ModalContent>
      </PageContent>
    </>
  );
};
