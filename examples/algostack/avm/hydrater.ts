'use client'

import { type ReactElement, useEffect, useRef } from 'react'
import { hydrate } from './hydrate'

export type HydrateProps = {
  config: any;
  initialState?: any | undefined
  reconnectOnMount?: boolean | undefined
}

export function Hydrate(parameters: React.PropsWithChildren<HydrateProps>) {
  const { children, config, initialState, reconnectOnMount = true } = parameters

  const { onMount } = hydrate(config, {
    initialState,
    reconnectOnMount,
  })
  config._internal = config._internal || {};
  // Hydrate for non-SSR
  if (!config._internal.ssr) onMount()

  // Hydrate for SSR
  const active = useRef(true)
  // biome-ignore lint/nursery/useExhaustiveDependencies:
  useEffect(() => {
    if (!active.current) return
    if (!config._internal.ssr) return
    onMount()
    return () => {
      active.current = false
    }
  }, [])

  return children as ReactElement
}
