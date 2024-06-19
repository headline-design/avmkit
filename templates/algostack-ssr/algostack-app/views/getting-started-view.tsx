/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState } from "react";
import { copyToClipboard } from "../components/copy-to-clipboard";
import { IconTick } from "../icons/tick";
import { IconCopy } from "../icons/copy";
import { Button } from "../ui/button";

const GettingStartedView = () => {
  const [copiedCommand, setCopiedCommand] = useState("");

  // Function to handle copy action
  const handleCopy = (
    text: string,
    commandId: React.SetStateAction<string>,
  ) => {
    copyToClipboard(text)
      .then(() => {
        setCopiedCommand(commandId); // Set the ID of the copied command
        setTimeout(() => setCopiedCommand(""), 2000); // Reset after 2 seconds
      })
      .catch((err) => console.error("Could not copy text: ", err));
  };

  return (
    <div className="max-w-4xl mx-auto p-5 space-y-6 container">
      <h1 className="text-3xl font-bold text-center mb-6">
        Getting Started with AlgoStack SSR
      </h1>

      <div className="p-6">
        {/* Prerequisites section */}
        <h2 className="text-2xl font-semibold mb-3">Prerequisites</h2>
        <ul className="list-disc pl-5 mb-6">
          <li>Node.js and npm installed.</li>
          <li>Basic understanding of React and Next.js.</li>
        </ul>

        {/* Clone repository section */}
        <h2 className="text-2xl font-semibold mb-3">
          Step 1: Clone the Repository
        </h2>
        <p className="mb-3">
          Use the following command to clone the AlgoStack repository:
        </p>
        <div className="mb-4 mt-6 max-h-[650px] overflow-x-auto rounded-lg border bg-zinc-950 py-4 dark:bg-zinc-900 relative p-3 dark:text-foreground text-background">
          <Button
            size="sm"
            className="absolute right-1 top-1"
            variant={"ghost"}
            onClick={() =>
              handleCopy(
                "git clone https://github.com/headline-design/algostack-ssr.git",
                "clone",
              )
            }
          >
            {copiedCommand === "clone" ? <IconTick /> : <IconCopy />}
          </Button>
          <code>
            git clone https://github.com/headline-design/algostack-ssr.git
          </code>
        </div>

        {/* Install dependencies section */}
        <h2 className="text-2xl font-semibold mb-3">
          Step 2: Install Dependencies
        </h2>
        <div className="mb-4 mt-6 max-h-[650px] overflow-x-auto rounded-lg border bg-zinc-950 py-4 dark:bg-zinc-900 relative p-3 dark:text-foreground text-background">
          <Button
            size="sm"
            className="absolute right-1 top-1"
            variant={"ghost"}
            onClick={() => handleCopy("cd algostack-ssr\nnpm install", "install")}
          >
            {copiedCommand === "install" ? <IconTick /> : <IconCopy />}
          </Button>
          <code>
            cd algostack-ssr
            <br />
            npm install
          </code>
        </div>

        {/* Run the application section */}
        <h2 className="text-2xl font-semibold mb-3">
          Step 3: Run the Application
        </h2>
        <div className="mb-4 mt-6 max-h-[650px] overflow-x-auto rounded-lg border bg-zinc-950 py-4 dark:bg-zinc-900 relative p-3 dark:text-foreground text-background">
          <code>npm run dev</code>
        </div>

        {/* Adding new views section */}
        <h2 className="text-2xl font-semibold mb-3">Adding New Views</h2>

        <p className="mb-3">
          To integrate new views like{" "}
          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
            GettingStartedView
          </code>{" "}
          into your application:
        </p>
        <ol className="list-decimal pl-5 mb-3 space-y-1">
          <li>
            Ensure your component is structured appropriately as a view. For
            this example, we're using{" "}
            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
              GettingStartedView
            </code>{" "}
            placed in the{" "}
            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
              algostack-app/views
            </code>{" "}
            directory.
          </li>
          <li>
            Import the view in your main{" "}
            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
              page.tsx
            </code>{" "}
            file for "getting-started" in the app directory, similar to other pages:
          </li>
          <pre className="mb-4 mt-6 max-h-[650px] overflow-x-auto rounded-lg border bg-zinc-950 py-4 dark:bg-zinc-900 relative p-3 dark:text-foreground text-background">
            <code>
              import GettingStartedView from
              "@/algostack-app/views/getting-started-view";
            </code>
          </pre>
          <li>
            Adding a new page in the{" "}
            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
              app router
            </code>{" "}
            works by nesting under a common{" "}
            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
              layout
            </code>{" "}
            component. Define a shared layout that suits your application's structure. For
            example:
          </li>
          <pre className="mb-4 mt-6 max-h-[650px] overflow-x-auto rounded-lg border bg-zinc-950 py-4 dark:bg-zinc-900 relative p-3 dark:text-foreground text-background">
            <code>{`import { ClientProvider } from "./providers";
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

  return (
    <ClientProvider>
      <html
        lang="en"
        suppressHydrationWarning
        className={\`\${unbounded.variable} \${inter.className}\`}
      >
        <body >
          <ServerProvider>{children}</ServerProvider>
        </body>
      </html>
    </ClientProvider>
  );
}`}</code>
          </pre>
        </ol>
        <p>
          By following these steps, you integrate the{" "}
          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
            GettingStartedView
          </code>{" "}
          into your application's routing, making it accessible to users via the
          defined path.
        </p>

        {/* Adding components and utilities section */}
        <h2 className="text-2xl font-semibold mb-3">
          Adding Components and Utilities
        </h2>
        <p>
          Create new files in the{" "}
          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
            algostack-app/components
          </code>{" "}
          or{" "}
          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
            algostack-app/lib
          </code>{" "}
          directories to add reusable components or utility functions.
        </p>
      </div>

      <p className="text-center font-semibold mt-6">
        Explore and build your application with AlgoStack SSR, leveraging
        Next.js and Tailwind CSS.
      </p>
    </div>
  );
};

export default GettingStartedView;
