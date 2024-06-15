const IconSIWALogo = ({ className, color }: {
  className?: string;
  color?: string;
}) => (
  <>
    <svg
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      className={className}
      color={color || 'currentColor'}
      height={32}
      width={32}
    >
      <rect
        id="_Transparent_Rectangle_"
        width={32}
        height={32}
        fill="none"
        strokeWidth={0}
      />
      <path
        d="M16.7,19.5c.525.875,1.225,1.575,2.275,2.1l2.275,1.05,2.275-1.05c1.75-.875,2.975-2.8,2.975-4.725v-7.875h-5.25v-3.5h8.75v11.375c0,3.325-1.925,6.475-5.075,7.875l-3.85,1.75-3.675-1.75c-2.275-1.05-3.85-2.975-4.55-5.25h3.85001Z"
        fill="currentColor"
        strokeWidth={0}
      />
      <rect
        x={5}
        y="12.5"
        width={13}
        height="3.5"
        fill="currentColor"
        strokeWidth={0}
      />
      <rect
        x={5}
        y="5.5"
        width={13}
        height="3.5"
        fill="currentColor"
        strokeWidth={0}
      />
    </svg>
  </>
);

export default IconSIWALogo;
