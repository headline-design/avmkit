import { Escrow } from "@avmkit/pipeline";
import React, { useState, useEffect } from "react";
import nacl from "tweetnacl";
import { ModalHeader } from "../ui/modal/modal-header";
import { useWalletNavigation } from "../hooks/use-wallet-navigation";
import { cBuffer, deBuffer, nonce, pad } from "../utils";

const SettingsScreen = () => {
  const [myKey, setMyKey] = useState("");
  const navigate = useWalletNavigation();

  function viewMnemonic() {
    let savedMnemonic = localStorage.getItem("xMnemonic");
    let unpaddedPassword = prompt();
    const paddedPassword = pad(cBuffer(unpaddedPassword));
    try {
      const decryptedArray = nacl.secretbox.open(
        cBuffer(savedMnemonic),
        nonce,
        paddedPassword,
      );
      const unlockedKey = deBuffer(decryptedArray);
      setMyKey(unlockedKey);
      return "success";
    } catch (e) {
      console.error("Incorrect password");
    }
    return null;
  }

  function importMnemonic() {
    let newMnemonicString = prompt();
    let arrayedMnemonic = newMnemonicString?.split(" ");
    let length = arrayedMnemonic?.length;
    if (length !== 25) {
      console.error("Invalid mnemonic");
      return;
    }
    Escrow.importAccount(newMnemonicString);
    console.log("escrow address", Escrow.address);
  }
  const headerConfig = {
    title: "Send Crypto",
    header: true,
    backButton: {
      onClick: () => navigate("Home"),
    },
  };

  return (
    <>
      <ModalHeader header={headerConfig} />
      <div className="settings-screen">
        <button onClick={() => viewMnemonic()}>my key</button>
        {myKey}
        {myKey.length}
        <h2>Settings</h2>
        {/* import */}
        <button onClick={() => importMnemonic()}>import mnemonic</button>
        <p>Configure your wallet and preferences</p>
      </div>
    </>
  );
};

export default SettingsScreen;
