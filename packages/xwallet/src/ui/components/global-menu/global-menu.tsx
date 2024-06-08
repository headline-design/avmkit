import React, { useState } from "react";
import Popover from "../../popover";
import "./popup.css";

import { IconGlobe, IconGear, IconWindow, IconLock } from "../../../icons";

const GlobalMenu = ({ children }: { children: React.ReactNode }) => {
  const [openPopover, setOpenPopover] = useState(false);

  const menuContent = (
    <div className="xwallet-popup-layer-content ">
      <div className="xwallet-select-option xwallet-select-option-pc align-right drop-mode option-md">
        <div className="xwallet-select-option-box">
          <div className="pc-option-scroll">
            <div className="xwallet-select-item-container xwallet-select-item-container-real">
              {menuOptions.map((option) => (
                <div
                  key={option.id}
                  className="xwallet-select-item xwallet-dropdown-option"
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      flexDirection: "row",
                    }}
                  >
                    <div className="xwallet-wallet-icon xwallet-wallet-icon-radius xwallet-wallet-icon-xs xwallet-wallet-optionIcon xwallet-wallet-icon-right-12">
                      {option.icon}
                    </div>
                    <div
                      className="xwallet-typography-text xwallet-typography-text-left xwallet-typography-text-sm xwallet-typography-text-default"
                      style={{ fontWeight: 500 }}
                    >
                      {option.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Popover
      modal={true}
      style={{ zIndex: 6000 }}
      unstyledPopover
      openPopover={openPopover}
      setOpenPopover={setOpenPopover}
      content={menuContent}
      align="end"
      side="bottom"
      contentClassName="your-custom-popover-class"
      triggerClassName="your-trigger-class"
      roundedXl
    >
      {children}
    </Popover>
  );
};

// Define menu options here
const menuOptions = [
  {
    id: 1,
    label: "Settings",
    iconClass: "xwallet-wallet-plugin-settings-2",
    icon: <IconGear />,
  },
  {
    id: 2,
    label: "DApps connection",
    iconClass: "xds-language",
    icon: <IconGlobe />,
  },
  {
    id: 3,
    label: "Go to Dashboard",
    iconClass: "xwallet-wallet-plugin-official-website",
    icon: <IconWindow />,
  },
  {
    id: 4,
    label: "Lock wallet",
    iconClass: "xwallet-wallet-plugin-lock-1",
    icon: <IconLock />,
  },
];

export default GlobalMenu;
