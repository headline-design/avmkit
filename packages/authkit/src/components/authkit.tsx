import React, { ReactNode, createContext, createElement, useEffect, useState } from 'react';
import { CustomTheme, Theme } from '../styles/types';
import { Buffer } from 'buffer';
import defaultTheme from '../styles/defaultTheme';

import AuthKitModal from './connect-modal';
import { ThemeProvider } from 'styled-components';
import { useThemeFont } from '../hooks/useGoogleFont';
import { useChains } from '../hooks/useChains';
import { Web3ContextProvider } from './contexts/web3';
import { useChainIsSupported } from '../hooks/useChainIsSupported';
import { SIWAContext } from '@/siwa';
import { useConnectCallback } from '../hooks/use-connect-callback';
import { Languages } from '../localizations';
import { WalletConnectionContext } from '@/dashboard/contexts/wallet-connection-context';
import { useAccount } from '@/siwa/hooks/use-account';
import { Mode } from '../types';

type Hash = `0x${string}`;

export type CustomAvatarProps = {
  address?: Hash | undefined;
  ensName?: string | undefined;
  ensImage?: string;
  size: number;
  radius: number;
};

export type AuthKitOptions = {
  hideBalance?: boolean;
  hideTooltips?: boolean;
  hideQuestionMarkCTA?: boolean;
  hideNoWalletCTA?: boolean;
  hideRecentBadge?: boolean;
  walletConnectCTA?: 'link' | 'modal' | 'both';
  avoidLayoutShift?: boolean; // Avoids layout shift when the AuthKit modal is open by adding padding to the body
  embedGoogleFonts?: boolean; // Automatically embeds Google Font of the current theme. Does not work with custom themes
  truncateLongENSAddress?: boolean;
  walletConnectName?: string;
  reducedMotion?: boolean;
  disclaimer?: ReactNode | string;
  bufferPolyfill?: boolean;
  customAvatar?: React.FC<CustomAvatarProps>;
  initialChainId?: number;
  enforceSupportedChains?: boolean;
  ethereumOnboardingUrl?: string;
  walletOnboardingUrl?: string;
  disableSiwaRedirect?: boolean; // Disable redirect to SIWA page after a wallet is connected
  overlayBlur?: number; // Blur the background when the modal is open
};

export type useConnectCallbackProps = {
  onConnect?: ({ address, connectorId }: { address?: string; connectorId?: string }) => void;
  onDisconnect?: () => void;
};

type ContextValue = {
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
  customTheme: CustomTheme | undefined;
  setCustomTheme: React.Dispatch<React.SetStateAction<CustomTheme | undefined>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  options?: AuthKitOptions;
  route: string;
  setRoute: React.Dispatch<React.SetStateAction<string>>;
  errorMessage: Error;
  signInWithAlgorand: boolean;
  debugMode?: boolean;
  log: (...props: any) => void;
  displayError: (message: string | React.ReactNode | null, code?: any) => void;
  resize: number;
  triggerResize: () => void;
} & useConnectCallbackProps;

export const Context = createContext<ContextValue | null>(null);

export const routes = {
  ONBOARDING: 'onboarding',
  ABOUT: 'about',
  CONNECTORS: 'connectors',
  MOBILECONNECTORS: 'mobileConnectors',
  CONNECT: 'connect',
  DOWNLOAD: 'download',
  PROFILE: 'profile',
  SWITCHNETWORKS: 'switchNetworks',
  SIGNINWITHALGORAND: 'signInWithAlgorand',
};

type Connector = {
  id: string;
};
type Error = string | React.ReactNode | null;


type AuthKitProviderProps = {
  children?: React.ReactNode;
  theme?: Theme;
  mode?: Mode;
  customTheme?: CustomTheme;
  options?: AuthKitOptions;
  debugMode?: boolean;
} & useConnectCallbackProps;

export const AuthKitProvider = ({
  children,
  theme = 'auto',
  mode = 'auto',
  customTheme,
  options,
  onConnect,
  onDisconnect,
  debugMode = false,
}: AuthKitProviderProps) => {
  // AuthKitProvider must be within a WalletConnectionProvider
  if (!React.useContext(WalletConnectionContext)) {
    throw Error('AuthKitProvider must be within a WalletConnectionsProvider');
  }

  // Only allow for mounting AuthKitProvider once, so we avoid weird global
  // state collisions.
  if (React.useContext(Context)) {
    throw new Error('Multiple, nested usages of AuthKitProvider detected. Please use only one.');
  }

  useConnectCallback({
    onConnect,
    onDisconnect,
  });

  const chains = useChains();

  // Default config options
  const defaultOptions: AuthKitOptions = {
    language: 'en-US',
    hideBalance: false,
    hideTooltips: false,
    hideQuestionMarkCTA: false,
    hideNoWalletCTA: false,
    walletConnectCTA: 'link',
    hideRecentBadge: false,
    avoidLayoutShift: true,
    embedGoogleFonts: false,
    truncateLongENSAddress: true,
    walletConnectName: undefined,
    reducedMotion: false,
    disclaimer: null,
    bufferPolyfill: true,
    customAvatar: undefined,
    initialChainId: chains?.[0]?.id,
    enforceSupportedChains: true,
    ethereumOnboardingUrl: undefined,
    walletOnboardingUrl: undefined,
    disableSiwaRedirect: false,
  };

  const opts: AuthKitOptions = Object.assign({}, defaultOptions, options);

  if (typeof window !== 'undefined') {
    // Buffer Polyfill, needed for bundlers that don't provide Node polyfills (e.g CRA, Vite, etc.)
    if (opts.bufferPolyfill) window.Buffer = window.Buffer ?? Buffer;

    // Some bundlers may need `global` and `process.env` polyfills as well
    // Not implemented here to avoid unexpected behaviors, but leaving example here for future reference
    /*
     * window.global = window.global ?? window;
     * window.process = window.process ?? { env: {} };
     */
  }

  const [ckTheme, setTheme] = useState<Theme>(theme);
  const [ckMode, setMode] = useState<Mode>(mode);
  const [ckCustomTheme, setCustomTheme] = useState<CustomTheme | undefined>(customTheme ?? {});
  const [ckLang, setLang] = useState<Languages>('en-US');
  const [open, setOpen] = useState<boolean>(false);
  const [connector, setConnector] = useState<ContextValue['connector']>({
    id: '',
  });
  const [route, setRoute] = useState<string>(routes.CONNECTORS);
  const [errorMessage, setErrorMessage] = useState<Error>('');

  const [resize, onResize] = useState<number>(0);

  // Include Google Font that is needed for a themes
  // eslint-disable-next-line react-hooks/rules-of-hooks
  if (opts.embedGoogleFonts) useThemeFont(theme);

  // Other Configuration
  useEffect(() => setTheme(theme), [theme]);
  useEffect(() => setLang(opts.language || 'en-US'), [opts.language]);
  useEffect(() => setErrorMessage(null), [route, open]);

  // Check if chain is supported, elsewise redirect to switches page
  const { chain, isConnected } = useAccount();
  const isChainSupported = useChainIsSupported(chain?.id);

  useEffect(() => {
    if (isConnected && opts.enforceSupportedChains && !isChainSupported) {
      setOpen(true);
      setRoute(routes.SWITCHNETWORKS);
    }
  }, [isConnected, isChainSupported, chain, route, open]);

  const log = debugMode ? console.log : () => {};

  const value = {
    theme: ckTheme,
    setTheme,
    mode: ckMode,
    setMode,
    customTheme,
    setCustomTheme,
    lang: ckLang,
    setLang,
    open,
    setOpen,
    route,
    setRoute,
    connector,
    setConnector,
    signInWithAlgorand: React.useContext(SIWAContext)?.enabled ?? false,
    onConnect,
    // Other configuration
    options: opts,
    errorMessage,
    debugMode,
    log,
    displayError: (message: string | React.ReactNode | null, code?: any) => {
      setErrorMessage(message);
      console.log('---------AUTHKIT DEBUG---------');
      console.log(message);
      if (code) console.table(code);
      console.log('---------/AUTHKIT DEBUG---------');
    },
    resize,
    triggerResize: () => onResize((prev) => prev + 1),
  };

  return createElement(
    Context.Provider,
    { value },
    <>
      <Web3ContextProvider enabled={open}>
        <ThemeProvider theme={defaultTheme}>
          {children}
          <AuthKitModal lang={ckLang} theme={ckTheme} mode={mode} customTheme={ckCustomTheme} />
        </ThemeProvider>
      </Web3ContextProvider>
    </>,
  );
};

export const useContext = () => {
  const context = React.useContext(Context);
  if (!context) throw Error('AuthKit Hook must be inside a Provider.');
  return context;
};
