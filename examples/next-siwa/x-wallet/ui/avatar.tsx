function Avatar({ address, className, size }: { address: string, className?: string, size: any}) {
  const avatar = `https://cdn.stamp.fyi/avatar/avm:${address}?s=36`;

  return (
    <img
      src={avatar}
      className={className}
      alt="avatar"
      style={{ width: size, height: size, minWidth: size }}
    />
  );
}

export default Avatar;
