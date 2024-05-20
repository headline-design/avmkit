import React, { useState, useEffect, useRef } from 'react';

import { EnsAvatar, ImageContainer } from './styles';

import { useContext } from '../components/authkit';
import useIsMounted from '../hooks/useIsMounted';
import { ResetContainer } from '../styles';

type Hash = `0x${string}`;

export type CustomAvatarProps = {
  address?: Hash | undefined;
  ensName?: string | undefined;
  ensImage?: string;
  size: number;
  radius: number;
};

const Avatar: React.FC<{
  address?: Hash | undefined | any;
  name?: string | undefined;
  size?: number;
  radius?: number;
}> = ({ address, name, size = 96, radius = 96 }) => {
  const isMounted = useIsMounted();
  const context = useContext();

  const imageRef = useRef<any>(null);
  const [loaded, setLoaded] = useState(true);

  const dataAvatar = context?.options?.customAvatar;

  const data = {
    address: address,
    name: name,
    avatar: undefined,
  };

  useEffect(() => {
    if (!(imageRef.current && imageRef.current.complete && imageRef.current.naturalHeight !== 0)) {
      setLoaded(false);
    }
  }, [dataAvatar]);

  if (!isMounted) return <div style={{ width: size, height: size, borderRadius: radius }} />;

  if (context?.options?.customAvatar)
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: radius,
          overflow: 'hidden',
        }}
      >
        {context?.options?.customAvatar({
          address: address ?? data?.address,
          ensName: name ?? data?.name,
          ensImage: data?.avatar,
          size,
          radius,
        })}
      </div>
    );

  if (!data.name || !data.avatar)
    return (
      <ResetContainer style={{ pointerEvents: 'none' }}>
        <EnsAvatar $size={size} $seed={data.address} $radius={radius} />
      </ResetContainer>
    );
  return (
    <ResetContainer style={{ pointerEvents: 'none' }}>
      <EnsAvatar $size={size} $seed={data.address} $radius={radius}>
        <ImageContainer
          ref={imageRef}
          src={data.avatar}
          alt={name}
          onLoad={() => setLoaded(true)}
          $loaded={loaded}
        />
      </EnsAvatar>
    </ResetContainer>
  );
};

export default Avatar;
