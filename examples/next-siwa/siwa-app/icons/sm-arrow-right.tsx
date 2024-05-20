const IconArrowRightSmall = ({className} : {
    className?: string;
}) => (
    <svg viewBox="0 0 24 24" width="20px" height="20px"
    className={className || "inline-block"}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="m13 7l5 5m0 0l-5 5m5-5H6"
      />
    </svg>
  )

export default IconArrowRightSmall;