"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { configureReduxStores } from "@/dashboard/redux/store";
import { Toaster } from "sonner";
import Web3Provider from "@/algostack-app/contexts/web3-context";
import {
  WalletConnectionProvider,
} from "@/algostack-app/contexts/wallet-connection-context";
import ModalProvider from "@/algostack-app/contexts/modal-context";

export function ClientProvider({
  children,
}: {
  children: React.ReactNode | any;
}) {
  const queryClient = new QueryClient();
  const store = configureReduxStores();

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <WalletConnectionProvider>
              <Web3Provider>{children}</Web3Provider>
          </WalletConnectionProvider>
        </SessionProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export function ChildProvider({
  children,
}: {
  children: React.ReactNode | any;
}) {
  return (
    <ThemeProvider
      disableTransitionOnChange
      attribute="class"
      value={{ light: "light", dark: "dark" }}
      defaultTheme="dark"
    >
      <Toaster
        style={{ zIndex: 9999 }}
        toastOptions={{
          unstyled: true,
          duration: 5000,
          classNames: {
            toast: "rust-toaster",
          },
        }}
      />
     <ModalProvider>{children}</ModalProvider>
    </ThemeProvider>
  );
}
