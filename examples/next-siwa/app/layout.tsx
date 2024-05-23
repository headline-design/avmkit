import type { Metadata } from "next";
import { satoshi, inter } from "@/dashboard/styles/fonts";
import "@/dashboard/styles/globals.css";
import App from "./app";
import ClientBoundary from "@/dashboard/lib/client-boundary";
import type { Viewport } from "next";
import {cn} from "@/dashboard/lib/utils"

export const metadata: Metadata = {
  title: "SIWA",
  description: "Sign In With Algorand",
  icons: "/favicon.ico",
  openGraph: {
    title: "SIWA",
    description: "Sign In With Algorand",
    images: [
      {
        url: "/siwa-og.png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SIWA",
    description: "Sign In With Algorand",
    images: ["/siwa-og.png"],
    creator: "@headline_crypto",
  },
  metadataBase: new URL("https://siwa-next.vercel.app"),
};

export const viewport: Viewport = {
  initialScale: 1,
  width: "device-width",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html   lang="en"
    suppressHydrationWarning
    className={cn(satoshi.variable, inter.variable)}>
       <body className="bg-background-accent">
        <ClientBoundary>
          <App />
        </ClientBoundary>
      </body>
    </html>
  );
}




