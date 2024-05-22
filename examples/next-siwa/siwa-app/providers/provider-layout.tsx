import React, { memo, Suspense } from "react";
import { ThemeProvider } from "next-themes";
import { Header } from "../header";
import ModalProvider from "./modal-provider";

const ProviderLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {

  return (
    <React.StrictMode>
      <ThemeProvider attribute="class" defaultTheme="dark">
        <Suspense>
            <div className="flex flex-col min-h-[100dvh] bg-background">
              <Header />
              <ModalProvider>{children}</ModalProvider>
            </div>
        </Suspense>
      </ThemeProvider>
    </React.StrictMode>
  );
};

export default memo(ProviderLayout);
