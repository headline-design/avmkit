import React, { ReactNode, useContext, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import algosdk from 'algosdk';
import { useTransformAddress } from './utils';

import { SIWAContext, SIWAConfig, StatusState, SIWASession } from './SIWAContext';


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
  return '0x' + Array.from(first65Bytes, (byte: number) => byte.toString(16).padStart(2, '0')).join('');
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
  // Only allow for mounting SIWAProvider once, so we avoid weird global state
  // collisions.
  if (useContext(SIWAContext)) {
    throw new Error('Multiple, nested usages of SIWAProvider detected. Please use only one.');
  }

  const nonce = useQuery({
    queryKey: ['ckSiwaNonce'],
    queryFn: () => siwaConfig.getNonce(),
    refetchInterval: nonceRefetchInterval,
  });

  const session = useQuery({
    queryKey: ['ckSiwaSession'],
    queryFn: () => siwaConfig.getSession(),
    refetchInterval: sessionRefetchInterval,
  });

  const sessionData = session.data;

  const signOutAndRefetch = async () => {
    if (!sessionData) return false; // No session to sign out of
    setStatus(StatusState.LOADING);
    if (!(await siwaConfig.signOut())) {
      throw new Error('Failed to sign out.');
    }
    await Promise.all([session.refetch(), nonce.refetch()]);
    setStatus(StatusState.READY);
    onSignOut?.();
    return true;
  };

  let initAddress = sessionData?.address;

  const { address, chain } = useTransformAddress(initAddress);
  //const { signMessageAsync } = useSignMessage();

  const onError = (error: any) => {
    console.error('signIn error', error.code, error.message);
    switch (error.code) {
      case -32000: // WalletConnect: user rejected
      case 4001: // MetaMask: user rejected
      case 'ACTION_REJECTED': // MetaMask: user rejected
        setStatus(StatusState.REJECTED);
        break;
      default:
        setStatus(StatusState.ERROR);
    }
  };

  const signIn = async () => {
    try {
      if (!siwaConfig) {
        throw new Error('SIWA not configured');
      }

      const chainId = chain?.id;
      if (!address) throw new Error('No address found');
      if (!chainId) throw new Error('No chainId found');

      if (!nonce.data) {
        throw new Error('Could not fetch nonce');
      }

      setStatus(StatusState.LOADING);

      const message = siwaConfig.createMessage({
        address,
        algoAddress: initAddress,
        chainId: 100,
        nonce: nonce?.data,
      });

      const hashedMessage = new Uint8Array(Buffer.from(JSON.stringify(message)));

      //let algoSig = algosdk.signBytes(
        //new Uint8Array(Buffer.from(hashedMessage)),
        //Escrow.secret as unknown as Uint8Array,
      //);
      let algoSig;
      // Convert Uint8Array to base64

      const algoSigBase64 = uint8ArrayToBase64(algoSig);
      const ethSig = uint8ArrayToEthereumHexString(algoSig);

      // Verify signature
      if (
        !(await siwaConfig.verifyMessage({
          message,
          signature: ethSig,
          address: address,
          algoAddress: initAddress,
          algoSignature: algoSigBase64,
        }))
      ) {
        throw new Error('Error verifying SIWA signature');
      }

      const data = await session.refetch().then((res) => {
        onSignIn?.(res?.data ?? undefined);
        return res?.data;
      });

      setStatus(StatusState.READY);
      return data as SIWASession;
    } catch (error) {
      onError(error);
      console.error('Error during signIn:', error);
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
