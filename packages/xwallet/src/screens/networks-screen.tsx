import React, { useState, useEffect } from "react";
import { useWalletNavigation } from "../hooks/use-wallet-navigation";
import { ModalHeader } from "../ui/base-modal/modal-header";
import Searchbox from "../ui/components/global-menu/searchbox";
import { Tabs } from "../ui/tabs";
import { useXWallet } from "../xwallet-context";
import { NetworkRow } from "../ui/components/network-row";
import { NoResultsRow } from "../ui/components/no-results-row";
import { Footer } from "../ui/components/footer";
import { cn } from "../lib/utils";
import { switchNets } from "../utils";
import { Pipeline } from "@avmkit/pipeline";

// Import the logos
import { AlgoLogoUrl, VoiLogoUrl } from "../logos/data-urls";

const NetworksScreen = () => {
  const { getNetworkDetails, networks, getActiveNetwork } = useXWallet();
  const navigate = useWalletNavigation();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeNetwork, setActiveNetwork] = useState(getActiveNetwork());

  // Update component state when the active network changes
  useEffect(() => {
    const handleActiveNetworkUpdate = () => {
      setActiveNetwork(getActiveNetwork());
    };

    window.addEventListener("activeNetworkChange", handleActiveNetworkUpdate);

    return () => {
      window.removeEventListener(
        "activeNetworkChange",
        handleActiveNetworkUpdate,
      );
    };
  }, []);

  const headerConfig = {
    title: "Select Network",
    header: true,
    backButton: {
      onClick: () => navigate("Home"),
    },
  };

  function toggle(network) {
    switchNets(network);
    console.log("Network switched to:", network);
    console.log("---algod", Pipeline.algod);
    setActiveNetwork(getActiveNetwork()); // Update local state to trigger re-render
  }

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

  const generateNetworkTabContent = (type) => {
    const networkComponents = Object.keys(networks)
      .filter(
        (networkKey) =>
          networks[networkKey][type] &&
          networks[networkKey][type].name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .map((networkKey) => {
        const details = getNetworkDetails(networkKey, type);

        // Determine the correct logo URL
        const logoUrl = getLogoUrl(details);

        return details ? (
          <NetworkRow
            onClick={() => toggle(networks[networkKey][type])}
            key={networkKey}
            network={{ ...details, logoUrl }} // Pass the logo URL to the network details
            isNetworkActive={activeNetwork?.algod === details.algod}
          />
        ) : null;
      });

    if (networkComponents.length === 0) {
      networkComponents.push(<NoResultsRow key="no-results" />);
    }

    return (
      <div
        className={cn(
          type === "custom-network"
            ? "xwallet-custom-networks-list-container"
            : "xwallet-list-container",
        )}
      >
        {networkComponents}
        {type === "custom-network" && (
          <Footer
            actions={[
              {
                label: "Add Custom Network",
                variant: "primary",
                onClick: () => navigate("AddNetwork"),
              },
            ]}
          />
        )}
      </div>
    );
  };

  const tabsConfig = [
    { title: "Mainnet", content: generateNetworkTabContent("mainnet") },
    { title: "Testnet", content: generateNetworkTabContent("testnet") },
    {
      title: "Custom Networks",
      content: generateNetworkTabContent("custom-network"),
    },
  ];

  return (
    <>
      <ModalHeader header={headerConfig} />
      <Searchbox onSearch={setSearchTerm} />
      <Tabs tabs={tabsConfig} />
    </>
  );
};

export default NetworksScreen;
