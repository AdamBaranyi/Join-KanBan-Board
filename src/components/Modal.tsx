import { type ReactNode, useEffect, useRef } from "react";
import "./Modal.css";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  hideCloseBtn?: boolean;
};

export default function Modal({
  isOpen,
  onClose,
  children,
  className = "",
  hideCloseBtn = false,
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden"; // prevent background scrolling
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      ref={overlayRef}
      onMouseDown={(e) => {
        // close if click outside modal content
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div className={`modal-content ${className}`}>
        {!hideCloseBtn && (
          <button className="modal-close-btn" onClick={onClose}>
            <img src="/assets/imgs/Close.png" alt="Close" />
          </button>
        )}
        {children}
      </div>
    </div>
  );
}
