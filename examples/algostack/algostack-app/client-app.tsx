"use client";

import React, { useMemo, useState } from "react";
import Web3Provider from "@/algostack-app/contexts/web3-context";
import ScrollToTop from "@/algostack-app/components/scroll-to-top";
import ErrorBoundary from "@/algostack-app/lib/error-boundary";
import { SessionProvider } from "next-auth/react";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import {
  AboutView,
  ContactView,
  ErrorView,
  FeaturesView,
  GettingStartedView,
  MainView,
  PricingView,
  PrivacyView,
  TermsView,
} from "./views";
import ClientLayout from "./client-layout";
import { UserProvider } from "@/dashboard/contexts/user-context";
import {
  GlobalPipeState,
  WalletConnectionProvider,
  useWalletConnection,
} from "@/dashboard/contexts/wallet-connection-context";
import { LoginModalProvider } from "@/dashboard/contexts/login-modal-context";
import { Pipeline } from "@avmkit/pipeline";
import {
  CHAIN_NETWORK_KEY,
  Networks,
  PipeConnectors,
} from "@/dashboard/utils/constants/common";
import localStore from "store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { XWalletProvider } from "@avmkit/xwallet";
import algorandGlobalSelectors from "@/dashboard/redux/algorand/global/globalSelctors";
import { networkConfig } from "@/avm/constants/network-config";
import { useSelector } from "react-redux";

function ClientApp() {
  const routes = useMemo(
    () => [
      <Route
        key="main"
        path=""
        element={
          <ClientLayout>
            <ErrorBoundary fallbackRender={({ error }) => <ErrorView />}>
              <ScrollToTop />
              <Outlet />
            </ErrorBoundary>
          </ClientLayout>
        }
      >
        <Route index element={<MainView />} />
        <Route path="/pricing/*" element={<PricingView />} />
        <Route path="/contact/*" element={<ContactView />} />
        <Route path="/features/*" element={<FeaturesView />} />
        <Route path="/about/*" index element={<AboutView />} />
        <Route path="/getting-started/*" element={<GettingStartedView />} />
        <Route path="/terms/*" element={<TermsView />} />
        <Route path="/privacy/*" element={<PrivacyView />} />
      </Route>,
      <Route key="error" path="*" element={<ErrorView />} />,
    ],
    [],
  );

  const memoizedRouter = useMemo(
    () => createBrowserRouter(createRoutesFromElements(routes)),
    [routes],
  );

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

  const globalPipeState = useSelector(
    algorandGlobalSelectors.selectCurrentPipeConnectState,
  );
  const [pipeState, setPipeState] = useState<GlobalPipeState>({
    provider: globalPipeState.provider,
    myAddress: "",
    mainNet: Networks.MainNet ? true : false,
    chain: globalPipeState.chain,
  });

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <WalletConnectionProvider>
            <XWalletProvider
              useWalletConnection={useWalletConnection}
              networkConfig={networkConfig}
              pipeState={pipeState}
              PipeConnectors={PipeConnectors}
            >
                <Web3Provider>
                  <LoginModalProvider>
                    <RouterProvider router={memoizedRouter} />
                  </LoginModalProvider>
                </Web3Provider>
            </XWalletProvider>
          </WalletConnectionProvider>
        </UserProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}

export default ClientApp;
