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
export const SMALL_ICON_CLASS = 'w-[24px] h-[24px] rounded-lg';
export const BUTTON_CLASS =
  'rounded-full leading-[100%] border button px-3.5 h-[46px] text-skin-link bg-skin-bg button-outline w-full flex justify-center items-center';

export const WEB2_PROVIDERS = [
  {
    id: 'discord',
    name: 'Discord',
    icon: <IconDiscord className={ICON_CLASS} />,
    connector: 'Discord',
    type: 'web2',
  },
  {
    id: 'google',
    name: 'Google',
    icon: <IconGoogle className={ICON_CLASS} />,
    connector: 'Google',
    type: 'web2',
  },
  {
    id: 'github',
    name: 'Github',
    icon: <IconGithub className={ICON_CLASS} />,
    connector: 'Github',
    type: 'web2',
  },
  {
    id: 'twitter',
    name: 'Twitter',
    icon: <IconTwitter className={ICON_CLASS} />,
    connector: 'Twitter',
    type: 'web2',
  },
];

export const WEB3_PROVIDERS = [
  {
    id: 'kibisis',
    name: 'Kibisis',
    icon: <IconKibisis className={ICON_CLASS} />,
    connector: 'Kibisis',
    type: 'web3',
  },
  {
    id: 'xwallet',
    name: 'X Wallet',
    icon: <IconCross className={ICON_CLASS} />,
    connector: 'XWallet',
    type: 'web3',
  },
  {
    id: 'pera',
    name: 'Pera',
    icon: <IconPera className={ICON_CLASS} />,
    connector: 'PeraWallet',
    type: 'web3',
  },
];

export const WEB3_PROVIDERS_SM = [
  {
    id: 'kibisis',
    name: 'Kibisis',
    icon: <IconKibisis className={SMALL_ICON_CLASS} />,
    connector: 'Kibisis',
    type: 'web3',
  },
  {
    id: 'xwallet',
    name: 'X Wallet',
    icon: <IconCross className={SMALL_ICON_CLASS} />,
    connector: 'XWallet',
    type: 'web3',
  },
  {
    id: 'pera',
    name: 'Pera',
    icon: <IconPera className={SMALL_ICON_CLASS} />,
    connector: 'PeraWallet',
    type: 'web3',
  },
];

export const ALL_PROVIDERS = [...WEB2_PROVIDERS, ...WEB3_PROVIDERS];
