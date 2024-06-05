import { useXWallet } from "../xwallet-context";

const LoadingScreen = () => {
  const { modalState } = useXWallet();
  return (
    <div className="xwallet-net-loading">
      <div className="xwallet-loading-content">
        <div className="xwallet-loader">
          <div className="xwallet-loader-spin xwallet-loader-spin-xl xwallet-loader-spin-primary" />
        </div>
        <div className="xwallet-net-loading-content-text">{modalState.loadingMessage}</div>
      </div>
    </div>
  );
};
export default LoadingScreen;
