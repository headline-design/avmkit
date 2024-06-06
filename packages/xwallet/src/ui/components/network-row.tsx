import { IconCheckCircleFilled } from "../../icons";

export const NetworkRow = ({ network, isNetworkActive, onClick }) => {
  const hasImage = network.logoUrl && network.logoUrl.trim() !== "";

  console.log("NetworkRow", network);

  return (
    <>
      <div
        onClick={onClick}
        className="xwallet-wallet-list-item xwallet-wallet-list-item-hover xwallet-wallet-list-item-active xwallet-wallet-list-cell xwallet-wallet-list-token"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          flexDirection: "row",
        }}
      >
        {hasImage ? (
          <img
            src={network.logoUrl}
            alt={`${network.name} Logo`}
            className="xwallet-wallet-icon xwallet-wallet-icon-radius xwallet-wallet-icon-lg xwallet-wallet-icon-text xwallet-wallet-icon-text-black xwallet-wallet-text-lg xwallet-wallet-list-cell-icon xwallet-wallet-icon-text-lg"
            style={{ width: 32, height: 32, marginRight: 10, minWidth: 32 }}
          />
        ) : (
          <div className="xwallet-wallet-icon xwallet-wallet-icon-radius xwallet-wallet-icon-lg xwallet-wallet-icon-text xwallet-wallet-icon-text-black xwallet-wallet-text-lg xwallet-wallet-list-cell-icon xwallet-wallet-icon-text-lg">
            {network.name?.charAt(0).toUpperCase()}
          </div>
        )}
        <div
          style={{
            flex: "1 1 0%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
          }}
        >
          <div className="xwallet-wallet-list-token-price-wrap">
            <div
              className="xwallet-typography-text xwallet-typography-text-ellipsis xwallet-typography-text-left xwallet-typography-text-md xwallet-typography-text-default "
              style={{ fontWeight: 500 }}
            >
              {network.name}
            </div>
            {isNetworkActive && (
              <div className="xwallet-wallet-icon ">
                <IconCheckCircleFilled className="xwallet-check-circle" />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
