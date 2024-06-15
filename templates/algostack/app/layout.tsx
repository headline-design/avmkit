import type { Metadata } from "next";
import { inter, unbounded } from "@/dashboard/styles/fonts";
import "@/dashboard/styles/globals.css";
import ClientBoundary from "@/dashboard/client-boundary";
import type { Viewport } from "next";
import dynamic from "next/dynamic";

const App = dynamic(() => import("@/dashboard/app"), {
  ssr: false,
});

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
  metadataBase: new URL("https://algostack.vercel.app"),
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
    <html lang="en">
      <body className={`${unbounded.variable} ${inter.className}`}>
        <ClientBoundary>
          <App />
        </ClientBoundary>
      </body>
    </html>
  );
}
