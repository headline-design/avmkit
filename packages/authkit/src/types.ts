import { Languages as Lang } from './localizations';
export type Languages = Lang;

export type Theme =
  | 'auto'
  | 'web95'
  | 'retro'
  | 'soft'
  | 'midnight'
  | 'minimal'
  | 'rounded'
  | 'nouns';
export type Mode = 'light' | 'dark' | 'auto';
export type CustomTheme = any; // TODO: define type

export type All = {
  theme?: Theme;
  mode?: Mode;
  customTheme?: CustomTheme;
  lang?: Languages;
};

export type { AuthKitOptions } from './components/authkit';
export type { CustomAvatarProps } from './avatar/avatar';
