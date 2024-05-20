export const AssetRow = ({ asset }) => {
    const hasImage = asset.logoUrl && asset.logoUrl.trim() !== '';
    const tokenFirstLetter = asset.balance.split(' ')[1][0]; // Assumes balance format is 'amount SYMBOL'

    return (
      <a href={asset.detailUrl} className="xwallet-wallet-link" target="_self">
        <div
          className="xwallet-wallet-list-item xwallet-wallet-list-item-hover xwallet-wallet-list-item-active xwallet-wallet-list-cell xwallet-wallet-list-token"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            flexDirection: 'row',
          }}
        >
          {hasImage ? (
            <img
              src={asset.logoUrl}
              alt={`${asset.chainName} Logo`}
              className="xwallet-wallet-icon xwallet-wallet-icon-radius xwallet-wallet-icon-lg xwallet-wallet-icon-text xwallet-wallet-icon-text-black xwallet-wallet-text-lg xwallet-wallet-list-cell-icon xwallet-wallet-icon-text-lg"
              style={{ width: 32, height: 32, marginRight: 10, minWidth: 32 }}
            />
          ) : (
            <div className="xwallet-wallet-icon xwallet-wallet-icon-radius xwallet-wallet-icon-lg xwallet-wallet-icon-text xwallet-wallet-icon-text-black xwallet-wallet-text-lg xwallet-wallet-list-cell-icon xwallet-wallet-icon-text-lg">
              {tokenFirstLetter}
            </div>
          )}
          <div
            style={{
              flex: '1 1 0%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
            }}
          >
            <div className="xwallet-wallet-list-token-title-wrap">
              <div className="xwallet-typography-text-md xwallet-typography-text-ellipses xwallet-typography-text-left">
                {asset.balance}
              </div>
            </div>
            <div className="xwallet-wallet-list-token-price-wrap">
              <div className="xwallet-typography-text-xs" style={{ fontWeight: 500 }}>
                {asset.chainName}
              </div>
            </div>
          </div>
        </div>
      </a>
    );
  };