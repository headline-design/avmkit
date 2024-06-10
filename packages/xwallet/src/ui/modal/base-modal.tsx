import React, { useState, useEffect, useRef } from "react";
import Portal from "../portal";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  header: React.ReactNode;
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, header }) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const focusGuardBefore = useRef<HTMLDivElement | null>(null);
  const focusGuardAfter = useRef<HTMLDivElement | null>(null);

  const handleClose = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleFocusTrap = (e: FocusEvent) => {
    if (e.target === focusGuardAfter.current) {
      modalRef.current?.focus();
    }
    if (e.target === focusGuardBefore.current) {
      modalRef.current?.focus();
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      modalRef.current?.focus();
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <Portal selector="modal-root">
      <div className="xwallet-modal-backdrop" onClick={handleClose} />
      <div className="modal-overlay" onClick={handleClose}>
        <div
          className="focus-guard"
          tabIndex={0}
          ref={focusGuardBefore}
          onFocus={handleFocusTrap}
        />
        <div
          className="modal-content xwallet-modal"
          ref={modalRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-header"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="app-content os-win browser-chrome">
            <div className="main-container-wrapper">
              <div id="modal-header">{header}</div>
              <div className="xwallet-base-container">{children}</div>
            </div>
          </div>
        </div>
        <div
          className="focus-guard"
          tabIndex={0}
          ref={focusGuardAfter}
          onFocus={handleFocusTrap}
        />
      </div>
    </Portal>
  );
};

export default Modal;

const styles = `
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: translateY(-20px);
  }
  to {
    transform: translateY(0);
  }
}

.modal-backdrop {
  pointer-events: all;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  opacity: var(--xwallet-portal-opacity);
  transition: opacity .35s cubic-bezier(.645,.045,.355,1);
  background-color: #000;
  pointer-events: none;
  z-index: 4999;
  animation: xWalletfadeInAndOut .35s cubic-bezier(.645,.045,.355,1);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5000;
}

.modal-content {
  flex: 1;
  background-color: var(--xwallet-base-bg);
  width: 100%;
  z-index: 5000;
  animation: slideIn 0.3s;
  outline: none;
  overflow: hidden;
}

.xwallet-base-container {
  height: 600px;
  max-height: 100%;
  overflow-y: auto;
}

@media (min-width: 641px) {
  .modal-content {
    border-radius: 12px;
    box-shadow: var(--xwallet-shadow-md);
    border: 1px solid var(--xwallet-base-border);
    max-width: 360px;
    min-height: 600px;
  }
}


@media (max-width: 640px) {
  .modal-content {
    width: 100%;
    max-width: none;
    max-height: 100vh !important;
    height: 100dvh;
    border-radius: 0;
  }

  .xwallet-base-container {
    max-height: 100%;
    overflow-y: auto;
  }
}
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
