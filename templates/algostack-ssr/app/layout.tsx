import { ParentProviders } from "./providers";
import { inter, unbounded } from "@/dashboard/styles/fonts";
import { cn, constructMetadata } from "@/dashboard/lib/utils";
import { headers } from "next/headers";

import React from "react";
import ServerProvider from "./server-provider";
import type { Viewport } from "next";

export const metadata = constructMetadata();

export const viewport: Viewport = {
  initialScale: 1,
  width: "device-width",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode | any;
}) {
  const headersList = headers();
  const activePath = headersList.get("x-forwarded-host");

  return (
    <ParentProviders>
      <html
        lang="en"
        suppressHydrationWarning
        className={`${unbounded.variable} ${inter.className}`}
      >
        <body >
          <ServerProvider>{children}</ServerProvider>
        </body>
      </html>
    </ParentProviders>
  );
}
