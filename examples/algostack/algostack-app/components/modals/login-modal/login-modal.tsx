import { signIn, useSession } from "next-auth/react";
import { useState, useEffect, useCallback, useMemo } from "react";
import { IconArrowLeft, IconKibisis, IconLogout } from "@/dashboard/icons";
//import { useXWallet } from "@/wallet/xwallet-context";
import { Pipeline, Escrow } from "@avmkit/pipeline";
import { toast } from "@/dashboard/ui/toast";
import { ICON_CLASS, WEB3_PROVIDERS, ALL_PROVIDERS } from "./constants";
import { cn, shorten } from "@/dashboard/lib/utils";
import { useSelector } from "react-redux";
import algorandGlobalSelectors from "@/dashboard/redux/algorand/global/globalSelctors";
import { Button, Dialog } from "@/dashboard/ui";
import { useSIWA } from "@/use-siwa";
import { PipeConnectors } from "@/algostack-app/utils/constants/common";
import { useWalletConnection } from "@/algostack-app/contexts/wallet-connection-context";
import { IconSIWAStrokeLogo } from "@/algostack-app/assets/siwa-stroke-logo";
import { IconInfoCircle } from "@/algostack-app/icons/info-circle";
import { IconErrorCircle } from "@/algostack-app/icons/error-circle";
import { useXWallet } from "@avmkit/xwallet";

export interface Provider {
  id: string;
  name: string;
  icon: JSX.Element;
  type: string;
  connector: string;
}

const getScreenLeftButton = (
  screen,
  handleResetScreen,
  handleBackOneScreen,
) => {
  const onClickHandlers = {
    wallets: handleResetScreen,
    siwaConnect: handleBackOneScreen,
    provider: handleBackOneScreen,
  };

  const onClick = onClickHandlers[screen];
  if (!onClick) return null;

  return (
    <Button variant="outline" size="md" onClick={onClick} className="ml-4">
      <IconArrowLeft className="mr-2" /> Previous
    </Button>
  );
};

const WalletsScreen = ({ handleWalletConnect, loading }) => (
  <div className="space-y-3">
    {WEB3_PROVIDERS.map((wallet) => (
      <Button
        className="w-full rounded-full border"
        variant="outline"
        size="default"
        key={wallet.id}
        onClick={() => handleWalletConnect(wallet)}
      >
        {" "}
        {wallet.icon} {wallet.name}
      </Button>
    ))}
  </div>
);

const LoadingScreen = ({ provider, setCurrentScreen }) => {
  const pipeState = useSelector(
    algorandGlobalSelectors.selectCurrentPipeConnectState,
  );

  useEffect(() => {
    if (pipeState.provider === PipeConnectors[provider.connector]) {
      setCurrentScreen("siwaConnect");
    }
  }, [pipeState.provider, provider.connector, setCurrentScreen]);

  return (
    <div className="pointer-events-auto inset-0 flex items-center justify-center ">
      <div className=" p-6 rounded-lg border text-center max-w-md w-full">
        <div className="flex flex-col items-center space-y-4">
          <div className="text-4xl">{provider.icon}</div>
          <h1 className="text-xl font-bold">Requesting Connection</h1>
          <p className="text-muted-foreground">
            {provider.type === "web3"
              ? `Open the ${provider.name} browser extension to connect your wallet.`
              : `Redirecting to ${provider.name} for authentication.`}
          </p>
        </div>
      </div>
    </div>
  );
};

const ErrorScreen = ({
  handleDisconnect,
}: {
  handleDisconnect: () => void;
}) => (
  <div className="pointer-events-auto">
    <div className="relative z-10 opacity-100">BIG ERROR PROBLEM</div>
  </div>
);

const ProviderScreen = ({
  provider,
  handleWalletConnect,
  handleDisconnect,
}) => {
  const pipeState = useSelector(
    algorandGlobalSelectors.selectCurrentPipeConnectState,
  );
  const isCurrentProvider =
    PipeConnectors[provider.connector] === pipeState.provider;

  const handleAttemptReconnect = () => {
    if (provider) {
      handleWalletConnect(provider);
    }
  };

  return (
    <>
      <div className="text-center">
        {isCurrentProvider ? (
          <>
            <h2 className="text-lg font-bold">Connected to {provider.name}</h2>
            <div className="text-sm">
              You are currently connected to the right wallet.
            </div>
          </>
        ) : (
          <>
            <div className="min-h-12 border  rounded-md w-full text-sm text-muted-foreground px-3 py-[11px] mb-5">
              <div className="flex items-center gap-4">
                <div style={{ display: "flex", height: "16px" }}>
                  <IconErrorCircle className="h-4 w-4" />
                </div>
                <div className="inline-block flex-wrap whitespace-break-spaces">
                  You are trying to connect to{" "}
                  <b className="inline-block">{provider.name}</b> but another
                  wallet is currently active. Please disconnect from the current
                  wallet to proceed.
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex w-full flex-col items-center justify-center gap-3 space-y-3">
                <Button
                  onClick={handleAttemptReconnect}
                  className="w-full rounded-full"
                  variant="default"
                  size="default"
                >
                  Try Connecting Again
                </Button>
              </div>
              <Button
                className="w-full rounded-full"
                variant="outline"
                size="default"
                onClick={handleDisconnect}
              >
                <IconLogout className="h-4 w-4 mr-2" /> Disconnect{" "}
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

const SIWAConnectScreen = ({ handleDisconnect, handleSIWAConnect }) => {
  const pipeState = useSelector(
    algorandGlobalSelectors.selectCurrentPipeConnectState,
  );

  return (
    <>
      <div className="min-h-12 border  rounded-md w-full text-sm text-muted-foreground px-3 py-[11px] mb-5">
        <div className="flex items-center gap-4">
          <div style={{ display: "flex", height: "16px" }}>
            <IconInfoCircle className="h-4 w-4" />
          </div>
          <div className="inline-block flex-wrap whitespace-break-spaces">
            Your {pipeState.provider} wallet{" "}
            <pre className="text-foreground inline-block">
              {shorten(pipeState.myAddress)}
            </pre>{" "}
            is connected. You can now sign in with SIWA.
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex w-full flex-col items-center justify-center gap-3 space-y-3">
          <Button
            variant="default"
            onClick={handleSIWAConnect}
            className="w-full rounded-full"
            size="default"
          >
            <IconSIWAStrokeLogo className="h-4 w-4 mr-2" />
            Sign in with SIWA
          </Button>
        </div>
        <Button
          className="w-full rounded-full"
          variant="outline"
          size="default"
          onClick={handleDisconnect}
        >
          <IconLogout className="h-4 w-4 mr-2" /> Disconnect{" "}
        </Button>
      </div>
    </>
  );
};

export const LoginModalHelper = ({ showLoginModal, setShowLoginModal }) => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [activeProvider, setActiveProvider] = useState(null);
  const [currentScreen, setCurrentScreen] = useState("default");
  const [dialogStack, setDialogStack] = useState(false);

  const { openXWalletModal, setXWalletState, isXWalletModalOpen } =
    useXWallet();
  const { signIn: signInWithSIWA } = useSIWA();
  const {
    status: walletStatus,
    connectWallet,
    disconnectWallet,
  } = useWalletConnection();

  const pipeState = useSelector(
    algorandGlobalSelectors.selectCurrentPipeConnectState,
  );

  const provider = useMemo(() => {
    return (
      ALL_PROVIDERS.find((p) => p.connector === activeProvider) || {
        id: "kibesis",
        name: "Kibesis",
        icon: <IconKibisis className={ICON_CLASS} />,
        type: "loading",
        connector: "loading",
      }
    );
  }, [activeProvider]);

  useEffect(() => {
    if (status === "authenticated") {
      setShowLoginModal(false);
    } else if (status === "unauthenticated") {
      setActiveProvider(null);
      setLoading(false);
    }
  }, [status, setShowLoginModal]);

  useEffect(() => {
    if (
      WEB3_PROVIDERS.some((provider) => provider.connector === activeProvider)
    ) {
      if (
        Pipeline.address &&
        !session?.user &&
        provider &&
        PipeConnectors[provider.connector] === pipeState.provider
      ) {
        setCurrentScreen("siwaConnect");
      } else if (
        Pipeline.address &&
        !session?.user &&
        provider &&
        pipeState.provider !== "" &&
        PipeConnectors[provider.connector] !== pipeState.provider
      ) {
        setCurrentScreen("provider");
      }
      if (walletStatus === "connecting") {
        setCurrentScreen("loading");
      }
    } else if (walletStatus === "error") {
      setCurrentScreen("error");
    }
  }, [
    walletStatus,
    activeProvider,
    provider.connector,
    pipeState,
    provider,
    session?.user,
  ]);
  const handleSwitchWallet = useCallback(
    async (wallet) => {
      await connectWallet(wallet.id);
    },
    [connectWallet],
  );

  const handleWalletConnect = async (wallet) => {
    const newActiveProvider = wallet.connector;
    setActiveProvider(newActiveProvider);

    if (
      pipeState.provider !== "" &&
      pipeState.provider !== PipeConnectors[newActiveProvider]
    ) {
      toast.error(
        "Another wallet is currently active. Please disconnect first.",
      );
      setCurrentScreen("provider");
      return;
    }

    setLoading(true);
    setCurrentScreen("loading");

    try {
      switch (wallet.id) {
        case "xwallet":
          if (!Pipeline.address && !session?.user?.id) {
            setXWalletState({
              title: "Unlock account",
              header: true,
              state: "unlock",
              request: "connect",
            });
            openXWalletModal();
          } else if (Pipeline.address && !session?.user?.id) {
            Pipeline.pipeConnector = PipeConnectors.XWallet;
            setCurrentScreen("siwaConnect");
          }

          break;
        case "kibisis":
          Pipeline.pipeConnector = PipeConnectors[wallet.connector];
          handleSwitchWallet(wallet);
          break;
        case "pera":
          Pipeline.pipeConnector = PipeConnectors[wallet.connector];
          handleSwitchWallet(wallet);
          break;
        default:
          toast.error("Unrecognized wallet option");
          break;
      }
    } catch (error) {
      console.error("Connection error:", error);
      toast.error("Failed to connect wallet.");
      setCurrentScreen("error");
      setActiveProvider(null);
      setLoading(false);
    } finally {
      if (Pipeline?.address && !session?.user) {
        setCurrentScreen("siwaConnect");
      }
    }
  };

  console.log("currentScreen", currentScreen);

  const handleDisconnect = () => {
    setCurrentScreen("default");
    disconnectWallet();
  };

  const handleSIWAConnect = () => {
    if (pipeState.provider === PipeConnectors.XWallet) {
      if (!Escrow.secret) {
        setXWalletState({
          title: "Unlock account",
          header: true,
          state: "unlock",
          request: "connect",
        });
        setCurrentScreen("loading");
        openXWalletModal();
      } else {
        signInWithSIWA();
      }
    }
    if (pipeState.provider !== PipeConnectors.XWallet) {
      signInWithSIWA();
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "default":
        return (
          <WalletsScreen
            handleWalletConnect={handleWalletConnect}
            loading={loading}
          />
        );
      case "loading":
        return (
          <LoadingScreen
            provider={provider}
            setCurrentScreen={setCurrentScreen}
          />
        );
      case "siwaConnect":
        return (
          <SIWAConnectScreen
            handleDisconnect={handleDisconnect}
            handleSIWAConnect={handleSIWAConnect}
          />
        );
      case "provider":
        return (
          <ProviderScreen
            provider={provider}
            handleWalletConnect={handleWalletConnect}
            handleDisconnect={handleDisconnect}
          />
        );
      case "error":
        return <ErrorScreen handleDisconnect={handleDisconnect} />;
      default:
        return (
          <WalletsScreen
            handleWalletConnect={handleWalletConnect}
            loading={loading}
          />
        );
    }
  };

  const handleResetScreen = () => {
    setCurrentScreen("default");
    setActiveProvider(null);
    setLoading(false);
  };

  const handleBackOneScreen = () => {
    setCurrentScreen((prev) => {
      if (prev === "siwaConnect" || prev === "provider") {
        return "default";
      }
      return "default";
    });
    setActiveProvider(null);
    setLoading(false);
  };

  const onClose = () => {
    setShowLoginModal(false);
    setActiveProvider(null);
    setCurrentScreen("default");
    setLoading(false);
  };

  useEffect(() => {
    if (isXWalletModalOpen) {
      setDialogStack(true);
    } else if (!isXWalletModalOpen) {
      setDialogStack(false);
    }
  }, [isXWalletModalOpen]);

  return (
    <Dialog
      showModal={showLoginModal}
      setShowModal={setShowLoginModal}
      onClose={onClose}
      dialogStack={dialogStack}
    >
      <div className="relative flex flex-row items-start justify-center border-b bg-accents-1 px-6 py-5">
        <h3 className="text-center text-lg font-medium">
          {currentScreen === "default"
            ? "Connect Wallet"
            : currentScreen === "loading"
            ? "Loading"
            : currentScreen === "siwaConnect"
            ? "Connected"
            : "Error"}
        </h3>
      </div>
      <div className="modal-body relative flex flex-col p-6">
        {renderScreen()}
      </div>
      <div className="modal-actions sticky bottom-0 flex items-center justify-between rounded-b-lg border-t bg-accents-1 px-6 py-5">
        <div className="inline-flex">
          <Button variant="outline" size="md" onClick={onClose}>
            Cancel
          </Button>
          {getScreenLeftButton(
            currentScreen,
            handleResetScreen,
            handleBackOneScreen,
          )}
        </div>
      </div>
    </Dialog>
  );
};

export function useLoginModal() {
  const [showLoginModal, setShowLoginModal] = useState(false);

  const LoginModal = useCallback(
    () => (
      <LoginModalHelper
        showLoginModal={showLoginModal}
        setShowLoginModal={setShowLoginModal}
      />
    ),
    [showLoginModal],
  );

  return { setShowLoginModal, showLoginModal, LoginModal };
}
