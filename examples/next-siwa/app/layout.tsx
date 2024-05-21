import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import App from "./app";
import ClientBoundary from "@/siwa-app/lib/client-boundary";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SIWA",
  description: "Sign In With Algorand",
  icons: "/favicon.ico",
  openGraph: {
    title: "SIWA",
    description: "Sign In With Algorand",
    images: [
      {
        url: "/fuse-og.png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SIWA",
    description: "Sign In With Algorand",
    images: ["/fuse-og.png"],
    creator: "@headline_crypto",
  },
  metadataBase: new URL("https://next-siwa.vercel.app"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientBoundary>
          <App />
        </ClientBoundary>
      </body>
    </html>
  );
}
