// hooks/useNavigate.js or wherever you keep custom hooks
import { useXWallet } from '../xwallet-context';

export const useWalletNavigation = () => {
  const { setXWalletState } = useXWallet();

  const navigate = (screenName) => {
    setXWalletState({
      title: `${screenName} Screen`,
      header: true,
      state: screenName.toLowerCase(),
    });
  };

  return navigate;
};
