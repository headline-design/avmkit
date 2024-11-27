import { createContext } from "react";
import { useQuery } from "@tanstack/react-query";

export enum StatusState {
  READY = "ready",
  LOADING = "loading",
  SUCCESS = "success",
  REJECTED = "rejected",
  ERROR = "error",
}

export type SIWASession = {
  address: string;
  chainId: number;
};

export type SIWAConfig = {
  // Required
  getNonce: () => Promise<string>;
  createMessage: (args: {
    nonce: string;
    address: string;
    chainId: number;
  }) => string;
  verifyMessage: (args: {
    message: string | Uint8Array;
    signature: string;
    address: string;
    nfd?: string | undefined;
  }) => Promise<boolean>;
  getSession: () => Promise<SIWASession | null>;
  signOut: () => Promise<boolean>;

  // Optional, we have default values but they can be overridden
  enabled?: boolean;
  nonceRefetchInterval?: number;
  sessionRefetchInterval?: number;
  signOutOnDisconnect?: boolean;
  signOutOnAccountChange?: boolean;
  signOutOnNetworkChange?: boolean;
};

export type SIWAContextValue = Required<SIWAConfig> & {
  nonce: ReturnType<typeof useQuery<string | null>>;
  session: ReturnType<typeof useQuery<SIWASession | null>>;
  status: StatusState;
  signIn: () => Promise<SIWASession | false>;
  resetStatus: () => void;
};

export const SIWAContext = createContext<SIWAContextValue | null>(null);
