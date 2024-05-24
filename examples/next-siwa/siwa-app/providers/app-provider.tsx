import { Pipeline } from "@avmkit/pipeline";
import { CHAIN_NETWORK_KEY } from "@/dashboard/utils/constants/common";
import localStore from "store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "@/dashboard/App";
import React from "react";
import { SessionProvider } from "next-auth/react";

export default function AppProvider() {
  const chainNetworkValue = localStore.get(CHAIN_NETWORK_KEY);
  const isNetworkMainnet = process.env.NEXT_PUBLIC_NETWORK_TYPE === "mainnet";

  Pipeline.main =
    chainNetworkValue === null ? isNetworkMainnet : chainNetworkValue;

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Adjust based on your needs
        refetchOnWindowFocus: false, // Adjust based on your needs
      },
    },
  });

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <App queryClient={queryClient} />
      </QueryClientProvider>
    </SessionProvider>
  );
}
