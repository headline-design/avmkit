"use client";

import Link from "next/link";
import useScroll from "@/dashboard/lib/hooks/use-scroll";
import { cn } from "@/dashboard/lib/utils";
import MaxWidthWrapper from "@/dashboard/ui/layout/max-width-wrapper";
import { HOME_DOMAIN } from "@/dashboard/lib/constants";
import { useContext } from "react";
import { useSession } from "next-auth/react";
import { Button } from "../ui";
import { ModalContext } from "../contexts/modal-context";
import { Avatar } from "../components/avatar/avatar";
import UserDropdownMenu from "../components/user-dropdown-menu/user-dropdown-menu";
import { ButtonLink } from "../ui/button-link";
import IconSIWALogo from "../assets/siwa-logo";

export const navItems = [
  {
    name: "Pricing",
    slug: "pricing",
  },
  {
    name: "Contact",
    slug: "contact",
  },
  {
    name: "Changelog",
    slug: "changelog",
  },
  {
    name: "Blog",
    slug: "blog",
  },
  {
    name: "Help",
    slug: "help",
  },
];

export default function Navbar({ location = "home" }) {
  const scrolled = useScroll(80);
  const { data: session } = useSession();

  const { showLoginModal, setShowLoginModal } = useContext(ModalContext);

  const handleOpenModal = () => {
    setShowLoginModal(true);
  };

  console.log("session", session);

  return (
    <>
      <div
        className={cn(`rust-nav-pre`, {
          "rust-nav-main": location === "home",
          "rust-nav-variant": location === "login" || location === "register",
          "rust-nav": scrolled,
        })}
      >
        <MaxWidthWrapper className="rust-nav-l1 flex w-full items-center justify-between">
          <div className="rust-nav-l2 flex h-14 w-full items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2 text">
                <IconSIWALogo />
                <span className="sr-only">SIWA</span>
                <span className="font-bold sm:inline-block">SIWA</span>
              </Link>
              <div className="hidden items-center lg:flex">
                {navItems.map(({ name, slug }) => (
                  <Link
                    id={`nav-${slug}`}
                    key={slug}
                    href={`/${slug}`}
                    className={cn(
                      "rust-navlink z-10 transition-colors ease-out hover:text-foreground",
                    )}
                  >
                    {name}
                  </Link>
                ))}
              </div>
            </div>{" "}
            <div className="hidden lg:flex">
              {session?.user?.name ? (
                <div className="ml-auto flex items-center justify-center gap-2 sm:gap-4">
                  <ButtonLink
                    size="sm"
                    className="text-xs"
                    variant="outline"
                    href={`/contact`}
                  >
                    Contact Us
                  </ButtonLink>{" "}
                  <UserDropdownMenu session={session} />
                </div>
              ) : status !== "authenticated" ? (
                <>
                  {(() => {
                    if (location === "login") {
                      return (
                        <>
                          <ButtonLink
                            size="sm"
                            variant="link"
                            href={`${HOME_DOMAIN}/contact`}
                          >
                            Contact
                          </ButtonLink>

                          <ButtonLink
                            size="sm"
                            className="ml-2"
                            variant="outline"
                            href={`/register`}
                          >
                            Sign up
                          </ButtonLink>
                        </>
                      );
                    } else if (location === "register") {
                      return (
                        <>
                          <ButtonLink
                            size="sm"
                            variant="link"
                            href={`/contact`}
                          >
                            Contact
                          </ButtonLink>

                          <ButtonLink
                            size="sm"
                            className="ml-2"
                            variant="outline"
                            href={`/login`}
                          >
                            Log In
                          </ButtonLink>
                        </>
                      );
                    } else if (location === "home") {
                      return (
                        <>
                          <div className="flex items-center gap-2">
                            <ButtonLink
                              size="sm"
                              variant="link"
                              href={`/contact`}
                            >
                              Contact
                            </ButtonLink>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleOpenModal}
                            >
                              Connect
                            </Button>
                          </div>
                          <ButtonLink
                            size="sm"
                            className="ml-2"
                            variant="default"
                            href={`/contact`}
                          >
                            Contact Us
                          </ButtonLink>
                        </>
                      );
                    } else {
                      return null;
                    }
                  })()}
                </>
              ) : null}
            </div>
            {/*mobile menu trigger*/}
          </div>
        </MaxWidthWrapper>
      </div>
    </>
  );
}
