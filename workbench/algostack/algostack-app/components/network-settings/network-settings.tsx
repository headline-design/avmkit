import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NetworkRow } from "./network-row";
import { Pipeline } from "@avmkit/pipeline";
import { networkConfig } from "@/avm/network-config";
import { cn } from "@/dashboard/lib/utils";
import { Tabs } from "./network-tabs";
import algorandGlobalActions from "@/dashboard/redux/algorand/global/globalActions";
import algorandGlobalSelectors from "@/dashboard/redux/algorand/global/globalSelectors";
import { AlgoLogoUrl, VoiLogoUrl } from "@/use-avm/data-urls";
import { switchNets } from "@/use-avm/utils";
import { getCurrentGlobalPipeState } from "@/algostack-app/utils/functions";

const NetworkSettings = () => {
  const dispatch: any = useDispatch();
  const globalPipeState = useSelector(
    algorandGlobalSelectors.selectCurrentPipeConnectState,
  );
  const isAltChainEnabled = globalPipeState.isAltChainEnabled;
  const isMainNet = globalPipeState.isMainNet;

  const [searchTerm, setSearchTerm] = useState("");
  const [activeNetwork, setActiveNetwork] = useState(null);

  const getNetworkDetails = useCallback((networkName, type) => {
    const networkDetail = networkConfig[networkName]?.[type];
    return networkDetail
      ? {
          ...networkDetail,
          status:
            Pipeline.algod === networkDetail.algod ? "active" : "inactive",
        }
      : undefined;
  }, []);

  const getActiveNetwork = useCallback(() => {
    for (const networkName in networkConfig) {
      for (const type in networkConfig[networkName]) {
        const detail = getNetworkDetails(networkName, type);
        if (detail?.status === "active") {
          return detail;
        }
      }
    }
    return undefined;
  }, [getNetworkDetails]);

  useEffect(() => {
    setActiveNetwork(getActiveNetwork());

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
  }, [getActiveNetwork]);

  const toggleNetwork = (network) => {
    switchNets(network);
    setActiveNetwork(getActiveNetwork());
    dispatch(
      algorandGlobalActions.doPipeConnectChange({
        ...getCurrentGlobalPipeState(globalPipeState),
        isMainNet: network.net === "mainnet",
        isAltChainEnabled: network.name === "Voi Network",
      }),
    );
  };

  const getLogoUrl = (networkDetails) => {
    switch (networkDetails.name) {
      case "Algorand":
        return AlgoLogoUrl;
      case "Voi Network":
        return VoiLogoUrl;
      default:
        return "";
    }
  };

  const generateNetworkTabContent = (type) => {
    const networkComponents = Object.keys(networkConfig)
      .filter((networkKey) =>
        networkConfig[networkKey][type]?.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
      )
      .map((networkKey) => {
        const details = getNetworkDetails(networkKey, type);
        if (details) {
          return (
            <NetworkRow
              onClick={() => toggleNetwork(networkConfig[networkKey][type])}
              key={networkKey}
              network={{ ...details, logoUrl: getLogoUrl(details) }}
              isNetworkActive={activeNetwork?.algod === details.algod}
            />
          );
        }
        return null;
      });

    return (
      <div
        className={cn(
          type === "custom-network"
            ? "xwallet-custom-networks-list-container"
            : "xwallet-list-container",
        )}
      >
        {networkComponents.length > 0 ? (
          networkComponents
        ) : (
          <div key="no-results">No results</div>
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

  const getChainAndNetIndex = () => {
    if (isAltChainEnabled && isMainNet) return 3;
    if (isAltChainEnabled) return 2;
    if (isMainNet) return 1;
    return 0;
  };

  return <Tabs tabs={tabsConfig} defaultIndex={getChainAndNetIndex()} />;
};

export default NetworkSettings;
