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
          <div className={styles.overlay}>
               <div className={styles.alert}>
                    <div className={styles.content}>
                         <p className={styles.message}>{message}</p>
                         <div className={styles.buttons}>
                              <button
                                   className={`${styles.button} ${styles.cancelButton}`}
                                   onClick={onClose}
                              >
                                   Cancel
                              </button>
                              <button
                                   className={`${styles.button} ${styles.confirmButton}`}
                                   onClick={() => {
                                        onConfirm();
                                        onClose();
                                   }}
                              >
                                   Delete
                              </button>
                         </div>
                    </div>
               </div>
          </div>
     );
} 