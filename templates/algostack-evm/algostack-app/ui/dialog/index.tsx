"use client"

import React, { useEffect, FocusEventHandler } from "react";
import Portal from "../portal";
import useMediaQuery from "@/dashboard/lib/hooks/use-media-query";
import styles from "./styles.module.css";
import { cn } from "@/dashboard/lib/utils";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const BaseDialog: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
}) => {
  const modalRef = React.useRef<HTMLDivElement | null>(null);
  const focusGuardBefore = React.useRef<HTMLDivElement | null>(null);
  const focusGuardAfter = React.useRef<HTMLDivElement | null>(null);
  const { isMobile } = useMediaQuery();

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
    if (typeof window !== "undefined" && typeof document !== "undefined") {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        }
      };

      document.addEventListener("keydown", handleEscape);
      return () => {
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [onClose]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      if (isOpen) {
        modalRef.current?.focus();
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <Portal selector="modal-root">
      <div className={styles.dialogBackdrop} onClick={handleClose} />
      <div className={styles.dialogOverlay} onClick={handleClose}>
        <div
          className="focus-guard"
          tabIndex={0}
          ref={focusGuardBefore}
          onFocus={handleFocusTrap as unknown as FocusEventHandler<HTMLDivElement>}
        />
        <div
          className={cn(
            isMobile
              ? "w-full fixed bottom-0 left-0 right-0 z-50 mt-24 overflow-hidden rounded-t-[10px] border-t bg-background rust-modal"
              : "w-[450px]",
            styles.dialogWrapper,
          )}
          ref={modalRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-header"
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
        <div
          className="focus-guard"
          tabIndex={0}
          ref={focusGuardAfter}
          onFocus={handleFocusTrap as unknown as FocusEventHandler<HTMLDivElement>}
        />
      </div>
    </Portal>
  );
};

export default BaseDialog;
