"use client";

import { SiwaMessage } from "@siwa/siwa";
import { FC, PropsWithChildren, createContext } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { SIWAConfig, SIWAProvider } from "@/siwa";
import { AVMProvider, WalletProvider } from "@/avm";
import { createConfig } from "@/avm/createConfig";
import { createStorage } from "@/avm/createStorage";

export interface SIWASession {
  address: string;
  chainId: number;
}

export interface SIWACreateMessageArgs {
  nonce: string;
  address: string;
  algoAddress: string;
  chainId: number;
}

export interface SIWAVerifyMessageArgs {
  message: string;
  signature: string;
  address: string;
  algoAddress: string;
  algoSignature: string;
}

export interface SIWAClientMethods {
  getNonce: (address?: string) => Promise<string>;
  createMessage: (args: SIWACreateMessageArgs) => string;
  verifyMessage: (args: SIWAVerifyMessageArgs) => Promise<boolean>;
  getSession: () => Promise<SIWASession | null>;
  signOut: () => Promise<boolean>;
  onSignIn?: (session?: SIWASession) => void;
  onSignOut?: () => void;
}

export interface SIWAConfig extends SIWAClientMethods {
  // Defaults to true
  enabled?: boolean;
  // In milliseconds, defaults to 5 minutes
  nonceRefetchIntervalMs?: number;
  // In milliseconds, defaults to 5 minutes
  sessionRefetchIntervalMs?: number;
  // Defaults to true
  signOutOnDisconnect?: boolean;
  // Defaults to true
  signOutOnAccountChange?: boolean;
  // Defaults to true
  signOutOnNetworkChange?: boolean;
}

const APP_NAME = "Xspace";

const algorand = {
  id: "algorand",
  name: "Algorand",
  chainId: 1,
  rpc: "https://api.testnet.algoexplorer.io",
  explorer: "https://testnet.algoexplorer.io",
};

const voiNetwork = {
  id: "voi",
  name: "Voi Network",
  chainId: 2,
  rpc: "https://api.voi.network",
  explorer: "https://explorer.voi.network",
};

export function parseCookie(cookie: string, key: string) {
  const keyValue = cookie.split("; ").find((x) => x.startsWith(`${key}=`));
  if (!keyValue) return undefined;
  return keyValue.substring(key.length + 1);
}

export const cookieStorage = {
  getItem(key) {
    if (typeof window === "undefined") return null;
    const value = parseCookie(document.cookie, key);
    return value ?? null;
  },
  setItem(key, value) {
    if (typeof window === "undefined") return;
    document.cookie = `${key}=${value}`;
  },
  removeItem(key) {
    if (typeof window === "undefined") return;
    document.cookie = `${key}=;max-age=-1`;
  },
};

export interface AlgorandProvider {
  on?: (...args: any[]) => void;
  removeListener?: (...args: any[]) => void;
  autoRefreshOnNetworkChange?: boolean;
}

declare let window: {
  algorand?: AlgorandProvider;
  location: Location;
  localStorage: Storage;
};

export type Web3ContextT = {
  contract: any | null;
};

export type NFTContractProviderProps = {
  children: React.ReactNode;
};

export const Web3Context = createContext<Web3ContextT>({} as Web3ContextT);

export const getDefaultConfig = (config: any) => {
  return {
    setState: () => {},
    connect: () => {},
    appName: APP_NAME,
    appIcon: "/favicon.ico",
    appDescription: "Xspace",
    appUrl: window.location.origin,
    walletConnectProjectId: "",
    chains: [],
    client: null,
    ...config,
  };
};

const config = createConfig(
  getDefaultConfig({
    appName: APP_NAME,
    ssr: true,
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    chains: [algorand, voiNetwork],
    storage: createStorage({
      storage: cookieStorage,
    }),
  }),
);

export const siwaConfig: SIWAConfig = {
  getNonce: async () => {
    const res = await fetch(`/api/siwa`, { method: "PUT" });
    if (!res.ok) throw new Error("Failed to fetch SIWA nonce");

    return res.text();
  },

  createMessage: ({ nonce, address, chainId }: SIWACreateMessageArgs) =>
    new SiwaMessage({
      nonce,
      chainId,
      address,
      version: "1",
      uri: window.location.origin,
      domain: window.location.host,
    }).prepareMessage(),
  verifyMessage: async ({
    message,
    signature,
    address,
    algoAddress,
    algoSignature,
  }: {
    message: string | Uint8Array;
    signature: string;
    address: string;
    algoAddress: string;
    algoSignature: string;
  }) => {
    //console.log('message-credentials', address, algoAddress, algoSignature);

    return signIn("credentials", {
      message: JSON.stringify(message),
      address,
      algoAddress,
      algoSignature,
      redirect: false,
      signature,
      callbackUrl: "/",
    }).then((res) => res?.ok as boolean);
  },

  getSession: async () => {
    const res = await fetch(`/api/siwa`);

    if (!res.ok) throw new Error("Failed to fetch SIWA session");
    const data = await res.json();
    const activeWallet = data?.user?.wallets[0];

    const address = activeWallet?.address;
    const chainId = activeWallet?.chainId;

    return address && chainId ? { address, chainId } : null;
  },
  signOut: () => fetch(`/api/siwa`, { method: "DELETE" }).then((res) => res.ok),
};

export const Web3Contextual = (props: NFTContractProviderProps) => {
  const { children } = props;
  const contract = null;

  return (
    <Web3Context.Provider value={{ contract }}>{children}</Web3Context.Provider>
  );
};

export const Web3Provider = ({ children }: { children: any }) => {
  return (
    <AVMProvider config={config}>
      <Web3ChildProvider>{children}</Web3ChildProvider>
    </AVMProvider>
  );
};

const Web3ChildProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const router = useRouter();

  return (
    <WalletProvider>
      <SIWAProvider
        onSignIn={() => router.refresh()}
        onSignOut={() => router.refresh()}
        {...siwaConfig}
      >
        <Web3Contextual>{children}</Web3Contextual>
      </SIWAProvider>
    </WalletProvider>
  );
};

export default Web3Provider;
