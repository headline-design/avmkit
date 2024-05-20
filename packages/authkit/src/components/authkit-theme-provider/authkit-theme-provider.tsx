import React, { createContext, createElement } from 'react';
import { CustomTheme, Theme } from '../../styles/types';
import { Mode } from '../../types';

type ContextValue = {
  theme?: Theme;
  mode?: Mode;
  customTheme?: CustomTheme;
};

const Context = createContext<ContextValue | null>(null);

type AuthKitThemeProviderProps = {
  children?: React.ReactNode;
  theme?: Theme;
  mode?: Mode;
  customTheme?: CustomTheme;
};

export const AuthKitThemeProvider: React.FC<
  AuthKitThemeProviderProps
> = ({ children, theme = 'auto', mode = 'auto', customTheme }) => {
  const value = {
    theme,
    mode,
    customTheme,
  };

  return createElement(Context.Provider, { value }, <>{children}</>);
};

export const useThemeContext = () => {
  const context = React.useContext(Context);
  if (!context)
    throw Error('AuthKitThemeProvider must be inside a Provider.');
  return context;
};
