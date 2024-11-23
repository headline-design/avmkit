"use client";

import { ConnectKitButton } from "connectkit";
import { Button } from "../../../ui";

export default function SIWEConnectFormButton({
  disabled,
}: {
  disabled?: boolean;
}) {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, isConnecting, show, hide, address, ensName, chain }) => {
        return (
          <Button
          className="w-full rounded-full"
          variant="outline"
          size="default"
            onClick={show}
            disabled={isConnecting || disabled}
          >
            {isConnecting
              ? "Connecting..."
              : isConnected
              ? "Connected"
              : "Sign In With Ethereum"}
          </Button>
        );
      }}
    </ConnectKitButton.Custom>
  );
}
