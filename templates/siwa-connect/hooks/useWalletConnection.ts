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

export type WalletProvider = "PeraWallet" | "Defly";

const peraWallet = new PeraWalletConnect();
const deflyWallet = new DeflyWalletConnect();
const algodClient = initializeAlgodClient();

export const useWalletConnection = () => {
  const [address, setAddress] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("address");
    }
    return null;
  });
  const [provider, setProvider] = useState<WalletProvider>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("walletProvider") as WalletProvider) || "PeraWallet";
    }
    return "PeraWallet";
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
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
    localStorage.removeItem("walletProvider");
    localStorage.removeItem("address");
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
      } else {
        throw new Error("Unsupported wallet provider");
      }
      setAddress(newAccounts[0]);
      setProvider(selectedProvider);
      localStorage.setItem("walletProvider", selectedProvider);
      localStorage.setItem("address", newAccounts[0]);
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

