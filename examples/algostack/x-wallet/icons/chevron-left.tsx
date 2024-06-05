const IconChevronLeft = ({ className, size }: { className?: string; size?: any }) => (
  <svg
    height={size || 16}
    strokeLinejoin="round"
    width={size || 16}
    style={{ color: 'currentcolor' }}
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 19.5 8.25 12l7.5-7.5"
    />
  </svg>
);

export default IconChevronLeft;
