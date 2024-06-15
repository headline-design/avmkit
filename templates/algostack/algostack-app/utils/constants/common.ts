"use client"

import { getLocalStorage } from '@/dashboard/localStorage/localStorage';
import localStore from 'store';

export const NONE_YET = 'none yet';
export const PREFERRED_DECIMALS = 2;
export const DEBOUNCE_MS = 800;

/** LocalStorage Keys **/
/* ----- Constants ----- */
export const CHAIN_NETWORK_KEY = 'isMainNet';
export const ALT_CHAIN_NETWORK_KEY = 'isAltChainEnabled';
export const USERS_SIZE_KEY = 'usersSize';
export const NETWORKS_KEY = 'networks';
export const USER_DATA_KEY = 'userData';

/** Networks **/

export const Networks = {
  MainNet: 'MainNet',
  TestNet: 'TestNet',
};

/** Chains **/

export const Chains = {
  Algorand: 'Algorand',
  Voi: 'Voi',
};

export const userBreakpoints = {
  1750: 4,
  default: 5,
  1400: 3,
  950: 2,
  800: 1,
};

export enum Grid {
  DEFAULT,
  WIDE,
}

/** Pipe Connectors */

export const PipeConnectors = {
  MyAlgoWallet: 'myAlgoWallet',
  PeraWallet: 'PeraWallet',
  XWallet: 'escrow',
  Kibisis: 'Kibisis',
  //AlgoSigner: 'AlgoSigner',
  //XWallet: 'XWallet'
};

/** Local Storage keys */

export const PIPECONNECT_STATE_KEY = 'pipeConnectState';
export const TOKEN_KEY = 'token';
export const USER_INFO_KEY = 'userInfo';
export const USER_ACCOUNT_NAME_KEY = 'userAccountName';
export const USER_ACCOUNT_NUMBER_KEY = 'userAccountNumber';
export const USER_LANGUAGE_KEY = 'userLanguage';
export const IS_DARK_THEME_KEY = 'isDarkTheme';
export const X_MNEMONIC = 'xMnemonic';
export const X_ADDRESS = 'xAddress';

/** THEMES */
export const Themes = {
  DARK: 'dark',
  LIGHT: 'light',
};

/** DEFAULT REDUX VALUES */
export const DefaultPipeState = {
  address: JSON.parse(String(getLocalStorage(PIPECONNECT_STATE_KEY)))?.address || '',
  isMainNet:
    localStore.get(CHAIN_NETWORK_KEY) === true
      ? true
      : localStore.get(CHAIN_NETWORK_KEY) === false
      ? false
      : process.env.NEXT_NETWORK_TYPE === 'mainnet'
      ? true
      : false,
  provider: JSON.parse(String(getLocalStorage(PIPECONNECT_STATE_KEY)))?.provider || '',
};

export const User = {
  address: JSON.parse(String(getLocalStorage(PIPECONNECT_STATE_KEY)))?.address || '',
};

export const Languages = {
  EN: 'English',
  IT: 'Italian',
};
