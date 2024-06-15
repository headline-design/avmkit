"use client";

import { useLoginModal } from "@/dashboard/components/modals/login-modal/login-modal";
import { Dispatch, ReactNode, SetStateAction, createContext } from "react";

export const ModalContext = createContext<{
  setShowLoginModal: Dispatch<SetStateAction<boolean>>;
  showLoginModal?: boolean;
}>({
  setShowLoginModal: () => {},
  showLoginModal: false,
});

export default function ModalProvider({ children }: { children: ReactNode }) {
  const { setShowLoginModal, showLoginModal, LoginModal } = useLoginModal();

  return (
    <ModalContext.Provider
      value={{
        setShowLoginModal,
        showLoginModal,
      }}
    >
      <LoginModal />
      {children}
    </ModalContext.Provider>
  );
}
