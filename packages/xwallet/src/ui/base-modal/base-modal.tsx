"use client";

import { Dispatch, SetStateAction, useEffect, CSSProperties } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import useBodyClass from "../../hooks/use-body-class";
import useWindowSize from "../../hooks/use-window-resize";
import { cn } from "@/lib/utils";
import useMediaQuery from "@/lib/use-media-query";
import React from "react";

interface ModalProps {
  unstyledModal?: boolean;
  children: React.ReactNode;
  showModal?: boolean;
  setShowModal?: Dispatch<SetStateAction<boolean>>;
  className?: string;
  title?: string;
  header?: React.ReactNode;
  onClose?: () => void;
  preventDefaultClose?: boolean;
  backdropClass?: string;
  handle?: boolean;
  dialogWidth?: string;
}

export const BaseModal: React.FC<ModalProps> = ({
  unstyledModal = false,
  children,
  showModal,
  setShowModal,
  className,
  onClose,
  title,
  header,
  preventDefaultClose,
  backdropClass = "xwallet-modal-backdrop",
  handle = false,
  dialogWidth = "360px",
}) => {
  const { height } = useWindowSize();
  const { isMobile } = useMediaQuery();

  const heightStyle: CSSProperties = {
    height: `${height}px !important`,
  };

  const closeModal = ({ dragged }: { dragged?: boolean } = {}) => {
    if (preventDefaultClose && !dragged) {
      return;
    }
    // fire onClose event if provided
    onClose && onClose();

    // if setShowModal is defined, use it to close modal
    if (setShowModal) {
      setShowModal(false);
    }
  };



  return (
    <DialogPrimitive.Root
      open={setShowModal ? showModal : true}
      onOpenChange={(open) => {
        if (!open) {
          setTimeout(() => closeModal(), 300);
          closeModal();
        }
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn("fixed inset-0 bg-black bg-opacity-25", backdropClass)}
        />
        <DialogPrimitive.Content
          style={{ width: dialogWidth }}
          className={cn(
            unstyledModal ? "" : "xwallet-modal mx-auto w-screen",
            className,
            dialogWidth ? "" : "max-w-md",
          )}
        >
          <div className="app-content os-win browser-chrome">
            <div className="main-container-wrapper">
              {header}
              <div className="xwallet-base-container">{children}</div>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};
