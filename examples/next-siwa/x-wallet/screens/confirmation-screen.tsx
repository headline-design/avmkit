import React from "react";
import { useXWallet } from "../xwallet-context";
import { Pipeline } from "@siwa/pipeline";
import { PipeConnectors } from "@/dashboard/utils/constants/common";
import { useWalletConnection } from "@/dashboard/contexts/wallet-connection-context";
import { wallet } from "../constants";

// Transaction confirmation screen

const ConfirmationScreen = () => {
  const { closeXWalletModal, modalState, setModalState, unlockXWallet } =
    useXWallet();
  const { connectWallet } = useWalletConnection();

  const handleConnect = async () => {
    try {
      await connectWallet(PipeConnectors[wallet.connector]);
    } catch (error) {
      console.error("Error handling wallet switch:", error);
    }
  };

  const handleConfirm = () => {
    alert("handleConfirm");
    Pipeline.connector = PipeConnectors[wallet.connector]; // Update the connector
    console.log("Pipeline.connector", Pipeline.connector);
    handleConnect();
    unlockXWallet();
  };

  return (
    <>
      {modalState.request === "connect" ? (
        <>
          <div className="m-4">
            <>
              <span>
                Are you sure you want to connect to the wallet at address{" "}
                {modalState.address}?
              </span>
            </>
          </div>
          <div className="p-4 text-center">
            <button
              className="button button--primary w-full px-[22px] hover:brightness-95"
              onClick={handleConfirm}
            >
              Confirm Connection
            </button>
          </div>
        </>
      ) : (
        <>
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
                              src="https://app.galxe.com/favicon.ico"
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
                            Galxe
                          </div>
                          <div className="summary-item-description">
                            app.galxe.com
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
              <div className="section-root">
                <div className="section-label">Data</div>
                <div className="section-innner-root">
                  <div
                    data-testid="xwallet-popup"
                    className="xwallet-popup xwallet-tooltip "
                  >
                    <div className="section-text typography">
                      app.galxe.com wants you to sign in with your Ethereum
                      account: 0x8d9d49971eC5B22b521D81C1F4116744269890F0 Sign
                      in with Ethereum to the app. URI: https://app.galxe.com
                      Version: 1 Chain ID: 137 Nonce: Kf5xtI6bbjoKtL6at Issued
                      At: 2024-04-13T09:35:52.405Z Expiration Time:
                      2024-04-20T09:35:52.374Z
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="affix-placeholder" style={{ height: 80 }} />
          <div
            className="affix-footer"
            style={{
              zIndex: 1,
              left: 0,
              width: 360,
              bottom: 0,
            }}
          >
            <div
              className="action-buttons"
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "flex-start",
                flexDirection: "row",
              }}
            >
              <button type="button" className="action-button-secondary">
                <span className="action-button-content">
                  <div className="actions-button-text" style={{ fontSize: 16 }}>
                    Cancel
                  </div>
                </span>
              </button>
              <button type="button" className="action-button-primary">
                <span className="action-button-content">
                  <div className="actions-button-text" style={{ fontSize: 16 }}>
                    Confirm
                  </div>
                </span>
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ConfirmationScreen;
