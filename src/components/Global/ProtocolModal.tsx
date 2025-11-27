import Modal from './Modal';
import '../../css/ProtocolModal.css';

type ModalState = 'loading' | 'error' | 'closed';

interface ProtocolModalProps {
  state: ModalState;
  onClose: () => void;
  onDownload: () => void;
}

export default function ProtocolModal({ state, onClose, onDownload }: ProtocolModalProps) {
  if (state === 'closed') return null;

  return (
    <Modal isOpen={true} onClose={onClose} ariaLabel="Protocol handler status">
      {state === 'loading' && (
        <div className="protocol-modal-content">
          <div className="protocol-modal-spinner"></div>
          <h2 className="protocol-modal-title">Opening AutoStack app...</h2>
          <p className="protocol-modal-text">Please wait a moment</p>
        </div>
      )}

      {state === 'error' && (
        <div className="protocol-modal-content">
          <div className="protocol-modal-error-icon">⚠️</div>
          <h2 className="protocol-modal-title">Unable to open app</h2>
          <p className="protocol-modal-text">
            AutoStack desktop app doesn't appear to be installed
          </p>
          <div className="protocol-modal-actions">
            <button onClick={onDownload} className="protocol-modal-download-btn">
              Download AutoStack
            </button>
            <button onClick={onClose} className="protocol-modal-close-btn">
              Close
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
