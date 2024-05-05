export const NETWORK_STATE = 'networkState';

export const VOI_DOMAIN =
  process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
    ? 'https://voiager.org'
    : process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview'
      ? 'http://localhost:8888'
      : 'http://192.168.1.160:8888';

export const VOI_HOSTNAME =
  process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
    ? 'voiager.org'
    : process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview'
      ? 'localhost'
      : '192.168.1.160';

export const isVoiState = VOI_HOSTNAME;

export const API_DOMAIN =
  process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
    ? 'https://api.voiager.org'
    : process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview'
      ? 'https://api.localhost:8888'
      : 'http://api.localhost:8888';

export const ATLAS_PROJECT_ID = 'cllin9yjd00034jpom83r84dc';

export const ATLAS_DOMAINS = [
  {
    slug: 'voiager.org',
    verified: true,
    primary: true,
    target: 'https://voiager.org',
    type: 'redirect',
    placeholder: 'https://voiager.org',
    allowedHostnames: [],
  },
];
