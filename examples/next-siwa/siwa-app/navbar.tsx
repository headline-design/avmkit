"use client";

import { Link } from "react-router-dom";
import useScroll from "@/dashboard/lib/hooks/use-scroll";
import { cn } from "@/dashboard/lib/utils";
import MaxWidthWrapper from "@/dashboard/ui/layout/max-width-wrapper";
import { HOME_DOMAIN } from "@/dashboard/lib/constants";
import { IconShield } from "./icons";
import { useContext } from "react";
import ButtonLink from "./ui/button-link";
import { useSession } from "next-auth/react";
import { Button } from "./ui";
import { ModalContext } from "./providers/modal-provider";
import { Avatar } from "./components/avatar/avatar";

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

  console.log('session', session)

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
              <Link to="/" className="flex items-center space-x-2 text">
                <IconShield />
                <span className="sr-only">SIWA</span>
                <span className="font-bold sm:inline-block">SIWA</span>
              </Link>
              <div className="hidden items-center lg:flex">
                {navItems.map(({ name, slug }) => (
                  <Link
                    id={`nav-${slug}`}
                    key={slug}
                    to={`/${slug}`}
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
                <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-gray-500 hover:bg-gray-100 hover:text-gray-900 h-8 w-8 shrink-0 rounded-full border">
                  <Avatar
                    className="shrink-0 select-none rounded-full"
                    label={session?.user?.name || "0xcc787asdlkasjdlkwqe-098"}
                    address={session?.user?.name || "0xcc787asdlkasjdlkwqe-098"}
                    size="32px"
                    src={session?.user?.name || "0xcc787asdlkasjdlkwqe-098"}
                    shape="circle"
                  />
                </button>
              ) : status !== "authenticated" ? (
                <>
                  {(() => {
                    if (location === "login") {
                      return (
                        <>
                          <ButtonLink
                            skinny
                            variant="link"
                            href={`${HOME_DOMAIN}/contact`}
                          >
                            Contact
                          </ButtonLink>

                          <ButtonLink
                            skinny
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
                          <ButtonLink skinny variant="link" href={`/contact`}>
                            Contact
                          </ButtonLink>

                          <ButtonLink
                            skinny
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
                            <ButtonLink skinny variant="link" href={`/contact`}>
                              Contact
                            </ButtonLink>
                            <Button
                              skinny
                              variant="outline"
                              onClick={handleOpenModal}
                            >
                              Connect
                            </Button>
                          </div>
                          <ButtonLink
                            skinny
                            className="ml-2"
                            variant="primary"
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
