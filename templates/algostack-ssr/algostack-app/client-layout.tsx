"use client"

import React, { memo, Suspense } from "react";
import { ThemeProvider } from "next-themes";
import Header from "./layout/header";
import ModalProvider from "./contexts/modal-context";

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <React.StrictMode>
      <ThemeProvider attribute="class" defaultTheme="dark">
        <ModalProvider>
          <Suspense>
            <div className="flex flex-col min-h-[100dvh] bg-background">
              <Header />
              {children}
            </div>
          </Suspense>
        </ModalProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
};

export default memo(ClientLayout);
