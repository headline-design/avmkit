import { VectorDataQuery } from "../../pictograms";

export const NoResultsRow = () => (
  <div
    className="xwallet-wallet-empty-container"
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",
      flexDirection: "column",
      height: "100%",
    }}
  >
    <VectorDataQuery className="xwallet-wallet-empty-image" />

    <div
      className="xwallet-typography-text xwallet-typography-text-left xwallet-typography-text-sm xwallet-typography-text-default"
      style={{ color: "rgb(110, 110, 110)", marginTop: 8 }}
    >
      No data found
    </div>
  </div>
);
