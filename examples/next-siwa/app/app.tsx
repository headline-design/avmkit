"use client";

import ScrollToTop from "@/siwa-app/components/scroll-to-top";
import ErrorBoundary from "@/siwa-app/lib/error-boundary";
import ProviderLayout from "@/siwa-app/provider-layout";
import AboutView from "@/siwa-app/views/about-view";
import ContactView from "@/siwa-app/views/contact-view";
import { ErrorView } from "@/siwa-app/views/error-view";
import FeaturesView from "@/siwa-app/views/features-view";
import GettingStartedView from "@/siwa-app/views/getting-started-view";
import MainView from "@/siwa-app/views/main-view";
import PricingView from "@/siwa-app/views/pricing-view";
import PrivacyView from "@/siwa-app/views/privacy-view";
import TermsView from "@/siwa-app/views/terms-view";
import React, { lazy, useMemo, useState } from "react";
import { QueryClient } from "@tanstack/react-query";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Outlet,
  useLocation,
} from "react-router-dom";

function App() {
  const [queryClient] = useState(() => new QueryClient());

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
    [queryClient]
  );

  const memoizedRouter = useMemo(
    () => createBrowserRouter(createRoutesFromElements(routes)),
    [routes]
  );

  return <RouterProvider router={memoizedRouter} />;
}

export default App;
