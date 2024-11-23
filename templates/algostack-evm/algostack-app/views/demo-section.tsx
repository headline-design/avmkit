"use client"

import { Button } from "@/algostack-app/ui/button";
import SIWADetails from "./siwa-details";
import { IconSignOut } from "../icons";
import { useContext } from "react";
import { ModalContext } from "@/dashboard/contexts/modal-context";
import { signOut, useSession } from "next-auth/react";
import { IconXGovBadge } from "../assets/xgov-badge";
import { IconHeadlineTypelogo } from "../assets/headline-typelogo";
import { Escrow } from "@avmkit/pipeline";
import { useSelector } from "react-redux";
import algorandGlobalSelectors from "@/algostack-app/redux/algorand/global/globalSelectors";
import { useXWallet } from "@avmkit/xwallet";
import { useWalletConnection } from "../contexts/wallet-connection-context";

const DemoSection = () => {
  const { showLoginModal, setShowLoginModal } = useContext(ModalContext);
  const { data: session } = useSession();
  const { openXWalletModal, setXWalletState } = useXWallet();
  const { disconnectWallet } = useWalletConnection();

  const handleOpenModal = () => {
    setShowLoginModal(true);
  };

  const pipeState = useSelector(
    algorandGlobalSelectors.selectCurrentPipeConnectState,
  );

  const handleOpenXWalletModal = () => {
    if (!Escrow.secret) {
      setXWalletState({
        title: "Unlock account",
        header: true,
        state: "unlock",
        request: "open",
      });
      openXWalletModal();
    } else {
      setXWalletState({
        title: "Actions",
        header: false,
        state: "actions",
      });
      openXWalletModal();
    }
  };

  const handleDisconnect = () => {
    signOut().then(() => {
      disconnectWallet();
    });
  };

  return (
    <div>
      <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
        <>
          {session ? (
            <div className="w-full py-4 sm:px-0 px-4 flex flex-col items-center lg:items-end gap-2 text-center lg:text-left h-full lg:min-h-[384px]">
              <SIWADetails user={session?.user} signOut={signOut} />
            </div>
          ) : (
            <div className="w-full py-4 sm:px-0 px-4  flex flex-col items-center lg:items-start gap-2 text-center lg:text-left h-full lg:min-h-[384px]">
              <h1 className="text-foreground  text-5xl font-medium font-unbounded">
                SIWA
              </h1>
              <p className="text-muted-foreground  text-lg max-w-md">
                Sign-in with Algorand, an authentication standard for signing-in
                with an Algorand account.
              </p>
              <p className="text-foreground/80">By the Auth team at HEADLINE</p>
              <div className="flex items-center gap-4 mt-4">
                <a
                  href="https://siwa.org/help"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button variant="outline" size="lg">
                    Docs
                  </Button>
                </a>
                <a
                  href="https://github.com/headline-design/algostack-ssr"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button variant="outline" size="lg">
                    Github
                  </Button>
                </a>
                <a
                  href="https://siwa.org/contact"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button variant="outline" size="lg">
                    Contact
                  </Button>
                </a>
              </div>
              <div className="text-muted-foreground  mt-8 grid grid-cols-2 items-center gap-8 max-w-[320px] px-4">
                <a className="text-foreground">
                  <IconXGovBadge />
                </a>
                <a>
                  <IconHeadlineTypelogo className="w-full text-foreground" />
                </a>
              </div>
            </div>
          )}
        </>
        <div className="w-full py-4 sm:px-0 px-4 flex flex-col items-center lg:items-start gap-2 text-center lg:text-left h-full lg:min-h-[384px]">
          <div className="flex flex-col w-full sm:w-[350px] justify-center">
            <div className="w-full">
              <div className="border p-4 rounded-xl w-full min-h-[384px] sm:h-96 flex flex-col flex-1">
                <div className="grid gap-2">
                  <div className="flex flex-col">
                    <p className="text-foreground text-lg">Try it out</p>
                    <p className="text-muted-foreground mb-4">
                      Connect your wallet to try out this cloneable demo app.
                    </p>
                    <Button
                      onClick={handleOpenModal}
                      className="w-full flex items-center justify-center"
                      disabled={session ? true : false}
                    >
                      Connect Wallet
                    </Button>
                  </div>

                  {session && pipeState.provider === "escrow" ? (
                    <Button
                      variant="outline"
                      onClick={handleOpenXWalletModal}
                      className="flex items-center justify-center"
                    >
                      Open XWallet
                    </Button>
                  ) : null}
                  {session ? (
                    <Button
                      variant="outline"
                      onClick={handleDisconnect}
                      className="flex items-center justify-center"
                    >
                      <IconSignOut className="mr-2" /> Logout
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="mt-4 px-4 flex justify-center lg:justify-end w-full max-w-4xl">
              made by headline.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoSection;
