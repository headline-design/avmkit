const WalletItem = ({ walletAddress }: { walletAddress?: string }) => {
  return (
        <div
          className="_module-wrap-hover_1jm61_13"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}
        >
          <div
            className="xwallet-wallet-space _wallet-space-vertical_1px67_16 _wallet-address-content_1f4s6_1"
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            <div className="wallet-space-item">
              <div
                className="wallet-space-horizontal"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  flexDirection: 'row',
                  gap: 1,
                }}
              >
                <div className="xwallet-wallet-space-item">
                  <div className="xwallet-typography-text-xs xwallet-typography-text-secondary xwallet-typography-text-ellipses">Accounts connected</div>
                </div>
              </div>
            </div>
            <div className="wallet-space-item">
              <div className="module-wrap-content">
                <div
                  className="wallet-space-vertical"
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    flexDirection: 'column',
                    gap: 4,
                  }}
                >
                  <div className="xwallet-wallet-space-item">
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                      }}
                    >
                      <div className="xwallet-typography-text xwallet-typography-text-force-wrap xwallet-typography-text-left xwallet-typography-text-sm xwallet-typography-text-default xwallet-wallet-address-text">
                        {walletAddress || 'All networks'}
                      </div>
                    </div>
                  </div>
                  <div className="wallet-space-item">
                    <div
                      style={{
                        display: 'flex',
                        flexFlow: 'wrap',
                        alignItems: 'flex-start',
                        justifyContent: 'flex-start',
                        gap: 4,
                      }}
                    >
                      <div
                        className="xwallet-wallet-address-tag"
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'flex-start',
                          flexDirection: 'row',
                          gap: 2,
                        }}
                      >
                        <div className="typography-text">Wallet A</div>
                        <div className="typography-text">-</div>
                        <div className="typography-text">Account 01</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="xwallet-wallet-icon xwallet-wallet-icon-radius xwallet-wallet-icon-xs xwallet-wallet-icon undefined"
            style={{ color: 'rgb(146, 146, 146)', cursor: 'pointer' }}
          >
            <i className="icon iconfont xds-arrow-chevron-right-centered-md xwallet-wallet-icon-core" />
          </div>
        </div>
  );
};

export default WalletItem;
