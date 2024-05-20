const IconArrowLeftSmall = ({className} : {
    className?: string;
}) => (
    <svg viewBox="0 0 24 24" width="20px" height="20px"
    className={className}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="m11 17l-5-5m0 0l5-5m-5 5h12"
      />
    </svg>
  )

export default IconArrowLeftSmall;