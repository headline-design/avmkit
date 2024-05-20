import React, { useEffect, useRef, CSSProperties, Fragment } from 'react';
import { Transition } from '@headlessui/react';
import { createPortal } from 'react-dom';
import useBodyClass from '@/x-wallet/hooks/use-body-class';
import useWindowSize from '@/x-wallet/hooks/use-window-resize';

interface ModalProps {
  backButton?: boolean;
  closeButton?: boolean;
  title?: string;
  open: boolean;
  hideClose?: boolean;

  maxHeight?: string;
  onClose?: () => void;
  header?: any;
  footerSlot?: React.ReactNode | any;
  children?: any;
  style?: string | any;
  atlasUi?: boolean;
}

export const BaseModal: React.FC<ModalProps> = ({
  open,
  backButton,
  closeButton,
  hideClose = false,
  maxHeight = '420px',
  title,
  onClose,
  header,
  style,
  children,
}) => {
  const { height } = useWindowSize();
  const transitionRef = useRef(null);
  const heightStyle: CSSProperties = {
    height: `${height}px !important`,
  };

  useBodyClass('overflow-hidden', open);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleKeydown);
    } else {
      document.removeEventListener('keydown', handleKeydown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [open, onClose]);

  return (
    <>
      {createPortal(
        <>
          <Transition show={open} as={Fragment}>
            {(state) => (
              <div className="modal z-50 mx-auto w-screen" style={style} ref={transitionRef}>
                <div className="backdrop fixed inset-0 bg-black bg-opacity-25" onClick={onClose} />
                <div className="app-content os-win browser-chrome">
                  <div className="main-container-wrapper">
                    {header}
                    <div className="xwallet-base-container">{children}</div>
                  </div>
                </div>
              </div>
            )}
          </Transition>
        </>,
        document.body,
      )}
    </>
  );
};
