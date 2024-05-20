import {
    IconDiscord,
    IconGithub,
    IconTwitter,
    IconGoogle,
    IconCross,
    IconKibisis,
    IconPera,
  } from '@/dashboard/icons';

export const ICON_CLASS = 'w-[32px] h-[32px] mr-3 rounded-lg';
export const BUTTON_CLASS =
  'rounded-full leading-[100%] border button px-3.5 h-[46px] text-skin-link bg-skin-bg button-outline w-full flex justify-center items-center';

export const WEB2_PROVIDERS = [
  {
    id: 'discord',
    name: 'Discord',
    icon: <IconDiscord className={ICON_CLASS} />,
  },
  {
    id: 'google',
    name: 'Google',
    icon: <IconGoogle className={ICON_CLASS} />,
  },
  {
    id: 'github',
    name: 'Github',
    icon: <IconGithub className={ICON_CLASS} />,
  },
  {
    id: 'twitter',
    name: 'Twitter',
    icon: <IconTwitter className={ICON_CLASS} />,
  },
];

export const WEB3_PROVIDERS = [
  {
    id: 'kibisis',
    name: 'Kibisis',
    icon: <IconKibisis className={ICON_CLASS} />,
    connector: 'Kibisis',
  },
  {
    id: 'xwallet',
    name: 'X Wallet',
    icon: <IconCross className={ICON_CLASS} />,
    connector: 'XWallet',
  },
  {
    id: 'pera',
    name: 'Pera',
    icon: <IconPera className={ICON_CLASS} />,
    connector: 'PeraWallet',
  },
];

