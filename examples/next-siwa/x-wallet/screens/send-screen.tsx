import { useWalletNavigation } from "../hooks/use-wallet-navigation";
import { sendTransaction } from "../lib/wallet-functions";
import { ModalHeader } from "../ui/base-modal/modal-header";
import { Pipeline, Escrow } from "@siwa/pipeline";
import { Footer } from "../ui/components/footer";
import React from "react";
import { InputField, TextArea } from "../ui/formkit";
import { IconCopyDashed } from "../icons";

const EditTransactionForm = ({
  transactionConfig,
  formConfig,
  setFormConfig,
}) => {
  return (
    <div className="rpc-avm-send-edit-inner">
      <div className="xwallet-send-form-row">
        <TextArea
          name="to"
          onChange={(e) => setFormConfig({ ...formConfig, to: e.target.value })}
          label="To"
          placeholder="Enter wallet address or domain name"
          className="xwallet-input-input xwallet-input-textarea xwallet-textarea-auto-resize"
          value={formConfig.to}
        />
      </div>
      <div className="xwallet-send-form-row">
        <InputField
          onChange={(e) =>
            setFormConfig({ ...formConfig, amount: e.target.value })
          }
          label="Amount"
          value={formConfig.amount}
          name="amount"
          placeholder="0.0"
          autoComplete="off"
          type="number"
          className="xwallet-input-input"
          min={0}
          max={9007199254740991}
        />
      </div>
      <div className="xwallet-send-form-row">
        <InputField
          label="Input data (optional)"
          onChange={(e) =>
            setFormConfig({ ...formConfig, note: e.target.value })
          }
          value={formConfig.note}
          name="note"
          placeholder="Optional"
          className="xwallet-input-input"
          autoComplete="off"
        />
      </div>
    </div>
  );
};

export const ReviewTransactionForm = ({ transactionConfig }) => {
  return (
    <>
      <div
        className="xwallet-wallet-space xwallet-wallet-space-vertical xwallet-section-wrap xwallet-section-wrap-bordered"
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <div
          className="xwallet-wallet-space xwallet-wallet-space-vertical"
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <div className="xwallet-wallet-space-item">
            <div
              className="xwallet-wallet-space xwallet-wallet-space-horizontal"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "flex-start",
                flexDirection: "row",
                gap: 1,
              }}
            >
              <div className="xwallet-wallet-space-item">
                <div className="xwallet-typography-text xwallet-typography-text-left xwallet-typography-text-xs xwallet-typography-text-secondary">
                  Send
                </div>
              </div>
            </div>
          </div>
          <div className="xwallet-wallet-space-item">
            <div className="xwallet-module-wrap-content">
              <div className="xwallet-wallet-spin">
                <div
                  className="xwallet-wallet-space xwallet-wallet-space-vertical"
                  style={{
                    display: "flex",
                    flexFlow: "column wrap",
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                    gap: 8,
                  }}
                >
                  <div
                    className="xwallet-wallet-list-item xwallet-wallet-list-cell xwallet-summary-item"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      flexDirection: "row",
                    }}
                  >
                    <div className="xwallet-wallet-list-cell-icon">
                      <div className="xwallet-summary-item-icon-wrap">
                        <div className="xwallet-wallet-icon xwallet-wallet-icon-radius xwallet-wallet-icon-lg xwallet-wallet-icon-text xwallet-wallet-icon-text-black xwallet-wallet-icon-text-lg">
                          O
                        </div>
                      </div>
                    </div>
                    <div
                      className="xwallet-summary-item-title-wrap"
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "flex-start",
                        flexDirection: "column",
                      }}
                    >
                      <div className="xwallet-typography-text xwallet-typography-text-left xwallet-typography-text-md xwallet-typography-text-default">
                        {transactionConfig.amount}{" "}
                        {transactionConfig.assetTicker || "OKB"}
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
        className="xwallet-wallet-space xwallet-wallet-space-vertical xwallet-section-wrap xwallet-section-wrap-bordered"
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <div className="xwallet-wallet-space-item">
          <div
            className="xwallet-wallet-space xwallet-wallet-space-vertical"
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              flexDirection: "column",
              gap: 4,
            }}
          >
            <div className="xwallet-wallet-space-item">
              <div
                className="xwallet-wallet-space xwallet-wallet-space-horizontal"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  flexDirection: "row",
                  gap: 1,
                }}
              >
                <div className="xwallet-wallet-space-item">
                  <div className="xwallet-typography-text xwallet-typography-text-left xwallet-typography-text-xs xwallet-typography-text-secondary">
                    From
                  </div>
                </div>
              </div>
            </div>
            <div className="xwallet-wallet-space-item">
              <div className="xwallet-module-wrap-content">
                <div
                  className="xwallet-wallet-space xwallet-wallet-space-vertical"
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                    flexDirection: "column",
                    gap: 4,
                  }}
                >
                  <div className="xwallet-wallet-space-item">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        flexDirection: "row",
                      }}
                    >
                      <div className="xwallet-typography-text xwallet-typography-text-force-wrap xwallet-typography-text-left xwallet-typography-text-sm xwallet-typography-text-default xwallet-wallet-address-text">
                        {transactionConfig.from}
                      </div>
                      <div className="xwallet-wallet-icon xwallet-wallet-icon-radius xwallet-wallet-icon-sm xwallet-wallet-icon-icon undefined xwallet-wallet-icon-button xwallet-wallet-icon-button-hovered xwallet-wallet-icon-button-upstep xwallet-wallet-address-copy">
                        <IconCopyDashed />
                        <div
                          data-testid="okd-popup"
                          className="okui-popup okui-tooltip okui-tooltip-neutral   xwallet-wallet-icon-tooltip"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="xwallet-wallet-space-item">
                    <div
                      style={{
                        display: "flex",
                        flexFlow: "wrap",
                        alignItems: "flex-start",
                        justifyContent: "flex-start",
                        gap: 4,
                      }}
                    >
                      <div className="xwallet-wallet-address-tag xwallet-address-tag-flex">
                        <div className="xwallet-typography-text xwallet-typography-text-ellipsis">
                          Wallet A
                        </div>
                        <div className="xwallet-typography-text xwallet-typography-text-ellipsis">
                          -
                        </div>
                        <div className="xwallet-typography-text xwallet-typography-text-ellipsis">
                          Account 01
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="xwallet-wallet-space-item">
          <div
            className="xwallet-wallet-space xwallet-wallet-space-vertical"
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              flexDirection: "column",
              gap: 4,
            }}
          >
            <div className="xwallet-wallet-space-item">
              <div
                className="xwallet-wallet-space xwallet-wallet-space-horizontal"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  flexDirection: "row",
                  gap: 1,
                }}
              >
                <div className="xwallet-wallet-space-item">
                  <div className="xwallet-typography-text xwallet-typography-text-left xwallet-typography-text-xs xwallet-typography-text-secondary">
                    To
                  </div>
                </div>
              </div>
            </div>
            <div className="xwallet-wallet-space-item">
              <div className="xwallet-module-wrap-content">
                <div
                  className="xwallet-wallet-space xwallet-wallet-space-vertical"
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                    flexDirection: "column",
                    gap: 4,
                  }}
                >
                  <div className="xwallet-wallet-space-item">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        flexDirection: "row",
                      }}
                    >
                      <div className="xwallet-typography-text xwallet-typography-text-force-wrap xwallet-typography-text-left xwallet-typography-text-sm xwallet-typography-text-default xwallet-wallet-address-text">
                        {transactionConfig.to}
                      </div>
                      <div className="xwallet-wallet-icon xwallet-wallet-icon-radius xwallet-wallet-icon-sm xwallet-wallet-icon-icon undefined xwallet-wallet-icon-button xwallet-wallet-icon-button-hovered xwallet-wallet-icon-button-upstep xwallet-wallet-address-copy">
                        <IconCopyDashed />
                        <div
                          data-testid="okd-popup"
                          className="okui-popup okui-tooltip okui-tooltip-neutral   xwallet-wallet-icon-tooltip"
                        />
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
        className="xwallet-wallet-space xwallet-wallet-space-vertical xwallet-section-wrap xwallet-section-wrap-bordered"
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <div>
          <div
            className="xwallet-module-wrap-hover"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexDirection: "row",
            }}
          >
            <div
              className="xwallet-wallet-space xwallet-wallet-space-vertical"
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "flex-start",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <div className="xwallet-wallet-space-item">
                <div
                  className="xwallet-wallet-space xwallet-wallet-space-horizontal"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    flexDirection: "row",
                    gap: 1,
                  }}
                >
                  <div className="xwallet-wallet-space-item">
                    <div className="xwallet-wallet-icon xwallet-wallet-icon-radius xwallet-wallet-icon-xs xwallet-wallet-icon-text xwallet-wallet-icon-text-black xwallet-wallet-icon-text-xs xwallet-module-wrap-icon">
                      O
                    </div>
                  </div>
                  <div className="xwallet-wallet-space-item">
                    <div className="xwallet-typography-text xwallet-typography-text-left xwallet-typography-text-xs xwallet-typography-text-secondary">
                      X Layer testnet Est network fee
                    </div>
                  </div>
                </div>
              </div>
              <div className="xwallet-wallet-space-item">
                <div className="xwallet-module-wrap-content">
                  <div
                    className="xwallet-wallet-space xwallet-wallet-space-vertical xwallet-networkFee-enter-content-animation"
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "flex-start",
                      flexDirection: "column",
                      gap: 12,
                    }}
                  >
                    <div className="xwallet-wallet-space-item">
                      <div
                        className="xwallet-flex xwallet-flex-wrap xwallet-justify-start xwallet-flex-wrap xwallet-align-center"
                        style={{
                          gap: "6px 0px",
                        }}
                      >
                        <div className="xwallet-typography-text xwallet-typography-text-left xwallet-typography-text-sm xwallet-typography-text-default">
                          {transactionConfig.amount}{" "}
                          {transactionConfig.assetTicker} OKB&nbsp;
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="xwallet-wallet-icon xwallet-wallet-icon-radius xwallet-wallet-icon-xs xwallet-wallet-icon-icon"
              style={{ color: "rgb(146, 146, 146)", cursor: "pointer" }}
            >
              <i className="icon iconfont okds-arrow-chevron-right-centered-md xwallet-wallet-icon-icon-core" />
            </div>
          </div>
        </div>
      </div>
      <div
        className="xwallet-wallet-space xwallet-wallet-space-vertical xwallet-section-wrap"
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <div className="xwallet-wallet-space-item">
          <div
            className="xwallet-wallet-space xwallet-wallet-space-vertical"
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              flexDirection: "column",
              gap: 4,
            }}
          >
            <div className="xwallet-wallet-space-item">
              <div
                className="xwallet-wallet-space xwallet-wallet-space-horizontal"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  flexDirection: "row",
                  gap: 1,
                }}
              >
                <div className="xwallet-wallet-space-item">
                  <div className="xwallet-typography-text xwallet-typography-text-left xwallet-typography-text-xs xwallet-typography-text-secondary">
                    Nonce
                  </div>
                </div>
              </div>
            </div>
            <div className="xwallet-wallet-space-item">
              <div className="xwallet-module-wrap-content">
                <div className="xwallet-typography-text xwallet-typography-text-left xwallet-typography-text-sm xwallet-typography-text-default">
                  1
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="xwallet-wallet-space-item">
          <div className="okui-accordion xwallet-view-data">
            <div className="okui-accordion-header okui-accordion-header-expanded xwallet-view-data-header">
              <div className="okui-accordion-header-title xwallet-view-data-header-title">
                Data
              </div>
              <div className="xwallet-wallet-icon xwallet-wallet-icon-radius xwallet-wallet-icon-xs xwallet-wallet-icon-icon undefined okui-accordion-header-icon-expanded xwallet-view-data-expande-icon">
                <i className="icon iconfont okds-arrow-chevron-down-md xwallet-wallet-icon-icon-core" />
              </div>
            </div>
            <div className="okui-accordion-content okui-accordion-content-expanded xwallet-view-data-content">
              <div
                data-testid="okd-popup"
                className="okui-popup okui-tooltip okui-tooltip-neutral  "
              >
                <div className="xwallet-typography-text xwallet-typography-text-force-wrap xwallet-typography-text-left xwallet-typography-text-sm xwallet-typography-text-default">
                  {transactionConfig.note}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="xwallet-affix-placeholder" style={{ height: 80 }} />
    </>
  );
};

const SendScreen = () => {
  const navigate = useWalletNavigation();
  const [transactionConfig, setTransactionConfig] = React.useState({
    step: "edit",
    assetName: "Send Transaction",
    assetBalance: "0.0",
    to: "",
    from: Pipeline.address,
    amount: 0,
    inputData: "",
  });

  const [formConfig, setFormConfig] = React.useState({
    to: "",
    amount: 0,
    note: "",
  });

  const headerConfig = {
    title: transactionConfig.assetName || "Send Transaction",
    header: true,
    backButton: {
      onClick: () => {
        if (transactionConfig.step === "edit") {
          navigate("Home");
        } else if (transactionConfig.step === "review") {
          setTransactionConfig({ ...transactionConfig, step: "edit" });
        }
      },
    },
  };

  console.log("transactionConfig", transactionConfig, formConfig);

  return (
    <>
      <ModalHeader header={headerConfig} />
      <div className="send-screen">
        {transactionConfig.step === "edit" ? (
          <EditTransactionForm
            transactionConfig={transactionConfig}
            formConfig={formConfig}
            setFormConfig={setFormConfig}
          />
        ) : (
          <ReviewTransactionForm transactionConfig={transactionConfig} />
        )}
        <Footer
          actions={[
            {
              label: transactionConfig.step === "edit" ? "Next" : "Send",
              variant: "primary",
              onClick: () => {
                if (transactionConfig.step === "edit") {
                  console.log("formConfig", transactionConfig);
                  setTransactionConfig({
                    ...transactionConfig,
                    step: "review",
                    ...formConfig,
                  });
                } else if (transactionConfig.step === "review") {
                  console.log("formConfig", transactionConfig);
                  sendTransaction(
                    Pipeline.address,
                    transactionConfig.to,
                    transactionConfig.amount,
                  );
                }
              },
            },
          ]}
        />
      </div>
    </>
  );
};

export default SendScreen;
