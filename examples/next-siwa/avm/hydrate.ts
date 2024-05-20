type HydrateParameters = {
  initialState?: any | undefined
  reconnectOnMount?: boolean | undefined
}

export function reconnect(config: any) {
  config.setState((x: any) => ({
    ...x,
    status: 'reconnecting',
  }))

  config.connect()
}

export function hydrate(config: any, parameters: HydrateParameters) {
  const { initialState, reconnectOnMount } = parameters

  if (initialState)
    config.setState({
      ...initialState,
      connections: reconnectOnMount ? initialState.connections : new Map(),
      status: reconnectOnMount ? 'reconnecting' : 'disconnected',
    })

  return {
    async onMount() {
      if (config._internal.ssr) {
        await config._internal.store.persist.rehydrate()
        const mipdConnectors = config._internal.mipd
          ?.getProviders()
          .map(config._internal.connectors.providerDetailToConnector)
          .map(config._internal.connectors.setup)
        config._internal.connectors.setState((connectors) => [
          ...connectors,
          ...(mipdConnectors ?? []),
        ])
      }

      if (reconnectOnMount) reconnect(config)
      else if (config.storage)
        // Reset connections that may have been hydrated from storage.
        config.setState((x) => ({
          ...x,
          connections: new Map(),
        }))
    },
  }
}
