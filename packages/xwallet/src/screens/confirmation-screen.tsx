import { useXWallet } from "../xwallet-context";
import { Pipeline } from "@avmkit/pipeline";
import { wallet } from "../constants";

// Transaction confirmation screen

const ConfirmationScreen = ({
  useWalletConnection,
  PipeConnectors,
}: {
  PipeConnectors: any;
  useWalletConnection: any;
}) => {
  const { closeXWalletModal, xWalletState, setXWalletState, unlockXWallet } =
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
    handleConnect();
    unlockXWallet();
  };

  return (
    <>
      {xWalletState.request === "connect" ? (
        <>
          <div className="m-4">
            <>
              <span>
                Are you sure you want to connect to the wallet at address{" "}
                {xWalletState.address}?
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
                              src="https://siwa.org/favicon.ico"
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
                            SIWA
                          </div>
                          <div className="summary-item-description">
                            siwa.org
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
                      siwa.org wants you to sign in with your Algorand account:
                      0x8d9d49971eC5B22b521D81C1F4116744269890F0 Sign
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
