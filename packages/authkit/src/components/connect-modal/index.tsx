import { useEffect } from 'react';
import { routes, useContext } from '../authkit';
import { CustomTheme, Languages, Mode, Theme } from '../../types';
import Modal from '../common/modal';

import Onboarding from '../../screens/onboarding';
import About from '../../screens/about';
import Connectors from '../../screens/connectors';

import Profile from '../../screens/profile';
import SwitchNetworks from '../../screens/switch-networks';
import { SIWAConnectScreen } from '../../screens/siwa-connect-screen';

import { getAppIcon, getAppName } from '../../defaultConfig';
import { AuthKitThemeProvider } from '../authkit-theme-provider/authkit-theme-provider';
import { useChainIsSupported } from '../../hooks/useChainIsSupported';
import { useAccount } from '@/siwa/hooks/use-account';

const customThemeDefault: object = {};

const ConnectModal: React.FC<{
  mode?: Mode;
  theme?: Theme;
  customTheme?: CustomTheme;
  lang?: Languages;
}> = ({
  mode = 'auto',
  theme = 'auto',
  customTheme = customThemeDefault,
  lang = 'en-US',
}) => {
  const context = useContext();
  const { isConnected, chain } = useAccount();
  const chainIsSupported = useChainIsSupported(chain?.id);

  //if chain is unsupported we enforce a "switch chain" prompt
  const closeable = !(
    context.options?.enforceSupportedChains &&
    isConnected &&
    !chainIsSupported
  );

  const showBackButton =
    closeable &&
    context.route !== routes.CONNECTORS &&
    context.route !== routes.PROFILE;

  const showInfoButton = closeable && context.route !== routes.PROFILE;

  const onBack = () => {
    if (context.route === routes.SIGNINWITHALGORAND) {
      context.setRoute(routes.PROFILE);
    } else if (context.route === routes.SWITCHNETWORKS) {
      context.setRoute(routes.PROFILE);
    } else if (context.route === routes.DOWNLOAD) {
      context.setRoute(routes.CONNECT);
    } else {
      context.setRoute(routes.CONNECTORS);
    }
  };

  const pages: any = {
    onboarding: <Onboarding />,
    about: <About />,

    connectors: <Connectors />,


    profile: <Profile />,
    switchNetworks: <SwitchNetworks />,
    signInWithAlgorand: <SIWAConnectScreen />,
  };

  function hide() {
    context.setOpen(false);
  }


  /* When pulling data into WalletConnect, it prioritises the og:title tag over the title tag */
  useEffect(() => {
    const appName = getAppName();
    if (!appName || !context.open) return;

    const title = document.createElement('meta');
    title.setAttribute('property', 'og:title');
    title.setAttribute('content', appName);
    document.head.prepend(title);

    /*
    // TODO:  When pulling data into WalletConnect, figure out which icon gets used and replace with appIcon if available
    const appIcon = getAppIcon();
    const icon = document.createElement('link');
    if (appIcon) {
      icon.setAttribute('rel', 'icon');
      icon.setAttribute('href', appIcon);
      document.head.prepend(icon);
    }*/

    return () => {
      document.head.removeChild(title);
      //if (appIcon) document.head.removeChild(icon);
    };
  }, [context.open]);

  return (
    <AuthKitThemeProvider
      theme={theme}
      customTheme={customTheme}
      mode={mode}
    >
      <Modal
        open={context.open}
        pages={pages}
        pageId={context.route}
        onClose={closeable ? hide : undefined}
        onInfo={
          showInfoButton ? () => context.setRoute(routes.ABOUT) : undefined
        }
        onBack={showBackButton ? onBack : undefined}
      />
    </AuthKitThemeProvider>
  );
};

export default ConnectModal;
