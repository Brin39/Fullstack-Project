import styles from './AlertModal.module.css';

interface AlertModalProps {
     isOpen: boolean;
     onClose: () => void;
     onConfirm: () => void;
     message: string;
}

export default function AlertModal({ isOpen, onClose, onConfirm, message }: AlertModalProps) {
     if (!isOpen) return null;

     return (
          <div className={styles.overlay} data-testid="confirm-modal">
               <div className={styles.alert}>
                    <div className={styles.content}>
                         <p className={styles.message} data-testid="confirm-modal-message">{message}</p>
                         <div className={styles.buttons}>
                              <button
                                   className={`${styles.button} ${styles.cancelButton}`}
                                   onClick={onClose}
                                   data-testid="confirm-cancel-btn"
                              >
                                   Cancel
                              </button>
                              <button
                                   className={`${styles.button} ${styles.confirmButton}`}
                                   onClick={() => {
                                        onConfirm();
                                        onClose();
                                   }}
                                   data-testid="confirm-delete-btn"
                              >
                                   Delete
                              </button>
                         </div>
                    </div>
               </div>
          </div>
     );
} 