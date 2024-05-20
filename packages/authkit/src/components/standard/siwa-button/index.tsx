import Button from '../../common/button';
import { DisconnectIcon, RetryIcon } from '../../../assets/icons';
import { ResetContainer } from '../../../styles';
import { motion } from 'framer-motion';
import useIsMounted from '../../../hooks/useIsMounted';
import { SIWASession, useSIWA } from '@/siwa';
import useLocales from '../../../hooks/use-locales';
import { useModal } from '../../../hooks/useModal';
import { useAccount } from '@/siwa/hooks/use-account';

type ButtonProps = {
  showSignOutButton?: boolean;
  onSignIn?: (data?: SIWASession) => void;
  onSignOut?: () => void;
};

export const SIWAButton: React.FC<ButtonProps> = ({
  showSignOutButton,
  onSignIn,
  onSignOut,
}) => {
  const isMounted = useIsMounted();
  const locales = useLocales();
  const { setOpen } = useModal();

  const {
    isSignedIn,
    isReady,
    isLoading,
    isRejected,
    isSuccess,
    isError,
    signIn,
    signOut,
    error,
  } = useSIWA({
    onSignIn: (data) => onSignIn?.(data),
    onSignOut: () => onSignOut?.(),
  });
  const { address: connectedAddress } = useAccount();

  function getButtonLabel() {
    if (isSuccess) return locales.signedIn;
    if (isRejected) return locales.tryAgain;
    if (isLoading) return locales.awaitingConfirmation;
    if (isError) return error ?? 'Unknown Error';
    if (isReady) return locales.signIn;
    return locales.signIn;
  }

  if (!isMounted) {
    return <Button key="loading" style={{ margin: 0 }} disabled />;
  }

  if (showSignOutButton && isSignedIn) {
    return (
      <Button
        key="button"
        style={{ margin: 0 }}
        onClick={signOut}
        icon={<DisconnectIcon />}
      >
        {locales.signOut}
      </Button>
    );
  }

  if (!connectedAddress) {
    // TODO: discuss non-connected wallet developer expectations
    return (
      <Button
        key="button"
        style={{ margin: 0 }}
        onClick={() => setOpen(true)}
        arrow
      >
        {locales.walletNotConnected}
      </Button>
    );
  }

  return (
    <Button
      key="button"
      style={{ margin: 0 }}
      arrow={!isSignedIn ? !isLoading && !isRejected : false}
      onClick={!isLoading && !isSuccess ? signIn : undefined}
      disabled={isLoading}
      waiting={isLoading}
      icon={
        isRejected && (
          <motion.div
            initial={{
              rotate: -270,
            }}
            animate={{
              rotate: 0,
            }}
            transition={{
              duration: 1,
              ease: [0.175, 0.885, 0.32, 0.98],
            }}
          >
            <RetryIcon style={{ opacity: 0.4 }} />
          </motion.div>
        )
      }
    >
      {getButtonLabel()}
    </Button>
  );
};

export const SIWAButtonComponent: React.FC<ButtonProps> = ({ ...props }) => (
  <ResetContainer>
    <SIWAButton {...props} />
  </ResetContainer>
);
export default SIWAButtonComponent;
