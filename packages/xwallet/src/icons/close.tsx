const IconClose = ({ className, size }: { className?: string,  size?: any }) => (
  <svg
    data-testid="geist-icon"
    height={size || 16}
    strokeLinejoin="round"
    width={size ||16}
    style={{ color: 'currentcolor' }}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"

  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18 18 6M6 6l12 12"
    />
  </svg>
);

export default IconClose;
