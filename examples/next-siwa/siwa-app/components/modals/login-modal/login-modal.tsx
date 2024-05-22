import { signIn, useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback, use } from "react";
import { IconArrowLeft, IconPrism } from "@/dashboard/icons";
import { useXWallet } from "@/wallet/xwallet-context";
import { Pipeline } from "@siwa/pipeline";
import { toast } from "@/dashboard/components/ui/toast";
import { SIWAContext, useSIWA } from "@/siwa";
import {
  BUTTON_CLASS,
  ICON_CLASS,
  WEB2_PROVIDERS,
  WEB3_PROVIDERS,
  ALL_PROVIDERS,
} from "./constants";
import { useWalletConnection } from "@/dashboard/contexts/wallet-connection-context";
import { PipeConnectors } from "@/dashboard/utils/constants/common";
import { IconShield, IconLogout } from "@/dashboard/icons";
import { cn, shorten } from "@/dashboard/lib/utils";
import { useSelector } from "react-redux";
import algorandGlobalSelectors from "@/dashboard/redux/algorand/global/globalSelctors";
import Modal from "../../ui/dialog";

export interface Provider {
  id: string;
  name: string;
  icon: JSX.Element;
  type: string;
  connector: string;
}

export const LoginModalHelper = ({ showLoginModal, setShowLoginModal }) => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false); // Global loading boolean
  const [activeProvider, setActiveProvider] = useState(null); // Provider-specific loading id

  const [currentScreen, setCurrentScreen] = useState("default"); // Current screen state
  const searchParams = useSearchParams();
  const { openXWalletModal, setModalState } = useXWallet();
  const {
    status: walletStatus,
    connectWallet,
    disconnectWallet,
  } = useWalletConnection();

  const pipeState = useSelector(
    algorandGlobalSelectors.selectCurrentPipeConnectState,
  );

  const provider = ALL_PROVIDERS.find(
    (p) => p.connector === activeProvider,
  ) || {
    id: "loading",
    name: "Loading...",
    icon: "Loading...", // Your custom loading icon component
    type: "loading",
    connector: "loading",
  };

  useEffect(() => {
    if (status === "authenticated") {
      setShowLoginModal(false);
    } else if (status === "unauthenticated") {
      setActiveProvider(null);
      setLoading(false);
    }
  }, [status, setShowLoginModal]);

  useEffect(() => {
    // Check if the current pending provider is from WEB3_PROVIDERS
    if (
      WEB3_PROVIDERS.some((provider) => provider.connector === activeProvider)
    ) {
      if (
        Pipeline.address &&
        !session?.user?.id &&
        provider &&
        PipeConnectors[provider.connector] === pipeState.provider
      ) {
        setCurrentScreen("siwaConnect");
      } else if (
        Pipeline.address &&
        !session?.user?.id &&
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
    session?.user?.id,
    provider.connector,
    pipeState,
    provider,
  ]);

  const handleSocialLogin = async (providerId) => {
    setLoading(true);
    setActiveProvider(providerId);
    setCurrentScreen("loading");
    try {
      await signIn(providerId, {
        callbackUrl: searchParams.get("next") || "/",
      });
    } catch (error) {
      toast.error(`Error during sign in:', ${error}`);
      setLoading(false);
      setActiveProvider(null);
      setCurrentScreen("error");
    }
  };

  const handleShowWallets = () => {
    setCurrentScreen("wallets");
  };

  const handleSwitchWallet = useCallback(
    async (wallet) => {
      await connectWallet(wallet.id);
    },
    [connectWallet],
  );

  const handleWalletConnect = async (wallet) => {
    const newActiveProvider = wallet.connector; // Temporary variable to hold the new provider ID.
    setActiveProvider(newActiveProvider); // Set the active provider immediately.

    if (
      pipeState.provider !== "" &&
      pipeState.provider !== PipeConnectors[newActiveProvider]
    ) {
      toast.error(
        "Another wallet is currently active. Please disconnect first.",
      );
      // Instead of resetting the active provider, update the screen to show an error or status message.
      setCurrentScreen("provider");
      return;
    }

    setLoading(true);
    setCurrentScreen("loading");

    try {
      switch (wallet.id) {
        case "xwallet":
          setModalState({
            title: "Unlock account",
            header: true,
            state: "unlock",
            request: "connect",
          });
          openXWalletModal();
          if (Pipeline.address && !session?.user?.id) {
            Pipeline.pipeConnector = PipeConnectors.XWallet;
            setCurrentScreen("siwaConnect");
          }
          break;
        case "kibisis":
          Pipeline.pipeConnector = PipeConnectors[wallet.connector];
          handleSwitchWallet(wallet);
          break;
        case "pera":
          toast.error("Pera wallet is not available yet");
          break;
        default:
          toast.error("Unrecognized wallet option");
          break;
      }
    } catch (error) {
      console.error("Connection error:", error);
      toast.error("Failed to connect wallet.");
      setCurrentScreen("error");
      setActiveProvider(null); // Reset on actual failure to avoid inconsistent state.
      setLoading(false);
    } finally {
      if (Pipeline?.address && !session?.user?.id) {
        setCurrentScreen("siwaConnect");
      }
    }
  };

  const LoadingScreen = ({ provider }: { provider: Provider }) => {
    useEffect(() => {
      if (pipeState.provider === PipeConnectors[provider.connector]) {
        setCurrentScreen("siwaConnect");
      }
    }, [pipeState.provider, provider.connector, setCurrentScreen]);

    return (
      <div className="pointer-events-auto">
        <div className="relative z-10 opacity-100">
          <div className="flex flex-col">
            <div className="flex flex-col">
              <div className="flex flex-col">
                <div className="flex flex-col">
                  <div className="flex flex-col">
                    {/* Display the provider icon if available */}
                    <div className="flex flex-col">
                      {provider && provider.icon}
                    </div>
                    Hello world
                    <div className="opacity-100">
                      <h1 className="text-xl font-bold">
                        Requesting Connection
                      </h1>
                      {provider?.icon}
                      {provider?.name}
                      {provider?.id}
                      {provider?.type === "web3" ? (
                        <div>
                          {/* Instructions for Web3 providers */}
                          Open the {provider
                            ? provider.name
                            : "appropriate"}{" "}
                          browser extension to connect your wallet.
                        </div>
                      ) : (
                        <div>
                          {/* Instructions for Web2 providers */}
                          Redirecting to{" "}
                          {provider ? provider.name : "appropriate service"} for
                          authentication.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  const ErrorScreen = () => {
    return (
      <div className="pointer-events-auto">
        <div className="relative z-10 opacity-100">BIG ERROR PROBLEM</div>
      </div>
    );
  };

  const DefaultScreen = ({ handleSocialLogin, handleShowWallets, loading }) => {
    const initialOptions = WEB2_PROVIDERS.slice(0, 2);
    const [options, setOptions] = useState(initialOptions);
    const [showMore, setShowMore] = useState(false);

    return (
      <div className="space-y-2">
        <button onClick={handleShowWallets} className={BUTTON_CLASS}>
          <IconPrism className={ICON_CLASS} />
          Web3
        </button>
        {options.map(({ id, name, icon }) => (
          <button
            key={id}
            onClick={() => handleSocialLogin(id)}
            className={BUTTON_CLASS}
          >
            {loading === id ? (
              "Loading"
            ) : (
              <>
                {icon}
                {name}
              </>
            )}
          </button>
        ))}
        {WEB2_PROVIDERS.length > 2 && (
          <button
            type="button"
            className={BUTTON_CLASS}
            onClick={() => {
              setShowMore(!showMore);
              setOptions(showMore ? initialOptions : WEB2_PROVIDERS);
            }}
          >
            {showMore ? "Show less" : "Show more"}
          </button>
        )}
      </div>
    );
  };

  const WalletsScreen = ({ handleWalletConnect, loading }) => (
    <div className="space-y-2">
      {WEB3_PROVIDERS.map((wallet) => (
        <button
          disabled={wallet.id === "pera"}
          key={wallet.id}
          onClick={handleWalletConnect.bind(null, wallet)}
          className={BUTTON_CLASS}
        >
          {loading === wallet.id ? (
            "Loading"
          ) : (
            <>
              {wallet.icon}
              {wallet.name}
            </>
          )}
        </button>
      ))}
    </div>
  );

  // create condition to tell user they are connected to a different provider if provider is not the same as the one in the pipeState

  const ProviderScreen = ({ provider }: { provider: Provider }) => {
    // Determine if the provider in the context matches the one that is currently active
    const isCurrentProvider =
      PipeConnectors[provider.connector] === pipeState.provider;

    // Function to handle the wallet connection again if the user wishes to switch
    const handleAttemptReconnect = () => {
      if (provider) {
        handleWalletConnect(provider); // Assuming this function can be called directly
      }
    };

    return (
      <div className="m-4 space-y-4">
        <div className="text-center">
          {isCurrentProvider ? (
            <>
              {/* Message for when the user is connected to the correct provider */}
              <h2 className="text-lg font-bold">
                Connected to {provider.name}
              </h2>
              <div className="text-sm">
                You are currently connected to the right wallet.
              </div>
            </>
          ) : (
            <>
              {/* Message for when the user is trying to connect to a different provider */}
              <h2 className="text-lg font-bold">Connection Issue</h2>
              <div className="text-sm">
                You are trying to connect to {provider.name}, but another wallet
                is currently active.
              </div>
              <div className="text-sm">
                Please disconnect from the current wallet to proceed.
              </div>
              {/* Optionally, offer a button to directly attempt to reconnect */}
              <button
                onClick={handleAttemptReconnect}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Try Connecting Again
              </button>
            </>
          )}
        </div>
        <div className="flex justify-center">
          {/* Show the provider's icon for better visual context */}
          {provider.icon}
        </div>
        <div className="text-center">
          <button
            onClick={disconnectWallet}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Disconnect Wallet
          </button>
        </div>
      </div>
    );
  };

  const SIWAConnectScreen = ({ provider }: { provider: Provider }) => {
    const { signIn: signInWithSIWA } = useSIWA();
    return (
      <>
        <div className="space-y-2">
          <div>{getScreenMessage("siwaConnect")}</div>
          <div className="flex flex-col gap-3 w-full items-center justify-center">
            <button
              onClick={() => signInWithSIWA()}
              className="rounded-full h-[100px] w-[100px] border-2 border-skin-border items-center justify-center flex hover:bg-skin-hover-bg hover:border-teal-600"
            >
              <IconShield className="w-8 h-8" />
            </button>
            <span>{shorten(pipeState.myAddress)}</span>
            <span>{pipeState.chain}</span>
          </div>
          <button
            onClick={disconnectWallet}
            className={cn(BUTTON_CLASS, "text-skin-text")}
          >
            <IconLogout className="w-4 h-4 text-skin-text mr-2" />
            Disconnect Wallet
          </button>
        </div>
      </>
    );
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "default":
        return (
          <DefaultScreen
            handleSocialLogin={handleSocialLogin}
            handleShowWallets={handleShowWallets}
            loading={loading}
          />
        );
      case "wallets":
        return (
          <WalletsScreen
            handleWalletConnect={handleWalletConnect}
            loading={loading}
          />
        );
      case "loading":
        return <LoadingScreen provider={provider} />;
      case "siwaConnect":
        return <SIWAConnectScreen provider={provider} />;
      case "provider":
        return <ProviderScreen provider={provider} />;
      case "error":
        return <ErrorScreen />;
      default:
        return (
          <DefaultScreen
            handleSocialLogin={handleSocialLogin}
            handleShowWallets={handleShowWallets}
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
    if (currentScreen === "siwaConnect") {
      setCurrentScreen("wallets");
      setActiveProvider(null);
      setLoading(false);
    } else if (currentScreen === "provider") {
      setCurrentScreen("wallets");
      setActiveProvider(null);
      setLoading(false);
    } else {
      setCurrentScreen("default");
      setActiveProvider(null);
      setLoading(false);
    }
  };

  const getScreenTitle = (screen) => {
    switch (screen) {
      case "default":
        return "Sign In";
      case "wallets":
        return "Connect Wallet";
      case "loading":
        return "Loading";
      case "siwaConnect":
        return "Connected";
      case "error":
        return "Error";
      default:
        return "Sign In";
    }
  };

  const getScreenMessage = (screen) => {
    switch (screen) {
      case "siwaConnect":
        return (
          <>
            Your {pipeState.provider} wallet is connected. You can now sign in
            with SIWA.
          </>
        );
      case "provider":
        return (
          <>
            You are connected to a different wallet provider. Connect to{" "}
            {provider?.name} to continue.
          </>
        );
      default:
        return null;
    }
  };

  const Button = ({ onClick, children }) => (
    <button
      onClick={onClick}
      className="inline-flex items-center justify-center px-4 py-2 space-x-2 whitespace-nowrap text-sm font-medium transition-all themed-border bg-background hover:text-accent-foreground border-shadow h-10 rounded"
    >
      {children}
    </button>
  );

  const getScreenLeftButton = (screen) => {
    const onClickHandlers = {
      wallets: handleResetScreen,
      siwaConnect: handleBackOneScreen,
      provider: handleBackOneScreen,
    };

    const onClick = onClickHandlers[screen];

    if (!onClick) return null;

    return (
      <Button onClick={onClick}>
        <IconArrowLeft /> Previous
      </Button>
    );
  };

  const onClose = () => {
    setShowLoginModal(false);
    setActiveProvider(null);
    setCurrentScreen("default");
    setLoading(false);
  };

  return (
    <Modal showModal={showLoginModal} setShowModal={setShowLoginModal}>
      <div className="relative flex flex-row items-start justify-center border-b bg-accents-1 px-6 py-5">
        <h3 className="text-lg font-medium text-center">
          {getScreenTitle(currentScreen)}
        </h3>
      </div>
      <div className="modal-body relative flex flex-col p-6">
        {renderScreen()}
      </div>
      <div className="sticky bottom-0 modal-actions  flex items-center justify-between rounded-b-lg border-t bg-accents-1 px-6 py-5">
        <div>
          <button className="inline-flex items-center justify-center px-4 py-2 space-x-2 whitespace-nowrap text-sm font-medium transition-all themed-border bg-background hover:text-accent-foreground border-shadow h-10 rounded">
            cancel
          </button>
          {getScreenLeftButton(currentScreen)}
        </div>
      </div>
    </Modal>
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
