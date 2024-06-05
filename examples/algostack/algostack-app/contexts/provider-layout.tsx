import React, { memo, Suspense } from "react";
import { ThemeProvider } from "next-themes";
import Navbar from "../layout/navbar";
import ModalProvider from "./modal-context";
import Footer from "../components/footer/footer";

const ProviderLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <React.StrictMode>
      <ThemeProvider attribute="class" defaultTheme="dark">
        <ModalProvider>
          <Suspense>
            <div className="flex min-h-screen flex-col justify-between">
              <Navbar location="home" />
              {children}
              <Footer />
            </div>
          </Suspense>
        </ModalProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
};

export default memo(ProviderLayout);
