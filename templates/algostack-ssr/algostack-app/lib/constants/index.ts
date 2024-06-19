export const NETWORK_STATE = 'networkState';

export const HOME_DOMAIN =
  process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
    ? 'https://algostack-ssr.vercel.app'
    : process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview'
      ? 'http://localhost:3000'
      : 'http://192.168.1.160:3000';

export const SIWA_HOSTNAME =
  process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
    ? 'https://algostack-ssr.vercel.app'
    : process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview'
      ? 'localhost'
      : '192.168.1.160';

export const isSiwaState = SIWA_HOSTNAME;

export const API_DOMAIN =
  process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
    ? 'https://api.algostack-ssr.vercel.app'
    : process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview'
      ? 'https://api.localhost:3000'
      : 'http://api.localhost:3000';

export const SIWA_PROJECT_ID = 'cllin9yjd00034jpom83r84dc';

export const SIWA_DOMAINS = [
  {
    slug: 'algostack-ssr.vercel.app',
    verified: true,
    primary: true,
    target: 'https://algostack-ssr.vercel.app',
    type: 'redirect',
    placeholder: 'https://algostack-ssr.vercel.app',
    allowedHostnames: [],
  },
];
