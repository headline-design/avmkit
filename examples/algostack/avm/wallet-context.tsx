import React, { createContext, useContext, useState, ReactNode } from 'react';

interface WalletInstance {
  signTransaction: (transaction: any) => Promise<any>;
  getAddress: () => Promise<string>;
  getChainId: () => Promise<string>;
  on: (event: string, handler: () => void) => void;
  off: (event: string, handler: () => void) => void;
}

interface WalletContextType {
  connector: string;
  setConnector: React.Dispatch<React.SetStateAction<string>>;
  instance: WalletInstance | null;
  setInstance: React.Dispatch<React.SetStateAction<WalletInstance | null>>;
}

interface WalletProviderProps {
  children: ReactNode;
}

// Define the initial context value with the expected structure, filling with appropriate initial values
const initialContext: WalletContextType = {
  connector: 'escrow',
  setConnector: () => {},
  instance: null,
  setInstance: () => {},
};

export const WalletContext = createContext<WalletContextType>(initialContext);

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [connector, setConnector] = useState<string>('escrow');  // Default connector
  const [instance, setInstance] = useState<WalletInstance | null>(null);

  const value = {
    connector,
    setConnector,
    instance,
    setInstance,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};

export const useWallet = () => useContext(WalletContext);
