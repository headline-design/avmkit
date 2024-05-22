"use client";

import ScrollToTop from "@/siwa-app/components/scroll-to-top";
import ErrorBoundary from "@/siwa-app/lib/error-boundary";
import ProviderLayout from "@/siwa-app/providers/provider-layout";
import AboutView from "@/siwa-app/views/about-view";
import ContactView from "@/siwa-app/views/contact-view";
import { ErrorView } from "@/siwa-app/views/error-view";
import FeaturesView from "@/siwa-app/views/features-view";
import GettingStartedView from "@/siwa-app/views/getting-started-view";
import MainView from "@/siwa-app/views/main/main-view";
import PrivacyView from "@/siwa-app/views/privacy-view";
import TermsView from "@/siwa-app/views/terms-view";
import React, { lazy, useMemo, useState } from "react";
import { QueryClient } from "@tanstack/react-query";
import { XWalletProvider } from "@/x-wallet/xwallet-context";
import { UserProvider } from "@/siwa-app/contexts/user-context";
import { WalletConnectionProvider } from "@/siwa-app/contexts/wallet-connection-context";
import Web3Provider from "@/siwa-app/contexts/web3-context";
import { LoginModalProvider } from "@/siwa-app/contexts/LoginModalContext";

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
