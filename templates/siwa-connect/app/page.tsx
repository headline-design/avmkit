"use client";

import SIWAConnect from "@/components/SIWAConnect";

export default function Home() {
  return (
    <main className="flex min-h-screen  ">
      {typeof window !== "undefined" ? <SIWAConnect /> : null}
    </main>
  );
}
