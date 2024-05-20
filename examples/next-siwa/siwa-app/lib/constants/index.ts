export const NETWORK_STATE = 'networkState';

export const SIWA_DOMAIN =
  process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
    ? 'https:/siwa.org'
    : process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview'
      ? 'http://localhost:8888'
      : 'http://192.168.1.160:8888';

export const SIWA_HOSTNAME =
  process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
    ? 'siwa.org'
    : process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview'
      ? 'localhost'
      : '192.168.1.160';

export const isSiwaState = SIWA_HOSTNAME;

export const API_DOMAIN =
  process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
    ? 'https://api.siwa.org'
    : process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview'
      ? 'https://api.localhost:8888'
      : 'http://api.localhost:8888';

export const SIWA_PROJECT_ID = 'cllin9yjd00034jpom83r84dc';

export const SIWA_DOMAINS = [
  {
    slug: 'siwa.org',
    verified: true,
    primary: true,
    target: 'https://siwa.org',
    type: 'redirect',
    placeholder: 'https://siwa.org',
    allowedHostnames: [],
  },
];
