import { cn } from '@/dashboard/lib/utils';

export const Footer = ({
  actions,
}: {
  actions: {
    label: string;
    variant: string;
    onClick: () => void;
  }[];
}) => {
  return (
    <div
      className="xwallet-affix"
      style={{ zIndex: 1, position: 'sticky', left: 0, width: 360, bottom: 0 }}
    >
      {actions && (
        <div
          className="xwallet-wallet-footer-actions"
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            flexDirection: 'row',
          }}
        >
          {actions.map((action, index) => (
            <button
              key={index}
              type="button"
              disabled={action.variant === 'disabled'}
              className={cn(
                action.variant === 'primary'
                  ? 'xwallet-btn xwallet-btn-lg xwallet-btn-fill-highlight '
                  : 'xwallet-btn btn-lg xwallet-btn-outline-primary ',
                'xwallet-action-btn',
              )}
              onClick={action.onClick}
            >
              <span className="xwallet-btn-content">{action.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
