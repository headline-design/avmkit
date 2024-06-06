import IconExclamationCircleFilled from "../icons/exclamation-circle";

const TipMessage = ({ message }: { message: string }) => (
  <div
    className="tip-message"
    style={{
      display: "inline-flex",
      alignItems: "flex-start",
      justifyContent: "flex-start",
      flexDirection: "row",
      gap: 8,
    }}
  >
    <div className="wallet-space-item">
      <div className="wallet-icon-space xwallet-typography-text-default">
        <IconExclamationCircleFilled />
      </div>
    </div>
    <div className="wallet-space-item">
      <div className="xwallet-typography-text xwallet-typography-text-left xwallet-typography-text-sm xwallet-typography-text-default">
        {message}
      </div>
    </div>
    <div className="wallet-space-item_1px67_9" />
  </div>
);

export default TipMessage;
