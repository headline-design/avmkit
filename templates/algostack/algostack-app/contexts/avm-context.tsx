"use client";

import { SiwaMessage } from "@avmkit/siwa";
import { FC, PropsWithChildren, createContext } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { SIWAConfig, SIWAProvider } from "@/use-siwa";

export interface SIWACreateMessageArgs {
  nonce: string;
  address: string;
  chainId: number;
}

declare let window: {
  algorand?: AlgorandProvider;
  location: Location;
  localStorage: Storage;
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
    appName: "Algostack",
    appIcon: "/favicon.ico",
    appDescription: "SIWA Connect is a demo application for SIWA.",
    appUrl: typeof window !== "undefined" ? window.location.origin : "",
    walletConnectProjectId: "",
    chains: [],
    client: null,
    ...config,
  };
};

const currentCallbackUrl = "/";

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
      uri: typeof window !== "undefined" ? window.location.origin : "",
      domain: typeof window !== "undefined" ? window.location.host : "",
    }).prepareMessage(),

  verifyMessage: async ({
    message,
    signature,
    nfd,
    provider,
  }: {
    message: string | Uint8Array;
    signature: string;
    nfd?: string;
    provider?: string;
  }) => {
    const res = await fetch(`/api/siwa`, {
      method: "POST",
      body: JSON.stringify({
        message: JSON.stringify(message),
        nfd,
        signature,
        provider,
      }),
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) throw new Error("Failed to fetch SIWA session");

    return await signIn("algorand", {
      message: JSON.stringify(message),
      nfd,
      provider,
      redirect: false,
      signature,
      callbackUrl: currentCallbackUrl,
    }).then((res) => res?.ok as boolean);
  },

  getSession: async () => {
    const res = await fetch(`/api/siwa`);

    if (!res.ok) throw new Error("Failed to fetch SIWA session");
    const { address, chainId } = await res.json();

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

export const Web3AVMProvider = ({ children }: { children: any }) => {
  return <Web3ChildProvider>{children}</Web3ChildProvider>;
};

const Web3ChildProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <SIWAProvider
      onSignIn={() => router.refresh()}
      onSignOut={() => router.refresh()}
      {...siwaConfig}
    >
      <Web3Contextual>{children}</Web3Contextual>
    </SIWAProvider>
  );
};

export default Web3AVMProvider;
