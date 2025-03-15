"use client"

import { useState, useEffect, useCallback } from "react"
import { PeraWalletConnect } from "@perawallet/connect"
import { DeflyWalletConnect } from "@blockshake/defly-connect"
import algosdk from "algosdk"
import { AVMWebClient } from "@agoralabs-sh/avm-web-provider"
import { getMessageBytes, hashMessage, initializeAlgodClient } from "@/utils/siwaUtils"
import LuteConnect from "lute-connect"

export type WalletProvider = "Pera" | "Defly" | "Kibisis" | "Lute"

declare global {
  interface Window {
    algorand: any
    handleWalletError: (error: string) => void
  }
}

const isClient = typeof window !== "undefined"

let luteWallet: LuteConnect | null = null
let client: AVMWebClient | null = null
let peraWallet: PeraWalletConnect
let deflyWallet: DeflyWalletConnect
let algodClient: algosdk.Algodv2

if (isClient) {
  luteWallet = new LuteConnect("SIWA Connect")
  peraWallet = new PeraWalletConnect()
  deflyWallet = new DeflyWalletConnect()
  client = AVMWebClient.init({
    debug: true,
  })
  algodClient = initializeAlgodClient()
}

export const useWalletConnection = () => {
  const [address, setAddress] = useState<string | null>(null)
  const [provider, setProvider] = useState<WalletProvider>("Pera")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isClient) {
      const storedAddress = localStorage.getItem("address")
      const storedProvider = localStorage.getItem("walletProvider") as WalletProvider
      if (storedAddress) setAddress(storedAddress)
      if (storedProvider) setProvider(storedProvider)
    }
  }, [])

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("walletProvider", provider)
    }
  }, [provider])

  const disconnectWallet = useCallback(() => {
    if (provider === "Pera") {
      peraWallet.disconnect()
    } else if (provider === "Defly") {
      deflyWallet.disconnect()
    }
    setAddress(null)
    if (isClient) {
      localStorage.removeItem("walletProvider")
      localStorage.removeItem("address")
    }
  }, [provider])

  const connectWallet = async (selectedProvider: WalletProvider) => {
    setIsLoading(true)
    try {
      let newAccounts: string[]
      if (selectedProvider === "Pera") {
        newAccounts = await peraWallet.connect()
        peraWallet.connector?.on("disconnect", disconnectWallet)
      } else if (selectedProvider === "Defly") {
        newAccounts = await deflyWallet.connect()
        deflyWallet.connector?.on("disconnect", disconnectWallet)
      } else if (selectedProvider === "Kibisis") {
        const address = await enableWallet()
        if (!address) throw new Error("Failed to connect to Kibisis wallet")
        newAccounts = [address]
      } else if (selectedProvider === "Lute") {
        const address = await connectLute()
        newAccounts = [address]
      } else {
        throw new Error("Unsupported wallet provider")
      }
      setAddress(newAccounts[0])
      setProvider(selectedProvider)
      if (isClient) {
        localStorage.setItem("walletProvider", selectedProvider)
        localStorage.setItem("address", newAccounts[0])
      }
    } catch (error) {
      console.error(`Error connecting to ${selectedProvider}:`, error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const reconnectSession = useCallback(async () => {
    setIsLoading(true)
    try {
      if (isClient) {
        const storedProvider = localStorage.getItem("walletProvider") as WalletProvider
        const storedAddress = localStorage.getItem("algoAddress")

        if (storedProvider && storedAddress) {
          setProvider(storedProvider)
          setAddress(storedAddress)

          if (storedProvider === "Pera") {
            await peraWallet.reconnectSession()
            peraWallet.connector?.on("disconnect", disconnectWallet)
          } else if (storedProvider === "Defly") {
            await deflyWallet.reconnectSession()
            deflyWallet.connector?.on("disconnect", disconnectWallet)
          }
        }
      }
    } catch (error) {
      console.error("Error reconnecting session:", error)
      disconnectWallet()
    } finally {
      setIsLoading(false)
    }
  }, [disconnectWallet])

  useEffect(() => {
    reconnectSession()
    return () => {
      if (isClient) {
        peraWallet.connector?.off("disconnect")
        deflyWallet.connector?.off("disconnect")
      }
    }
  }, [reconnectSession])

  const signMessage = async (message: string): Promise<{ signature: Uint8Array; transaction?: any | null }> => {
    if (!address) {
      throw new Error("No address connected")
    }

    const hashedMessage = hashMessage(message)
    const encodedHashedMessage = getMessageBytes(Buffer.from(hashedMessage).toString("utf8"))

    const suggestedParams = ["Defly", "Lute", "Pera"].includes(provider)
      ? await algodClient.getTransactionParams().do()
      : null

    switch (provider) {
      case "Pera":
        if (!suggestedParams) {
          throw new Error("Suggested params are not available")
        }
        const peraTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
          note: encodedHashedMessage,
          from: address,
          to: address,
          amount: 0,
          suggestedParams,
        } as any)

        const peraTxnGroup = [{ txn: peraTxn, signerAddress: [address] }]
        const peraSigArray = await peraWallet.signTransaction([peraTxnGroup])
        const decodedPeraTxn = algosdk.decodeSignedTransaction(peraSigArray[0])
        return {
          signature: decodedPeraTxn.sig as unknown as Uint8Array,
          transaction: peraSigArray[0],
        }

      case "Defly":
        if (!suggestedParams) {
          throw new Error("Suggested params are not available")
        }
        const deflyTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
          note: encodedHashedMessage,
          from: address,
          to: address,
          amount: 0,
          suggestedParams,
        } as any)

        const deflyTxnGroup = [{ txn: deflyTxn, signerAddress: [address] }]
        const deflySigArray = await deflyWallet.signTransaction([deflyTxnGroup])
        const decodedDeflyTxn = algosdk.decodeSignedTransaction(deflySigArray[0])
        return {
          signature: decodedDeflyTxn.sig as unknown as Uint8Array,
          transaction: deflySigArray[0],
        }

      case "Kibisis":
        if (!isClient || !client) {
          throw new Error("Kibisis is only available in the browser")
        }

        // Get transaction parameters
        const kibisisSuggestedParams = await algodClient.getTransactionParams().do()

        // Create a transaction with the message in the note field
        const kibisisTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
          note: encodedHashedMessage,
          from: address,
          to: address,
          amount: 0,
          suggestedParams: kibisisSuggestedParams,
        })

        const kibisisTxnBytes = kibisisTxn.toByte()
        const kibisisTxnGroup = [{ txn: kibisisTxn, signerAddress: [address] }]

        return new Promise((resolve, reject) => {
          // First, make sure the wallet is enabled
          const providerId = "f6d1c86b-4493-42fb-b88d-a62407b4cdf6" // Kibisis provider ID

          // Set up the enable callback to ensure authorization
          client!.onEnable(({ error, result }) => {
            if (error) {
              console.error("Kibisis enable error:", error)
              reject(error)
              return
            }

            // Now set up the sign transactions callback
            client!.onSignTransactions(({ error, result: signResult }) => {
              if (error) {
                console.error("Kibisis sign error:", error)
                reject(error)
                return
              }

              if (!signResult || !signResult.stxns || signResult.stxns.length === 0) {
                reject(new Error("No signed transactions returned from Kibisis wallet"))
                return
              }

              try {
                // Decode the signed transaction to extract the signature
                const signedTxnBytes = Buffer.from(signResult.stxns[0], "base64")
                const decodedTxn = algosdk.decodeSignedTransaction(signedTxnBytes)

                resolve({
                  signature: decodedTxn.sig as unknown as Uint8Array,
                  transaction: signResult.stxns[0],
                })
              } catch (err) {
                console.error("Error decoding signed transaction:", err)
                reject(err)
              }
            })

            // Send the sign transactions request after enabling
            try {
              // send a sign transactions request
              client.signTransactions({ txns: kibisisTxnGroup.map(txn => ({ txn: Buffer.from(txn.txn.toByte()).toString("base64"), signerAddress: txn.signerAddress })) });
            } catch (err) {
              console.error("Error sending sign request to Kibisis:", err)
              reject(err)
            }
          })

          // Re-enable the wallet to ensure authorization
          try {
            client!.enable({ providerId })
          } catch (err) {
            console.error("Error enabling Kibisis:", err)
            reject(err)
          }
        })

      case "Lute":
        if (!suggestedParams) {
          throw new Error("Suggested params are not available")
        }
        const luteTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
          note: encodedHashedMessage,
          from: address,
          to: address,
          amount: 0,
          suggestedParams,
        })

        const luteSigArray = await luteWallet!.signTxns([
          { txn: Buffer.from(algosdk.encodeUnsignedTransaction(luteTxn)).toString("base64") },
        ])

        const decodedLuteTxn = algosdk.decodeSignedTransaction(luteSigArray[0])

        return {
          signature: decodedLuteTxn.sig as unknown as Uint8Array,
          transaction: luteSigArray[0],
        }

      default:
        throw new Error("Unsupported wallet provider")
    }
  }

  return {
    address,
    provider,
    isLoading,
    connectWallet,
    disconnectWallet,
    signMessage,
  }
}

// Function to handle Lute wallet connection
export const connectLute = async () => {
  if (!isClient || !luteWallet) {
    throw new Error("Lute wallet is not available")
  }
  try {
    const genesis = await algodClient.genesis().do()
    const genesisID = `${genesis.network}-${genesis.id}`
    const addresses = await luteWallet.connect(genesisID)
    return addresses[0]
  } catch (err: any) {
    console.error(`[LuteWallet] Error connecting: ${err.message}`)
    throw err
  }
}

// Function to enable Kibisis wallet
export async function enableWallet(): Promise<string> {
  if (!isClient || !client) {
    throw new Error("AVM Web Client is not available")
  }

  if (!window.algorand) {
    throw new Error("AVM Wallets not available")
  }

  // First, discover available providers
  return new Promise((resolve, reject) => {
    // Set up the discover callback
    client!.onDiscover(({ error, result }) => {
      if (error) {
        console.error("Discover error:", error)
        // Don't reject here, as we might still be able to enable
      } else {
        console.log("Discovered provider:", result)
      }
    })

    // Set up the enable callback
    client!.onEnable(({ error, result }) => {
      if (error) {
        console.error("Enable error:", error)
        reject(error)
        return
      }

      if (!result || !result.accounts || result.accounts.length === 0) {
        reject(new Error("No accounts returned from Kibisis wallet"))
        return
      }

      console.log("Kibisis enabled successfully:", result)
      // Resolve with the first account address
      resolve(result.accounts[0].address)
    })

    // First discover providers
    client!.discover()

    // Then enable the Kibisis provider
    // Use a timeout to ensure discover has time to complete
    setTimeout(() => {
      try {
        // The Kibisis provider ID
        const providerId = "f6d1c86b-4493-42fb-b88d-a62407b4cdf6"
        client!.enable({ providerId, genesisHash: "wGHE2Pwdvd7S12BL5FaOP20EGYesN73ktiC1qzkkit8=" })
      } catch (err) {
        console.error("Error enabling Kibisis:", err)
        reject(err)
      }
    }, 500)
  })
}

