import { signIn, useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import {
  IconArrowLeft,
  IconPrism,
  IconShield,
  IconLogout,
} from "@/dashboard/icons";
import { useXWallet } from "@/wallet/xwallet-context";
import { Pipeline } from "@siwa/pipeline";
import { toast } from "@/dashboard/components/ui/toast";
import { useSIWA } from "@/siwa";
import {
  BUTTON_CLASS,
  ICON_CLASS,
  WEB2_PROVIDERS,
  WEB3_PROVIDERS,
  ALL_PROVIDERS,
} from "./constants";
import { useWalletConnection } from "@/dashboard/contexts/wallet-connection-context";
import { PipeConnectors } from "@/dashboard/utils/constants/common";
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

const Button = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className="inline-flex items-center justify-center px-4 py-2 space-x-2 whitespace-nowrap text-sm font-medium transition-all themed-border bg-background hover:text-accent-foreground border-shadow h-10 rounded"
  >
    {children}
  </button>
);

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
    <Button onClick={onClick}>
      <IconArrowLeft /> Previous
    </Button>
  );
};

const DefaultScreen = ({ handleSocialLogin, handleShowWallets, loading }) => {
  const initialOptions = WEB2_PROVIDERS.slice(0, 2);
  const [options, setOptions] = useState(initialOptions);
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="space-y-2">
      <button onClick={handleShowWallets} className={BUTTON_CLASS}>
        <IconPrism className={ICON_CLASS} /> Web3
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
        disabled={wallet.id === "pera" || wallet.id === "xwallet"}
        key={wallet.id}
        onClick={() => handleWalletConnect(wallet)}
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
    <div className="pointer-events-auto">
      <div className="relative z-10 opacity-100">
        <div className="flex flex-col">
          <div className="flex flex-col">
            <div className="flex flex-col">
              <div className="flex flex-col">
                <div className="flex flex-col">
                  {provider.icon}
                  <div className="opacity-100">
                    <h1 className="text-xl font-bold">Requesting Connection</h1>
                    {provider.icon}
                    {provider.name}
                    {provider.id}
                    {provider.type === "web3" ? (
                      <div>
                        Open the {provider.name} browser extension to connect
                        your wallet.
                      </div>
                    ) : (
                      <div>
                        Redirecting to {provider.name} for authentication.
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

const ErrorScreen = () => (
  <div className="pointer-events-auto">
    <div className="relative z-10 opacity-100">BIG ERROR PROBLEM</div>
  </div>
);

const ProviderScreen = ({
  provider,
  handleWalletConnect,
  disconnectWallet,
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
    <div className="m-4 space-y-4">
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
            <h2 className="text-lg font-bold">Connection Issue</h2>
            <div className="text-sm">
              You are trying to connect to {provider.name}, but another wallet
              is currently active.
            </div>
            <div className="text-sm">
              Please disconnect from the current wallet to proceed.
            </div>
            <button
              onClick={handleAttemptReconnect}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Try Connecting Again
            </button>
          </>
        )}
      </div>
      <div className="flex justify-center">{provider.icon}</div>
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

const SIWAConnectScreen = ({ provider, disconnectWallet }) => {
  const { signIn: signInWithSIWA } = useSIWA();
  const pipeState = useSelector(
    algorandGlobalSelectors.selectCurrentPipeConnectState,
  );

  return (
    <div className="space-y-2">
      <div>
        Your {pipeState.provider} wallet is connected. You can now sign in with
        SIWA.
      </div>
      <div className="flex flex-col gap-3 w-full items-center justify-center">
        <button
          onClick={signInWithSIWA}
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
  );
};

export const LoginModalHelper = ({ showLoginModal, setShowLoginModal }) => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [activeProvider, setActiveProvider] = useState(null);
  const [currentScreen, setCurrentScreen] = useState("default");
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
    icon: "Loading...",
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
      setActiveProvider(null);
      setLoading(false);
    } finally {
      if (Pipeline?.address && !session?.user?.id) {
        setCurrentScreen("siwaConnect");
      }
    }
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
        return (
          <LoadingScreen
            provider={provider}
            setCurrentScreen={setCurrentScreen}
          />
        );
      case "siwaConnect":
        return (
          <SIWAConnectScreen
            provider={provider}
            disconnectWallet={disconnectWallet}
          />
        );
      case "provider":
        return (
          <ProviderScreen
            provider={provider}
            handleWalletConnect={handleWalletConnect}
            disconnectWallet={disconnectWallet}
          />
        );
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
    setCurrentScreen((prev) => {
      if (prev === "siwaConnect" || prev === "provider") {
        return "wallets";
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

  return (
    <Modal
      showModal={showLoginModal}
      setShowModal={setShowLoginModal}
      onClose={onClose}
    >
      <div className="relative flex flex-row items-start justify-center border-b bg-accents-1 px-6 py-5">
        <h3 className="text-lg font-medium text-center">
          {currentScreen === "default"
            ? "Sign In"
            : currentScreen === "wallets"
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
      <div className="sticky bottom-0 modal-actions flex items-center justify-between rounded-b-lg border-t bg-accents-1 px-6 py-5">
        <div>
          <Button onClick={onClose}>Cancel</Button>
          {getScreenLeftButton(
            currentScreen,
            handleResetScreen,
            handleBackOneScreen,
          )}
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
