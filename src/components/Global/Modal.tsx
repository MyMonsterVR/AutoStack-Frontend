import { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import '../../css/Modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  ariaLabel?: string;
  disableBackdropClick?: boolean;
  disableEscapeKey?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  children,
  ariaLabel = 'Modal dialog',
  disableBackdropClick = false,
  disableEscapeKey = false
}: ModalProps) {
  // ESC key handler and body scroll lock
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !disableEscapeKey) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Scroll lock
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, disableEscapeKey]);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !disableBackdropClick) {
      onClose();
    }
  }, [onClose, disableBackdropClick]);

  if (!isOpen) return null;

  return createPortal(
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div
        className="modal-container"
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}
