import { IconClient, IconServer } from "@/siwa-app/icons";
import {
  IconFingerprint,
  IconSharpieCircle,
  IconShield,
  IconSquares,
} from "./feature-icons";
import IconSelectRange from "./feature-icons/select-range";
import { IconFolderLock } from "./feature-icons/folder-lock";

export const FeatureSection1 = () => (
  <section>
    <div className="py-16">
      <div className="mx-auto px-6 max-w-6xl text-zinc-500">
        <div className="relative">
          <div className="relative z-10 grid gap-3 grid-cols-6">
            <div className="col-span-full lg:col-span-2 overflow-hidden flex relative p-8  border   ">
              <div className="size-fit m-auto relative">
                <div className="relative h-24 w-56 flex items-center">
                  <IconSharpieCircle />
                  <span className="w-fit block mx-auto text-5xl font-semibold text-transparent bg-clip-text bg-gradient-to-br from-teal-300 to-teal-600">
                    100%
                  </span>
                </div>
                <h2 className="mt-6 text-center font-semibold text-zinc-950 dark:text-white text-3xl">
                  Customizable
                </h2>
              </div>
            </div>
            <div className="col-span-full sm:col-span-3 lg:col-span-2 overflow-hidden relative p-8   border   ">
              <div>
                <div className="relative aspect-square rounded-full size-32 flex border mx-auto dark:bg-white/5 dark:border-white/10 before:absolute before:-inset-2 before:border dark:before:border-white/5 dark:before:bg-white/5 before:rounded-full">
                  <IconFingerprint />
                </div>
                <div className="mt-6 text-center relative z-10 space-y-2">
                  <h2 className="text-lg font-medium text-zinc-800 transition group-hover:text-purple-950 dark:text-white">
                    Secure by default
                  </h2>
                  <p className="dark:text-zinc-300 text-zinc-700">
                    Provident fugit and vero voluptate. magnam magni doloribus
                    dolores voluptates a sapiente nisi.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-span-full sm:col-span-3 lg:col-span-2 overflow-hidden relative p-8   border   ">
              <div>
                <div className="pt-6 lg:px-6">
                  <IconSelectRange />
                </div>
                <div className="mt-14 text-center relative z-10 space-y-2">
                  <h2 className="text-lg font-medium text-zinc-800 transition group-hover:text-purple-950 dark:text-white">
                    Faster than light
                  </h2>
                  <p className="dark:text-zinc-300 text-zinc-700">
                    Provident fugit vero voluptate. magnam magni doloribus
                    dolores voluptates inventore nisi.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-span-full lg:col-span-3 overflow-hidden relative p-8   border   ">
              <div className="grid sm:grid-cols-2">
                <div className="flex flex-col justify-between relative z-10 space-y-12 lg:space-y-6">
                  <div className="relative aspect-square rounded-full size-12 flex border dark:bg-white/5 dark:border-white/10 before:absolute before:-inset-2 before:border dark:before:border-white/5 dark:before:bg-white/5 before:rounded-full">
                    <svg
                      className="size-6 m-auto"
                      xmlns="http://www.w3.org/2000/svg"
                      width="1em"
                      height="1em"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="none"
                        stroke="currentColor"
                        strokeLinejoin="round"
                        d="M5.5 7c2 0 6.5-3 6.5-3s4.5 3 6.5 3v4.5C18.5 18 12 20 12 20s-6.5-2-6.5-8.5z"
                      />
                    </svg>
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-lg font-medium text-zinc-800 transition group-hover:text-purple-950 dark:text-white">
                      Faster than light
                    </h2>
                    <p className="dark:text-zinc-300 text-zinc-700">
                      Provident fugit vero voluptate. Voluptates a sapiente
                      inventore nisi.
                    </p>
                  </div>
                </div>
                <div className="overflow-hidden relative mt-6 sm:mt-auto h-fit -mb-[34px] -mr-[34px] sm:ml-6 py-6 p-6 border rounded-tl-lg  dark:border-white/10">
                  <div className="absolute flex gap-1 top-2 left-3">
                    <span className="block size-2 rounded-full border dark:border-white/10 dark:bg-white/10" />
                    <span className="block size-2 rounded-full border dark:border-white/10 dark:bg-white/10" />
                    <span className="block size-2 rounded-full border dark:border-white/10 dark:bg-white/10" />
                  </div>
                  <div className="flex flex-auto justify-center align-middle text-teal-400 ">
                  <IconFolderLock />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-full lg:col-span-3 overflow-hidden relative p-8   border   ">
              <div className="h-full grid sm:grid-cols-2">
                <div className="flex flex-col justify-between relative z-10 space-y-12 lg:space-y-6">
                  <div className="relative aspect-square rounded-full size-12 flex border dark:bg-white/5 dark:border-white/10 before:absolute before:-inset-2 before:border dark:before:border-white/5 dark:before:bg-white/5 before:rounded-full">
                    <svg
                      className="size-6 m-auto"
                      xmlns="http://www.w3.org/2000/svg"
                      width="1em"
                      height="1em"
                      viewBox="0 0 24 24"
                    >
                      <g fill="none">
                        <path
                          stroke="currentColor"
                          d="M9 6a3 3 0 1 0 6 0a3 3 0 0 0-6 0zm-4.562 7.902a3 3 0 1 0 3 5.195a3 3 0 0 0-3-5.196zm15.124 0a2.999 2.999 0 1 1-2.998 5.194a2.999 2.999 0 0 1 2.998-5.194z"
                        />
                        <path
                          fill="currentColor"
                          fillRule="evenodd"
                          d="M9.003 6.125a2.993 2.993 0 0 1 .175-1.143a8.507 8.507 0 0 0-5.031 4.766a8.5 8.5 0 0 0-.502 4.817a3 3 0 0 1 .902-.723a7.498 7.498 0 0 1 4.456-7.717m5.994 0a7.499 7.499 0 0 1 4.456 7.717a2.998 2.998 0 0 1 .902.723a8.5 8.5 0 0 0-5.533-9.583a3 3 0 0 1 .175 1.143m2.536 13.328a3.002 3.002 0 0 1-1.078-.42a7.501 7.501 0 0 1-8.91 0l-.107.065a3 3 0 0 1-.971.355a8.5 8.5 0 0 0 11.066 0"
                          clipRule="evenodd"
                        />
                      </g>
                    </svg>
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-lg font-medium text-zinc-800 transition group-hover:text-purple-950 dark:text-white">
                      Keep your loved ones safe
                    </h2>
                    <p className="dark:text-zinc-300 text-zinc-700">
                      Voluptate. magnam magni doloribus dolores voluptates a
                      sapiente inventore nisi.
                    </p>
                  </div>
                </div>
                <div className="mt-6 relative sm:-mr-[--card-padding] sm:-my-8 before:absolute before:w-px before:inset-0 before:mx-auto before:bg-border ">
                  <div className="relative space-y-6 py-6 flex flex-col justify-center h-full">
                    <div className="flex items-center justify-end gap-2 w-[calc(50%+0.875rem)] relative">
                      <span className="h-fit text-xs block px-2 py-1 shadow-sm border rounded-md dark:bg-zinc-800 dark:border-white/5 dark:text-white">
                        Server
                      </span>
                      <div className="size-7 ring-4 ring-white dark:ring-[--card-dark-bg]">
                        <div className="rounded-full  border size-full dark:bg-zinc-800 flex bg-background justify-center align-middle items-center">
                          <IconServer className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-[calc(50%-1rem)] relative">
                      <div className="size-8 ring-4 ring-white dark:ring-[--card-dark-bg]">
                        <div className="rounded-full  border border-teal-600 size-full dark:bg-zinc-800 flex bg-background justify-center align-middle items-center">
                          <IconShield />
                        </div>
                      </div>
                      <span className="h-fit text-xs block px-2 py-1 shadow-sm border rounded-md dark:bg-zinc-800 dark:border-white/5 dark:text-white">
                        SIWA
                      </span>
                    </div>
                    <div className="flex items-center justify-end gap-2 w-[calc(50%+0.875rem)] relative">
                      <span className="h-fit text-xs block px-2 py-1 shadow-sm border rounded-md dark:bg-zinc-800 dark:border-white/5 dark:text-white">
                        Client
                      </span>
                      <div className="size-7 ring-4 ring-white dark:ring-[--card-dark-bg]">
                        <div className="rounded-full  border size-full dark:bg-zinc-800 flex bg-background justify-center align-middle items-center">
                          <IconClient className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
