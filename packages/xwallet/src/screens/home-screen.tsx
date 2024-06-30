import React, { useState } from "react";
import { useXWallet } from "../xwallet-context";
import {
  IconChevronDownFilled,
  IconCopy,
  IconEditList,
  IconGear,
  IconUnlink,
  IconFaucet,
  IconArrowUp,
  IconArrowDown,
  IconHistory,
  IconTools,
} from "../icons";

import Avatar from "../ui/avatar";
import { shorten } from "../utils";
import GlobalMenu from "../ui/components/global-menu/global-menu";
import { useWalletNavigation } from "../hooks/use-wallet-navigation";
import { AssetRow } from "../ui/components/asset-row";
import { AlgoLogoUrl, VoiLogoUrl } from "../logos/data-urls";

const getLogoUrl = (networkDetails) => {
  switch (networkDetails.name) {
    case "Algorand":
      return AlgoLogoUrl;
    case "Voi Network":
      return VoiLogoUrl;
    default:
      return ""; // or a default logo URL if needed
  }
};

const HomeScreen = ({ pipeState }: { pipeState: any }) => {
  const [isGlobalMenuOpen, setIsGlobalMenuOpen] = useState(false);
  const { getActiveNetwork } = useXWallet();
  const activeNetwork = getActiveNetwork();
  const logoUrl = activeNetwork?.name ? getLogoUrl(activeNetwork) : null;
  const { appConfig } = useXWallet();

  const toggleGlobalMenu = () => {
    setIsGlobalMenuOpen(!isGlobalMenuOpen);
  };

  const navigate = useWalletNavigation(); // Using the custom hook

  const walletConfig = {
    avatarSize: "32px",
    defaultAddress: "0x123...def", // Example address
    walletName: "Wallet A",
    accountNumber: "Account 01",
    totalWalletValue: "4.7 BTC",
    assets: [
      {
        balance: "0.2 HDL",
        logoUrl: AlgoLogoUrl,
        chainName: "Algorand testnet",
      },
      {
        balance: "1.5 BTC",
        logoUrl: VoiLogoUrl,
        chainName: "Bitcoin Network",
      },
      {
        balance: "3.0 ETH",
        logoUrl: "",
        chainName: "Ethereum Network",
      },
    ],
    footerLogoUrl: appConfig.icon,
    footerUrl: appConfig.url,
    networkStatus: "Connected | All networks",
  };

  return (
    <>
      <div className="xwallet-main-header-container">
        <div className="xwallet-main-header-avatar-wrapper">
          <div className="xwallet-main-header-avatar xwallet-main-header-avatar-sm">
            <Avatar
              size="32px"
              address={pipeState.address}
              className="xwallet-main-header-avatar-core"
            />
          </div>
        </div>
        <div className="xwallet-main-header-content">
          <div className="xwallet-main-copyWrapper">
            <div className="xwallet-main-copyWrapper-title">
              <div className="xwallet-main-copyWrapper-title-item">
                Wallet A&nbsp;
              </div>
              <div className="xwallet-main-copyWrapper-title-item">
                - Account 01
              </div>
            </div>
            <div className="xwallet-main-account-description-container">
              <div
                className="xwallet-main-account-description"
                style={{ fontWeight: 500 }}
              >
                {shorten(pipeState.address)}
              </div>
              <IconChevronDownFilled />
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            flexDirection: "row",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              flexDirection: "row",
            }}
          >
            <div className="xwallet-icon-toolbar-button">
              <IconCopy />
            </div>
          </div>
          <div className="xwallet-select select-text">
            <div
              data-testid="xwallet-popup"
              className="xwallet-popup select-popup-reference"
            >
              <GlobalMenu>
                <div className="xwallet-select-value-box">
                  <div
                    className="xwallet-icon-toolbar-button"
                    onClick={toggleGlobalMenu}
                  >
                    <IconGear />
                  </div>
                </div>
              </GlobalMenu>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              flexDirection: "row",
            }}
          >
            <div
              className="xwallet-header-dropdown-container"
              onClick={() => navigate("Chains")}
            >
              <div
                className="xwallet-wallet-icon xwallet-wallet-icon-radius"
                style={{ width: 18, height: 18, fontSize: 12 }}
              >
                <picture className="xwallet-picture xwallet-wallet-icon-image-core xwallet-picture-font">
                  <img
                    src={logoUrl || activeNetwork?.logoUrl}
                    alt="Wallet Asset Logo"
                    style={{ width: 18, height: 18 }}
                  />
                </picture>
              </div>
              <IconChevronDownFilled />
            </div>
          </div>
        </div>
      </div>
      <div className="xwallet-main-body-wrapper">
        <BalanceWrapper balance={walletConfig.totalWalletValue} />

        <div className="xwallet-main-toolbar-container">
          {/* Toolbar icons */}
          <ToolbarButton
            icon={<IconArrowUp />}
            text="Send"
            onClick={() => navigate("Send")}
          />
          <ToolbarButton
            icon={<IconArrowDown />}
            text="Receive"
            onClick={() => navigate("Receive")}
          />
          <ToolbarButton
            icon={<IconFaucet />}
            text="Faucet"
            onClick={() => navigate("Faucet")}
          />
          <ToolbarButton
            icon={<IconHistory />}
            text="History"
            onClick={() => navigate("History")}
          />
          <ToolbarButton
            icon={<IconTools />}
            text="Settings"
            onClick={() => navigate("Settings")}
          />
        </div>
        <div>
          <div style={{ paddingBottom: 16 }}>
            <div className="_wallet-spin_1px67_19 rc-mode-home__tokens">
              {walletConfig.assets.map((asset, index) => (
                <AssetRow key={index} asset={asset} />
              ))}
            </div>
          </div>
          <div
            className="xwallet-action-button-container"
            style={{ bottom: 88, paddingBottom: 88 }}
          >
            <a href="#rpc-mode/evm/manage-crypto">
              <button
                type="button"
                className="xwallet-btn xwallet-btn-outline-primary xwallet-btn-md xwallet-btn-md-rounded"
              >
                <span className="xwallet-btn-content xwallet-typography-text-sm">
                  <IconEditList />
                  Manage crypto
                </span>
              </button>
            </a>
          </div>
        </div>
      </div>
      <ConnectedFooter walletConfig={walletConfig} />
      <div />
    </>
  );
};

const ConnectedFooter = ({
  walletConfig,
}: {
  walletConfig: {
    footerLogoUrl: string;
    footerUrl: string;
    networkStatus: string;
  };
}) => {
  return (
    <div className="xwallet-main-footer">
      <div className="xwallet-main-footer-container">
        <div className="xwallet-footer-left">
          <div className="xwallet-imgWrapper">
            <picture className="xwallet-picture xwallet-picture-font">
              <source srcSet={walletConfig.footerLogoUrl} />

              <img
                src={walletConfig.footerLogoUrl}
                className="xwallet-imgWrapper-img-footer"
                style={{ width: 44, height: 44 }}
                alt="Dapp Icon"
                width={44}
                height={44}
              />
            </picture>
          </div>
          <div className="xwallet-chain-status-footer-container">
            <div
              className="xwallet-typography-text-default xwallet-typography-text-md xwallet-typography-text-ellipses"
              style={{ fontWeight: 700 }}
            >
              {walletConfig.footerUrl}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "flex-start",
                flexDirection: "row",
              }}
            >
              <div className="xwallet-connectManage">
                <div className="xwallet-typography-text-xs xwallet-typography-text-secondary xwallet-typography-text-ellipses">
                  {walletConfig.networkStatus}
                </div>
                <div className="xwallet-typography-text-xs xwallet-typography-text-secondary xwallet-typography-text-ellipses">
                  ｜
                </div>
                <div
                  className="xwallet-typography-text-default xwallet-typography-text-xs xwallet-typography-text-ellipses"
                  style={{ fontWeight: 500 }}
                >
                  All networks
                </div>
                <i className="icon iconfont xds-arrow-chevron-right-centered-sm _arrowIcon_5veyr_53" />
              </div>
            </div>
          </div>
        </div>
        <div className="xwallet-footer-divider" />
        <div
          data-testid="xwallet-popup"
          className="xwallet-popup xwallet-tooltip xwallet-tooltip-neutral  "
        >
          <div className="xwallet-main-icon-button">
            <IconUnlink className="disconnectIcon" />
          </div>
        </div>
      </div>
    </div>
  );
};

const BalanceWrapper = ({ balance }) => {
  return (
    <div
      className="xwallet-main-balanceWrapper"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        flexDirection: "row",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          flexDirection: "row",
        }}
      >
        <div
          className="xwallet-main-balanceWrapper-title"
          style={{ fontWeight: 500, fontSize: 40 }}
        >
          {balance}
        </div>
      </div>
    </div>
  );
};

const ToolbarButton = ({ icon, text, onClick }) => (
  <div
    className="xwallet-main-toolbar-icon-wrapper"
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",
      flexDirection: "column",
      gap: 13,
      opacity: 1,
      width: 46,
    }}
  >
    <div className="xwallet-main-icon-button" onClick={onClick}>
      {icon}
    </div>
    <div className="xwallet-typography-secondary-text">{text}</div>
  </div>
);

export default HomeScreen;
