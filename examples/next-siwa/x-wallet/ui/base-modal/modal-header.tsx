import { IconChevronLeft, IconClose } from '../../icons';

export const ModalHeader = ({
  header,
}: {
  header: {
    title: string;
    backButton?: {
      onClick: () => void;
    };
    closeButton?: {
      onClick: () => void;
    };
  };
}) => {
  return (
    <div className="wallet-navigator-wrapper" style={{ zIndex: 1, top: 0, position: 'sticky' }}>
      <div
        className="wallet-navigator"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: 'row',
        }}
      >
        {header.backButton && (
          <div>
            <div
              className="xwallet-wallet-icon xwallet-wallet-icon-button-radius xwallet-icon xwallet-wallet-icon-icon xwallet-wallet-icon-button xwallet-wallet-icon-button-hovered xwallet-wallet-icon-button-upstep"
              onClick={header.backButton.onClick}
            >
              <IconChevronLeft size="24px" className="xwallet-wallet-icon-icon-core" />
            </div>
          </div>
        )}
        <div />
        <div
          className="wallet-navigator-title-wrapper"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
          }}
        >
          <div
            className="wallet-navigator-title"
            style={{
              fontWeight: 500,
              fontSize: 18,
              lineHeight: '24px',
              position: 'relative',
            }}
          >
            <div
              className="xwallet-typography-text xwallet-typography-text-ellipsis xwallet-typography-text-nowrap xwallet-typography-text-center xwallet-typography-text-md xwallet-typography-text-default"
              style={{
                fontWeight: 500,
                fontSize: 18,
                lineHeight: '24px',
                position: 'relative',
              }}
            >
              {header.title}
            </div>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            flexDirection: 'row',
          }}
        >
          {header.closeButton && (
            <div
              className="xwallet-wallet-icon xwallet-wallet-icon-button-radius xwallet-icon xwallet-wallet-icon-icon xwallet-wallet-icon-button xwallet-wallet-icon-button-hovered xwallet-wallet-icon-button-upstep"
              onClick={header.closeButton.onClick}
            >
              <IconClose size="24px" className="xwallet-icon-icon-core" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
