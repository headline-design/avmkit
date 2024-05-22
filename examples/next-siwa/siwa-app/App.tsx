"use client";

import ScrollToTop from "@/dashboard/components/scroll-to-top";
import ErrorBoundary from "@/dashboard/lib/error-boundary";
import ProviderLayout from "@/dashboard/providers/provider-layout";
import AboutView from "@/dashboard/views/about-view";
import ContactView from "@/dashboard/views/contact-view";
import { ErrorView } from "@/dashboard/views/error-view";
import FeaturesView from "@/dashboard/views/features-view";
import GettingStartedView from "@/dashboard/views/getting-started-view";
import MainView from "@/dashboard/views/main/main-view";
import PrivacyView from "@/dashboard/views/privacy-view";
import TermsView from "@/dashboard/views/terms-view";
import React, { lazy, useMemo, useState } from "react";
import { QueryClient } from "@tanstack/react-query";
import { XWalletProvider } from "@/x-wallet/xwallet-context";
import { UserProvider } from "@/dashboard/contexts/user-context";
import { WalletConnectionProvider } from "@/dashboard/contexts/wallet-connection-context";
import Web3Provider from "@/dashboard/contexts/web3-context";
import { LoginModalProvider } from "@/dashboard/contexts/login-modal-context";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Outlet,
  useLocation,
} from "react-router-dom";

function App(queryClient) {
  const routes = useMemo(
    () => [
      <Route
        key="main"
        path=""
        element={
          <ProviderLayout queryClient={queryClient}>
            <ErrorBoundary fallbackRender={({ error }) => <ErrorView />}>
              <ScrollToTop />
              <Outlet />
            </ErrorBoundary>
          </ProviderLayout>
        }
      >
        <Route index element={<MainView />} />
        <Route path="/contact/*" element={<ContactView />} />
        <Route path="/features/*" element={<FeaturesView />} />
        <Route path="/about/*" index element={<AboutView />} />
        <Route path="/getting-started/*" element={<GettingStartedView />} />
        <Route path="/terms/*" element={<TermsView />} />
        <Route path="/privacy/*" element={<PrivacyView />} />
      </Route>,
      <Route key="error" path="*" element={<ErrorView />} />,
    ],
    [queryClient],
  );

  const memoizedRouter = useMemo(
    () => createBrowserRouter(createRoutesFromElements(routes)),
    [routes],
  );

  return (
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
  );
}

export default App;
