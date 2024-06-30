"use client";

import { SiwaMessage } from "@avmkit/siwa";
import { FC, PropsWithChildren, createContext } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { SIWAConfig, SIWAProvider } from "@/siwa";

export interface SIWACreateMessageArgs {
  nonce: string;
  address: string;
  algoAddress: string;
  chainId: number;
}

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


export const Web3Context = createContext<Web3ContextT>({} as Web3ContextT);

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
    nfd,
  }: {
    message: string | Uint8Array;
    signature: string;
    address: string;
    algoAddress: string;
    algoSignature: string;
    nfd?: string;
    }) => {
    //console.log('message-credentials', address, algoAddress, algoSignature);

    return signIn("credentials", {
      message: JSON.stringify(message),
      address,
      algoAddress,
      algoSignature,
      nfd,
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

export const Web3Contextual = (props: any) => {
  const { children } = props;
  const contract = null;

  return (
    <Web3Context.Provider value={{ contract }}>{children}</Web3Context.Provider>
  );
};

export const Web3Provider = ({ children }: { children: any }) => {
  return <Web3ChildProvider>{children}</Web3ChildProvider>;
};

const Web3ChildProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const router = useRouter();

  return (
    <>
      <SIWAProvider
        onSignIn={() => router.refresh()}
        onSignOut={() => router.refresh()}
        {...siwaConfig}
      >
        <Web3Contextual>{children}</Web3Contextual>
      </SIWAProvider>
    </>
  );
};

export default Web3Provider;
