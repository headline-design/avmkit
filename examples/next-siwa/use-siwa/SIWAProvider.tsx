import { ReactNode, useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import algosdk from "algosdk";

import {
  SIWAContext,
  SIWAConfig,
  StatusState,
  SIWASession,
} from "./SIWAContext";
import { Escrow, Pipeline } from "@siwa/pipeline";
import algorandGlobalSelectors from "@/dashboard/redux/algorand/global/globalSelctors";
import useSIWAAccount from "./hooks/use-siwa-account";
import { useSelector } from "react-redux";

type Props = SIWAConfig & {
  children: ReactNode;
  onSignIn?: (data?: SIWASession) => void;
  onSignOut?: () => void;
};

export function uint8ArrayToBase64(bytes) {
  return btoa(String.fromCharCode.apply(null, bytes));
}

// Function to convert the first 65 bytes of Uint8Array to Ethereum-like hex string
function uint8ArrayToEthereumHexString(arr) {
  // Take the first 65 bytes only
  const first65Bytes = arr.slice(0, 65);
  return (
    "0x" +
    Array.from(first65Bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
      "",
    )
  );
}

export const SIWAProvider = ({
  children,
  enabled = true,
  nonceRefetchInterval = 1000 * 60 * 5,
  sessionRefetchInterval = 1000 * 60 * 5,
  signOutOnDisconnect = true,
  signOutOnAccountChange = true,
  signOutOnNetworkChange = true,
  onSignIn,
  onSignOut,
  ...siwaConfig
}: Props) => {
  const [status, setStatus] = useState<StatusState>(StatusState.READY);
  const resetStatus = () => setStatus(StatusState.READY);

  const pipeState = useSelector(
    algorandGlobalSelectors.selectCurrentPipeConnectState,
  );
  // Only allow for mounting SIWAProvider once, so we avoid weird global state
  // collisions.
  if (useContext(SIWAContext)) {
    throw new Error(
      "Multiple, nested usages of SIWAProvider detected. Please use only one.",
    );
  }

  const nonce = useQuery({
    queryKey: ["ckSiwaNonce"],
    queryFn: () => siwaConfig.getNonce(),
    refetchInterval: nonceRefetchInterval,
  });

  const session = useQuery({
    queryKey: ["ckSiwaSession"],
    queryFn: () => siwaConfig.getSession(),
    refetchInterval: sessionRefetchInterval,
  });

  const sessionData = session.data;

  const signOutAndRefetch = async () => {
    if (!sessionData) return false; // No session to sign out of
    setStatus(StatusState.LOADING);
    if (!(await siwaConfig.signOut())) {
      throw new Error("Failed to sign out.");
    }
    await Promise.all([session.refetch(), nonce.refetch()]);
    setStatus(StatusState.READY);
    onSignOut?.();
    return true;
  };

  const { address, chain } = useSIWAAccount();

  const onError = (error: any) => {
    console.error("signIn error", error.code, error.message);
    switch (error.code) {
      case -32000: // WalletConnect: user rejected
      case 4001: // MetaMask: user rejected
      case "ACTION_REJECTED": // MetaMask: user rejected
        setStatus(StatusState.REJECTED);
        break;
      default:
        setStatus(StatusState.ERROR);
    }
  };

  const signIn = async () => {
    try {
      if (!siwaConfig) {
        throw new Error("SIWA not configured");
      }

      const chainId = chain?.id;
      if (!address) throw new Error("No address found");
      if (!chainId) throw new Error("No chainId found");

      if (!nonce.data) {
        throw new Error("Could not fetch nonce");
      }

      setStatus(StatusState.LOADING);

      const message = siwaConfig.createMessage({
        address,
        algoAddress: Pipeline.address,
        chainId: 100,
        nonce: nonce?.data,
      });

      const hashedMessage = new Uint8Array(
        Buffer.from(JSON.stringify(message)),
      );
      const MXMessage = "MX" + JSON.stringify(message);

      let algoSig;
      try {
        if (pipeState.provider === "Kibisis") {
          const result = await window?.algorand.signBytes({
            data: new Uint8Array(Buffer.from(MXMessage)),
          });

          algoSig = result.signature;

          const isValid = algosdk.verifyBytes(
            new Uint8Array(Buffer.from(JSON.stringify(message))),
            result.signature,
            Pipeline.address,
          );

          console.log(`Signature is valid: ${isValid}`);
        } else if (pipeState.provider === "escrow") {
          // Encode the hashed message consistently
          const encodedHashedMessage = new Uint8Array(
            Buffer.from(hashedMessage),
          );

          // Sign the bytes using the escrow secret
          algoSig = algosdk.signBytes(
            encodedHashedMessage,
            Escrow.secret as unknown as Uint8Array,
          );

          // Verify the signature to ensure its validity
          const isValid = algosdk.verifyBytes(
            encodedHashedMessage,
            algoSig,
            Pipeline.address,
          );
          console.log(`Signature is valid: ${isValid}`);
        }
      } catch (error) {
        console.error("Error during signing process:", error);
      }

      let algoSigBase64 = uint8ArrayToBase64(algoSig);
      //console.log('algoSigBase64', algoSigBase64);
      const ethSig = uint8ArrayToEthereumHexString(algoSig);

      // Verify signature
      if (
        !(await siwaConfig.verifyMessage({
          message,
          signature: ethSig,
          address: address,
          algoAddress: Pipeline.address,
          algoSignature: algoSigBase64,
        }))
      ) {
        throw new Error("Error verifying SIWA signature");
      }

      const data = await session.refetch().then((res) => {
        onSignIn?.(res?.data ?? undefined);
        return res?.data;
      });

      setStatus(StatusState.READY);
      return data as SIWASession;
    } catch (error) {
      onError(error);
      console.error("Error during signIn:", error);
      setStatus(StatusState.ERROR);
      return false;
    }
  };

  return (
    <SIWAContext.Provider
      value={{
        enabled,
        nonceRefetchInterval,
        sessionRefetchInterval,
        signOutOnDisconnect,
        signOutOnAccountChange,
        signOutOnNetworkChange,
        ...siwaConfig,
        nonce,
        session,
        signIn,
        signOut: signOutAndRefetch,
        status,
        resetStatus,
      }}
    >
      {children}
    </SIWAContext.Provider>
  );
};
