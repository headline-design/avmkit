'use client';

import { createContext, createElement } from 'react';
import { Hydrate } from './hydrater';

export type State = {
  [key: string]: any;
};

export type ResolvedRegister = {
  config: any;
};

export const AVMContext = createContext<ResolvedRegister['config'] | undefined>(undefined);

export type AVMProviderProps = {
  config: ResolvedRegister['config'];
  initialState?: State | undefined;
  reconnectOnMount?: boolean | undefined;
};

export function AVMProvider(parameters: React.PropsWithChildren<AVMProviderProps>) {
  const { children, config } = parameters;

  const props = { value: config };
  return createElement(Hydrate, parameters, createElement(AVMContext.Provider, props, children));
}
