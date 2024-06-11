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
import {
  WalletConnectionProvider,
  useWalletConnection,
} from "@/dashboard/contexts/wallet-connection-context";
import { LoginModalProvider } from "@/dashboard/contexts/login-modal-context";
import { Pipeline } from "@avmkit/pipeline";
import {
  CHAIN_NETWORK_KEY,
  PipeConnectors,
} from "@/dashboard/utils/constants/common";
import localStore from "store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { XWalletProvider } from "@avmkit/xwallet";

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

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
          <WalletConnectionProvider>
            <XWalletProvider
              useWalletConnection={useWalletConnection}
              PipeConnectors={PipeConnectors}
            >
              <Web3Provider>
                <LoginModalProvider>
                  <RouterProvider router={memoizedRouter} />
                </LoginModalProvider>
              </Web3Provider>
            </XWalletProvider>
          </WalletConnectionProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}

export default ClientApp;
