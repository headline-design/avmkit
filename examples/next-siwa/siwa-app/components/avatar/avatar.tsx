import React, { useState, useMemo } from 'react';
import classNames from 'classnames';
import styles from './avatar.module.css';

export type EnsAvatarHook = (address: string | undefined) => string | undefined;

export type Props = {
  className?: string;
  as?: 'img' | React.ComponentType;
  label: string;
  placeholder?: boolean;
  address?: string;
  noBorder?: boolean;
  size?: string;
  src?: string;
  ensAvatarHook?: EnsAvatarHook;
  shape?: 'circle' | 'square';
};

export function getAvatarGradient(address = '0') {
  const BACKGROUND_GRADIENTS = [
    {
      color: 'blue',
      value: 'radial-gradient(79.05% 79.05% at 21.62% 20.95%, #007AFF 0%, #00E0FF 100%)',
    },
    {
      color: 'orange',
      value: 'radial-gradient(79.05% 79.05% at 21.62% 20.95%, #FF3B30 0%, #FFA030 100%)',
    },
    {
      color: 'green',
      value: 'radial-gradient(79.05% 79.05% at 21.62% 20.95%, #34C759 34.38%, #7AF599 100%)',
    },
  ] as const;

  // Hash the address to ensure it falls within the valid range
  let hash = 0;
  for (let i = 0; i < address.length; i++) {
    hash = (hash << 5) - hash + address.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }
  const index = Math.abs(hash) % BACKGROUND_GRADIENTS.length;
  return BACKGROUND_GRADIENTS[index];
}

export const Avatar = ({
  as = 'img',
  label,
  placeholder,
  address = '0', // Ensure address has a default value
  noBorder,
  shape = 'circle',
  size = '48px',
  src,
  className,
  ensAvatarHook: useEnsAvatar = () => undefined,
}: Props) => {
  const [error, setError] = useState(false);

  const ensAvatar = useEnsAvatar(address);

  const onError = useMemo(() => {
    if (as !== 'img' || error) {
      return undefined;
    }

    return () => setError(true);
  }, [as, error]);

  const srcOrEns = src ?? ensAvatar ?? undefined;

  const showPlaceholder = placeholder || error || !srcOrEns;

  const gradient = useMemo(() => getAvatarGradient(address), [address]);

  return (
    <div
      className={classNames(
        styles.avatar,
        {
          [styles.noBorder]: showPlaceholder || noBorder,
          [styles.circle]: shape === 'circle',
          [styles.square]: shape === 'square',
        },
        className // Merge className properly
      )}
      style={{
        height: size,
        minWidth: size,
        width: size,
        background: showPlaceholder ? gradient.value : undefined,
      }}
    >
      {!showPlaceholder && (
        <img
          alt={label}
          className={styles.image}
          src={srcOrEns}
          style={{
            height: '100%',
            width: '100%',
            objectFit: 'cover',
          }}
          onError={onError}
        />
      )}
    </div>
  );
};
