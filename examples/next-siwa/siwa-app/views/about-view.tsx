import { Link } from "react-router-dom";

export default function AboutView() {
  return (
    <>
      <section className="w-full py-6 md:py-12 lg:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                About SIWA
              </h1>
              <p className="max-w-[800px] text-secondary md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-secondary">
                SIWA (Sign In With Algorand) is a decentralized authentication
                protocol that allows users to sign in to websites and
                applications using their Algorand wallet. Built on the Algorand
                blockchain, SIWA ensures secure, transparent, and seamless
                authentication.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32 border-t">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:gap-10">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Easy Setup
              </h2>
              <p className="max-w-[600px] text-secondary md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-secondary">
                SIWA comes with a straightforward setup process. Start your
                project with a few commands and integrate SIWA easily into your
                existing applications, ensuring a secure and efficient sign-in
                experience for your users.
              </p>
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                EVM Compatibility
              </h2>
              <p className="max-w-[600px] text-secondary md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-secondary">
                SIWA is fully compatible with SIWE (Sign In With Ethereum),
                making it easy for developers to integrate Algorand-based
                authentication into their Ethereum applications. Leverage the
                power of Algorand's blockchain with minimal changes to your
                existing setup.
              </p>
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                NextJS Support
              </h2>
              <p className="max-w-[600px] text-secondary md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-secondary">
                SIWA supports NextJS, a popular React framework. Build fast,
                scalable web applications with seamless integration of SIWA,
                providing a secure and robust authentication method for your
                users.
              </p>
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Enterprise Security
              </h2>
              <p className="max-w-[600px] text-secondary md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-secondary">
                SIWA offers an enterprise-grade security model with on-chain
                protocols, ensuring user data is protected. Implement best
                practices in security and provide a safe authentication process
                for your users.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32 border-t">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 sm:px-10 md:gap-16 md:grid-cols-2">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-zinc-100 px-3 py-1 text-sm dark:bg-zinc-800">
                Features
              </div>
              <h2 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl/tight">
                Simplifying Authentication with SIWA
              </h2>
              <Link
                className="inline-flex h-9 items-center justify-center rounded-md border border-zinc-200  bg-white px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50   dark:bg-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 dark:focus-visible:ring-zinc-300"
                to="/contact"
              >
                Contact Sales
              </Link>
            </div>
            <div className="flex flex-col items-start space-y-4">
              <div className="inline-block rounded-lg bg-zinc-100 px-3 py-1 text-sm dark:bg-zinc-800">
                Security
              </div>
              <p className="mx-auto max-w-[700px] text-secondary md:text-xl/relaxed dark:text-secondary">
                SIWA leverages Algorand's secure and decentralized blockchain
                technology to provide a robust authentication protocol. Ensure
                your applications are protected with SIWA's enterprise-level
                security measures.
              </p>
              <Link
                className="inline-flex h-9 items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-50 shadow transition-colors hover:bg-zinc-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90 dark:focus-visible:ring-zinc-300"
                to="/contact"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
