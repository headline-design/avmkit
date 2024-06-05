// hooks/useNavigate.js or wherever you keep custom hooks
import { useXWallet } from '../xwallet-context';

export const useWalletNavigation = () => {
  const { setModalState } = useXWallet();

  const navigate = (screenName) => {
    setModalState({
      title: `${screenName} Screen`,
      header: true,
      state: screenName.toLowerCase(),
    });
  };

  return navigate;
};
