export const createConfig = ({ setState, connect, appName, appIcon, appDescription, appUrl, walletConnectProjectId, chains, client, ...props }) => {
  return {
    setState,
    connect,
    appName,
    appIcon,
    appDescription,
    appUrl,
    walletConnectProjectId,
    chains,
    client,
    ...props,
  };
}