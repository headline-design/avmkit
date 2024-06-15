"use client"

import React, { createContext, useCallback, useContext, useState } from 'react';

interface LoginModalContextData {
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

const LoginModalContext = createContext<LoginModalContextData>({
  isLoginModalOpen: false,
  openLoginModal: () => {},
  closeLoginModal: () => {},
});

const LoginModalProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openLoginModal = useCallback(() => {
    setIsLoginModalOpen(true);
  }, []);

  const closeLoginModal = useCallback(() => {
    setIsLoginModalOpen(false);
  }, []);

  return (
    <LoginModalContext.Provider
      value={{
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
      }}
    >
      {children}
    </LoginModalContext.Provider>
  );
};

function useLoginModal(): LoginModalContextData {
  const context = useContext(LoginModalContext);

  if (!context) {
    throw new Error('useLoginModal must be used within a LoginModalProvider');
  }

  return context;
}

export { LoginModalContext, LoginModalProvider, useLoginModal };
