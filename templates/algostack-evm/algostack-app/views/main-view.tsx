/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ButtonLink } from "@/dashboard/ui/button-link";
import DemoHome from "./demo-section";

import { IconGithub } from "@/dashboard/icons"; // Assume these icons are available

const MainView = () => {
  return (
    <>
      <main className="flex-1">
        <section className="w-full pt-12 pb-12 md:pt-24 lg:pt-32 border-b">
          <div className="px-4 md:px-6 space-y-10 xl:space-y-16">
            <div className="grid max-w-[1300px] mx-auto gap-4 px-4 sm:px-6 md:px-10 md:grid-cols-2 md:gap-16">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm ">
                  AVM + EVM Ecosystems
                </div>
                <h1 className="text-3xl font-bold  md:text-6xl md:block text-3xl font-bold  sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
                  The Fullstack <br></br>SSR Template for Algorand and Ethereum
                </h1>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed ">
                  A fully-loaded Web3 template that scales with Next.js. The
                  best of Algorand and Next.js, combined into a seamless
                  experience.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <ButtonLink size="lg" href="/getting-started">
                    Get Started{" "}
                  </ButtonLink>
                  <ButtonLink
                    target="_blank"
                    size="lg"
                    variant="outline"
                    href="https://github.com/headline-design/algostack-evm"
                  >
                    <IconGithub /> Github
                  </ButtonLink>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <img
                  alt="Image"
                  className="dark:hidden aspect-video overflow-hidden rounded-xl object-contain object-center border"
                  height="310"
                  src="/algorand_full_logo_black.svg"
                  width="550"
                />
                <img
                  alt="Image"
                  className="hidden dark:block aspect-video overflow-hidden rounded-xl object-contain object-center border"
                  height="310"
                  src="/algorand_full_logo_white.svg"
                  width="550"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container grid items-center gap-6 px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm ">
                  New Features
                </div>
                <h2 className="text-3xl font-bold  sm:text-5xl">
                  Faster iteration. More innovation.
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed ">
                  The platform for rapid progress. Let your team focus on
                  shipping features instead of managing infrastructure with
                  automated CI/CD, built-in testing, and integrated
                  collaboration.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <img
                alt="Image"
                className="hidden dark:block mx-auto aspect-video overflow-hidden rounded-xl object-fit object-center border"
                height="310"
                src="/algorand_logo_mark_white.svg"
                width="550"
              />
              <img
                alt="Image"
                className="block dark:hidden mx-auto aspect-video overflow-hidden rounded-xl object-fit object-center border"
                height="310"
                src="/algorand_logo_mark_black.svg"
                width="550"
              />
              <div className="flex flex-col justify-center space-y-4">
                <ul className="grid gap-6">
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">Collaboration</h3>
                      <p className="text-muted-foreground ">
                        Make collaboration seamless with built-in code review
                        tools.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">Automation</h3>
                      <p className="text-muted-foreground ">
                        Automate your workflow with continuous integration.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">Scale</h3>
                      <p className="text-muted-foreground ">
                        Deploy to the cloud with a single click and scale with
                        ease.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 border-t border-b">
          <div className="container grid items-center gap-6 px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm ">
                  Session Auth on Algorand with SIWA
                </div>
                <h2 className="text-3xl font-bold  sm:text-5xl">
                  Secure from end-to-end
                </h2>
              </div>
            </div>
            <DemoHome />
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:px-10 md:gap-16 lg:grid-cols-2">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm ">
                  Performance
                </div>
                <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
                  Traffic spikes should be exciting, not scary.
                </h2>
                <ButtonLink size="lg" href="/getting-started">
                  Get Started
                </ButtonLink>
              </div>
              <div className="flex flex-col items-start space-y-4">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm ">
                  Security
                </div>
                <p className="mx-auto max-w-[700px]  md:text-xl/relaxed text-muted-foreground">
                  Fully managed infrastructure designed to scale dynamically
                  with your traffic, a global edge to ensure your site is fast
                  for every customer, and the tools to monitor every aspect of
                  your app.
                </p>
                <ButtonLink size="lg" variant="outline" href="/contact">
                  Contact Sales
                </ButtonLink>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground ">
          © 2024 HEADLINE. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-xs hover:underline underline-offset-4"
            href="/terms"
          >
            Terms of Service
          </Link>
          <Link
            className="text-xs hover:underline underline-offset-4"
            href="/privacy"
          >
            Privacy
          </Link>
        </nav>
      </footer>
    </>
  );
};

export default MainView;
