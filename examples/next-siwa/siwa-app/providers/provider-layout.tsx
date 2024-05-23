import React, { memo, Suspense } from "react";
import { ThemeProvider } from "next-themes";
import Navbar from "../navbar";
import ModalProvider from "./modal-provider";
import Footer from "../components/footer/footer";

const ProviderLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <React.StrictMode>
      <ThemeProvider attribute="class" defaultTheme="dark">
        <Suspense>
          <div className="flex min-h-screen flex-col justify-between">
            <Navbar location="home" />
            <ModalProvider>{children}</ModalProvider>
            <Footer />
          </div>
        </Suspense>
      </ThemeProvider>
    </React.StrictMode>
  );
};

export default memo(ProviderLayout);
