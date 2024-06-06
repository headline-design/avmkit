import { useWalletNavigation } from "../hooks/use-wallet-navigation";
import { ModalHeader } from "../ui/base-modal/modal-header";

const ReceiveScreen = () => {
  const navigate = useWalletNavigation();

  const headerConfig = {
    title: "Send Crypto",
    header: true,
    backButton: {
      onClick: () => navigate("Home"),
    },
    closeButton: {
      onClick: () => navigate("Home"),
    },
  };

  return (
    <>
      <ModalHeader header={headerConfig} />
      <div className="receive-screen">
        <h2>Receive Crypto</h2>
        <p>Wallet Address:</p>
        <p>{/* wallet address here */}</p>
        <p>Show QR Code here</p>
      </div>
    </>
  );
};

export default ReceiveScreen;
