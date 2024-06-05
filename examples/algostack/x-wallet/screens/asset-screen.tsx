const AssetScreen = ({ asset }) => {
    return (
      <div className="asset-screen">
        <h2>Asset Details: {asset.name}</h2>
        <p>Balance: {asset.balance}</p>
        {/* More details like transaction history */}
      </div>
    );
  };

export default AssetScreen;