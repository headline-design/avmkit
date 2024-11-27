"use client"

import { useState, useEffect, useCallback } from "react";
import { PeraWalletConnect } from "@perawallet/connect";
import { DeflyWalletConnect } from "@blockshake/defly-connect";
import algosdk from "algosdk";
import {
  getMessageBytes,
  hashMessage,
  initializeAlgodClient,
} from "@/utils/siwaUtils";

export type WalletProvider = "PeraWallet" | "Defly" | "Kibisis";

// Ensure window is only accessed on the client side
declare global {
  interface Window {
    algorand?: any;
    handleWalletError: (error: string) => void;
  }
}

const isClient = typeof window !== "undefined";
const clientWindow = isClient ? window : {} as typeof window;
clientWindow.algorand = clientWindow.algorand || {};

const peraWallet = new PeraWalletConnect();
const deflyWallet = new DeflyWalletConnect();
const algodClient = initializeAlgodClient();

export const useWalletConnection = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<WalletProvider>("PeraWallet");
  const [isLoading, setIsLoading] = useState(false);

  // Move localStorage access to useEffect
  useEffect(() => {
    if (isClient) {
      const storedAddress = localStorage.getItem("address");
      const storedProvider = localStorage.getItem("walletProvider") as WalletProvider;
      if (storedAddress) setAddress(storedAddress);
      if (storedProvider) setProvider(storedProvider);
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("walletProvider", provider);
    }
  }, [provider]);

  const disconnectWallet = useCallback(() => {
    if (provider === "PeraWallet") {
      peraWallet.disconnect();
    } else if (provider === "Defly") {
      deflyWallet.disconnect();
    }
    setAddress(null);
    if (isClient) {
      localStorage.removeItem("walletProvider");
      localStorage.removeItem("address");
    }
  }, [provider]);

  const connectWallet = async (selectedProvider: WalletProvider) => {
    setIsLoading(true);
    try {
      let newAccounts: string[];
      if (selectedProvider === "PeraWallet") {
        newAccounts = await peraWallet.connect();
        peraWallet.connector?.on("disconnect", disconnectWallet);
      } else if (selectedProvider === "Defly") {
        newAccounts = await deflyWallet.connect();
        deflyWallet.connector?.on("disconnect", disconnectWallet);
      } else if (selectedProvider === "Kibisis") {
        const address = await injectKibisis();
        newAccounts = [address];
      } else {
        throw new Error("Unsupported wallet provider");
      }
      setAddress(newAccounts[0]);
      setProvider(selectedProvider);
      if (isClient) {
        localStorage.setItem("walletProvider", selectedProvider);
        localStorage.setItem("address", newAccounts[0]);
      }
    } catch (error) {
      console.error(`Error connecting to ${selectedProvider}:`, error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const reconnectSession = useCallback(async () => {
    setIsLoading(true);
    try {
      if (isClient) {
        const storedProvider = localStorage.getItem("walletProvider") as WalletProvider;
        const storedAddress = localStorage.getItem("algoAddress");

        if (storedProvider && storedAddress) {
          setProvider(storedProvider);
          setAddress(storedAddress);

          if (storedProvider === "PeraWallet") {
            await peraWallet.reconnectSession();
            peraWallet.connector?.on("disconnect", disconnectWallet);
          } else if (storedProvider === "Defly") {
            await deflyWallet.reconnectSession();
            deflyWallet.connector?.on("disconnect", disconnectWallet);
          }
        }
      }
    } catch (error) {
      console.error("Error reconnecting session:", error);
      disconnectWallet();
    } finally {
      setIsLoading(false);
    }
  }, [disconnectWallet]);

  useEffect(() => {
    reconnectSession();
    return () => {
      peraWallet.connector?.off("disconnect");
      deflyWallet.connector?.off("disconnect");
    };
  }, [reconnectSession]);

  const signMessage = async (message: string): Promise<Uint8Array> => {
    if (!address) {
      throw new Error("No address connected");
    }

    const hashedMessage = hashMessage(message);
    const encodedHashedMessage = getMessageBytes(Buffer.from(hashedMessage).toString("utf8"));

    switch (provider) {
      case "PeraWallet":
        const peraSigArray = await peraWallet.signData(
          [{ data: encodedHashedMessage, message: "" }],
          address
        );
        return peraSigArray[0];
      case "Defly":
        // This is a temporary solution until Defly Wallet supports signing arbitrary messages
        const suggestedParams = await algodClient.getTransactionParams().do();
        console.log("Suggested params", suggestedParams);
        console.log(address)
        const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
          note: encodedHashedMessage,
          from: address,
          to: address,
          amount: 0,
          suggestedParams,
        } as any);
        console.log("TXN to sign", txn);
        const txnGroup = [{ txn, signerAddress: [address] }];
        const deflySigArray = await deflyWallet.signTransaction([txnGroup]);
        const decodedTxn = algosdk.decodeSignedTransaction(deflySigArray[0]);
        return decodedTxn.sig as unknown as Uint8Array;

      case "Kibisis":
        const MXMessage = "MX" + JSON.stringify(message);
        const result = await clientWindow?.algorand.signBytes({
          data: new Uint8Array(clientWindow?.Buffer.from(MXMessage)),
        });

        return result?.signature as Uint8Array;
      default:
        throw new Error("Unsupported wallet provider");
    }
  };

  return {
    address,
    provider,
    isLoading,
    connectWallet,
    disconnectWallet,
    signMessage,
  };
};

export const injectKibisis = async () => {
  console.log("Injecting Kibisis script...");

  async function enableWallet() {
    if (typeof window === "undefined" || !window.algorand) {
      console.error("AVM Wallets not available");
      return null; // No Algorand wallets available, handle as an error.
    }

    try {
      const result = await window.algorand.enable("kibisis");
      console.log("Wallet enabled:", result);
      if (result.accounts && result.accounts.length > 0) {
        return result.accounts[0].address;
      } else {
        throw new Error("No accounts available"); // Throwing error if no accounts found.
      }
    } catch (error) {
      console.error("Error enabling wallet:", error);
      return null; // Returning null on user cancellation or any other error.
    }
  }

  let address = await enableWallet();
  if (address) {
    return address;
  } else {
    console.log("No address obtained or user cancelled.");
    if (typeof window !== "undefined") {
      window.handleWalletError("User cancelled or no accounts available"); // Handling errors or cancellations globally.
    }
    throw new Error("User cancelled or no accounts available");
  }
};

