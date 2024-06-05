"use client";

import React, { useMemo } from "react";
import Web3Provider from "@/siwa-app/contexts/web3-context";
import ScrollToTop from "@/siwa-app/components/scroll-to-top";
import ErrorBoundary from "@/siwa-app/lib/error-boundary";
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
import { XWalletProvider } from "@/x-wallet/xwallet-context";
import { UserProvider } from "@/dashboard/contexts/user-context";
import { WalletConnectionProvider } from "@/dashboard/contexts/wallet-connection-context";
import { LoginModalProvider } from "@/dashboard/contexts/login-modal-context";
import { Pipeline } from "@avmkit/pipeline";
import { CHAIN_NETWORK_KEY } from "@/dashboard/utils/constants/common";
import localStore from "store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
        <UserProvider>
          <WalletConnectionProvider>
            <XWalletProvider>
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
