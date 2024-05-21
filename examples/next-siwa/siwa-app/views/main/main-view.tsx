/* eslint-disable @next/next/no-img-element */
import { Link } from "react-router-dom";
import { Button } from "@/siwa-app/components/ui/button";
import { Input } from "@/siwa-app/components/ui/input";
import { ButtonLink } from "@/siwa-app/components/ui/button-link";

import {
  IconGithub,
  IconWallet,
  IconCheck,
  IconMail,
  IconSignOut,
  IconShield,
} from "../../icons"; // Assume these icons are available
import { useContext } from "react";
import { ModalContext } from "../../providers/modal-provider";
import { useUser } from "../../contexts/user-context";
import { signOut, useSession } from "next-auth/react";
import { wallet } from "../../../x-wallet/constants";
import SIWADetails from "./siwa-details";
import { DemoGithub } from "../../components/cards/github-card";
import { FeatureSection1 } from "./feature-section-1";
import { FeatureSection2 } from "./feature-section-2";
import { CodeSection } from "./code-section";

export default function MainView2() {
  const { showLoginModal, setShowLoginModal } = useContext(ModalContext);
  const { user } = useUser();
  const { data: session } = useSession();

  console.log("user", user);
  console.log("session", session);

  const handleOpenModal = () => {
    setShowLoginModal(true);
  };

  const handleCloseModal = () => {
    setShowLoginModal(false);
  };

  return (
    <>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full pt-12 pb-12 md:pt-24 lg:pt-32 border-b">
          <div className="px-4 md:px-6 space-y-10 xl:space-y-16">
            <div className="grid max-w-[1300px] mx-auto gap-8 px-4 sm:px-6 md:px-10 md:grid-cols-2 md:gap-16">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-lime px-3 py-1 text-sm text-lime-foreground">
                  Auth Framework
                </div>
                <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]">
                  Sign In With Algorand
                </h1>
                <p className="max-w-[700px] text-muted-foreground md:text-xl lg:text-base xl:text-xl">
                  An AVM auth standard that integrates with Algorand to provide
                  a seamless sign-in experience for your users.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <ButtonLink size="lg" to="/getting-started">
                    Get Started
                  </ButtonLink>
                  <ButtonLink
                    target="_blank"
                    size="lg"
                    variant="outline"
                    to="https://github.com/headline-design/react-fuse"
                  >
                    <IconGithub /> Github
                  </ButtonLink>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <img
                  alt="Sign In With Algorand"
                  className="aspect-video overflow-hidden object-cover object-center primary-hero-bg"
                  height="310"
                  src="/fuse.svg"
                  width="550"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Feature Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 border-b">
          <div className="container grid items-center gap-6 px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-lime text-lime-foreground px-3 py-1 text-sm">
                  New Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Secure and Seamless Authentication
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl lg:text-base xl:text-xl">
                  Integrate with Algorand to provide secure and seamless
                  authentication for your users.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <img
                alt="Secure Authentication"
                className="mx-auto aspect-video overflow-hidden object-cover object-center secondary-hero-bg"
                height="310"
                src="/search-data.svg"
                width="550"
              />
              <div aria-label="Progress">
                <ol role="list" className="overflow-hidden">
                  <li className="relative pb-10">
                    <div
                      className="absolute left-4 top-4 h-full w-0.5 bg-lime"
                      aria-hidden="true"
                    ></div>
                    <div className="group flex items-start">
                      <span className="flex items-center h-9">
                        <span className="relative z-10 flex items-center justify-center w-8 h-8 bg-lime rounded-full group-hover:bg-lime">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-5 h-5 text-black"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                      </span>
                      <span className="ml-4 flex min-w-0 flex-col">
                        <span className="text-sm font-medium text-zinc-950 dark:text-white">
                          Step 1: Connect Wallet
                        </span>
                        <span className="text-sm dark:text-zinc-300 text-zinc-700">
                          Connect your Algorand wallet to start the
                          authentication process.
                        </span>
                      </span>
                    </div>
                  </li>

                  <li className="relative pb-10">
                    <div
                      className="absolute left-4 top-4 h-full w-0.5 bg-gray-300"
                      aria-hidden="true"
                    ></div>
                    <div className="group flex items-start">
                      <span className="flex items-center h-9">
                        <span className="relative z-10 flex items-center justify-center w-8 h-8 bg-background border-2 border-lime rounded-full group-hover:border-lime-hover">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-5 h-5 text-lime group-hover:text-lime-hover"
                          >
                            <circle cx="10" cy="10" r="3" />
                          </svg>
                        </span>
                      </span>
                      <span className="ml-4 flex min-w-0 flex-col">
                        <span className="text-sm font-medium text-muted-foreground group-hover:text-lime-hover">
                          Step 2: Sign Message
                        </span>
                        <span className="text-sm dark:text-zinc-300 text-zinc-700">
                          Sign a message with your wallet to prove ownership.
                        </span>
                      </span>
                    </div>
                  </li>

                  <li className="relative">
                    <div className="group flex items-start">
                      <span className="flex items-center h-9">
                        <span className="relative z-10 flex items-center justify-center w-8 h-8 bg-background border-2 border-gray-300 rounded-full group-hover:border-gray-400"></span>
                      </span>
                      <span className="ml-4 flex min-w-0 flex-col">
                        <span className="text-sm font-medium text-muted-foreground">
                          Step 3: Verify Signature
                        </span>
                        <span className="text-sm dark:text-zinc-300 text-zinc-700">
                          Our server verifies the signature to complete the
                          login.
                        </span>
                      </span>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </section>
        <FeatureSection1 />
        <FeatureSection2 />
        {/* Feature Section 2 */}
        <CodeSection />
        {/* Workflow Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 border-t border-b">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Experience a Seamless Workflow
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl lg:text-base xl:text-xl">
                Integrate with Algorand to provide a secure and seamless
                authentication experience for your users.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
              <form className="flex space-x-2">
                <Input
                  className="max-w-lg flex-1"
                  placeholder="Enter your email"
                  type="email"
                />
                <Button type="submit">Sign Up</Button>
              </form>
              <p className="text-xs text-muted-foreground">
                Sign up to get notified when we launch.
                <Link className="underline underline-offset-2" to="/terms">
                  Terms & Conditions
                </Link>
              </p>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 border-b">
          <div className="grid max-w-[1300px] mx-auto gap-4 px-4 sm:px-6 md:px-10 md:grid-cols-2 md:gap-16 ">
            <div className="flex items-center justify-center py-12">
              <div className="mx-auto grid w-[350px] gap-6">
                <div className="grid gap-2 text-center">
                  <h1 className="text-3xl font-bold">Try SIWA</h1>
                  <p className="text-balance text-muted-foreground">
                    Connect your Algorand wallet to start the authentication
                    process.
                  </p>
                </div>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Button
                      size="lg"
                      onClick={handleOpenModal}
                      className="w-full flex items-center justify-center"
                    >
                      Connect Wallet
                    </Button>

                    {user || session ? (
                      <Button
                        size="lg"
                        variant="outline"
                        onClick={() => signOut()}
                        className="flex items-center justify-center"
                      >
                        <IconSignOut className="mr-2" /> Logout
                      </Button>
                    ) : null}
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <span className="text-xs">
                        SIWA currently supports Kibisis and X Wallet with more
                        wallet support coming soon
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center py-12 lg:border-l">
              <div className="text-muted-foreground text-center h-full w-full flex align-middle justify-center ">
                {user || session ? (
                  <>
                    <SIWADetails
                      user={session?.user || user}
                      signOut={signOut}
                    />
                  </>
                ) : (
                  <div className="flex flex-col justify-center items-center">
                    <IconShield className="w-20 h-20" />
                    <span> Connect your wallet to see your SIWA details. </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
        {/* Performance Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:px-10 md:gap-16 lg:grid-cols-2">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-lime text-lime-foreground px-3 py-1 text-sm">
                  Performance
                </div>
                <h2 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
                  Robust and Scalable Infrastructure
                </h2>
                <ButtonLink size="lg" to="/getting-started">
                  Get Started
                </ButtonLink>
              </div>
              <div className="flex flex-col items-start space-y-4">
                <div className="inline-block rounded-lg bg-lime text-lime-foreground px-3 py-1 text-sm">
                  Security
                </div>
                <p className="mx-auto max-w-[700px] md:text-xl text-muted-foreground">
                  Fully managed infrastructure designed to scale dynamically
                  with your traffic, a global edge to ensure your site is fast
                  for every customer, and the tools to monitor every aspect of
                  your app.
                </p>
                <ButtonLink size="lg" variant="outline" to="/contact">
                  Contact Sales
                </ButtonLink>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          © 2024 HEADLINE. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-xs hover:underline underline-offset-4"
            to="/terms"
          >
            Terms of Service
          </Link>
          <Link
            className="text-xs hover:underline underline-offset-4"
            to="/privacy"
          >
            Privacy
          </Link>
        </nav>
      </footer>
    </>
  );
}
