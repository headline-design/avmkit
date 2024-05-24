import React from "react";
import { useXWallet } from "../xwallet-context";
import { Pipeline } from "@avmkit/pipeline";
import WalletItem from "../ui/wallet-item";
import TipMessage from "../ui/tip-message";
import { useWalletNavigation } from "../hooks/use-wallet-navigation";
import { ModalHeader } from "../ui/base-modal/modal-header";
import { useWalletConnection } from "@/dashboard/contexts/wallet-connection-context";
import { PipeConnectors } from "@/dashboard/utils/constants/common";

// Entry point for XWallet connection

const ConnectScreen = ({ pipeState }: { pipeState: any }) => {
  const { connectWallet } = useWalletConnection();
  const { closeXWalletModal, appConfig } = useXWallet();

  const navigate = useWalletNavigation();

  const headerConfig = {
    title: "Connect account",
    header: true,
    backButton: {
      onClick: () => navigate("Home"),
    },
    closeButton: {
      onClick: () => navigate("Home"),
    },
  };

  const handleConfirm = async () => {
    try {
      Pipeline.pipeConnector = PipeConnectors.XWallet;
      await connectWallet(PipeConnectors.XWallet);
      closeXWalletModal();
    } catch (error) {
      console.error("Error handling wallet switch:", error);
    }
  };

  return (
    <>
      <ModalHeader header={headerConfig} />
      <div
        className="wallet-space-wrapper"
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <div
          className="wallet-space-vertical"
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <div className="wallet-space-item-wrapper">
            <div
              className="wallet-space-horizontal"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "flex-start",
                flexDirection: "row",
                gap: 1,
              }}
            >
              <div className="wallet-space-item">
                <div className="wallet-space-item-text">Request from</div>
              </div>
            </div>
          </div>
          <div className="wallet-space-item-wrapper">
            <div className="_module-wrap-content">
              <div className="wallet-spin">
                <div
                  className="wallet-space"
                  style={{
                    display: "flex",
                    flexFlow: "column wrap",
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                    gap: 8,
                  }}
                >
                  <div
                    className="wallet-list-item"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      flexDirection: "row",
                    }}
                  >
                    <div className="wallet-icon">
                      <picture className="wallet-icon-image-core">
                        <img
                          className="wallet-icon-image"
                          src={appConfig.icon}
                          alt="app-icon"
                        />
                      </picture>
                    </div>
                    <div
                      className="summary-item-title-wrapper"
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "flex-start",
                        flexDirection: "column",
                        flex: "1 1 0%",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        className="summary-item-title"
                        style={{ fontWeight: 500, fontSize: 32 }}
                      >
                        {appConfig.name}
                      </div>
                      <div className="summary-item-description">
                        {appConfig.url}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="section-wrap"
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <div>
          <WalletItem walletAddress={pipeState.myAddress} />
        </div>
      </div>
      <div className="affix-placeholder" style={{ height: "145px" }} />
      <div
        className="affix-footer"
        style={{
          zIndex: 1,
          left: 0,
          width: 360,
          bottom: 0,
        }}
      >
        <TipMessage message="Allow current DApp to connect with X Wallet" />

        <div
          className="action-buttons"
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            flexDirection: "row",
          }}
        >
          <button
            type="button"
            onClick={closeXWalletModal}
            className="xwallet-btn xwallet-btn-lg xwallet-btn-outline-primary action-button-left"
          >
            <span className="action-button-content">
              <div className="actions-button-text" style={{ fontSize: 16 }}>
                Cancel
              </div>
            </span>
          </button>
          <button
            type="button"
            className="xwallet-btn xwallet-btn-lg btn-fill-highlight mobile action-button-right"
            onClick={handleConfirm}
          >
            <span className="action-button-content">
              <div className="actions-button-text" style={{ fontSize: 16 }}>
                Connect
              </div>
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

export default ConnectScreen;
