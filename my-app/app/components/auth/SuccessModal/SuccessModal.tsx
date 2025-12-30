'use client';

import { useRouter } from 'next/navigation';
import styles from './SuccessModal.module.css';

interface SuccessModalProps {
     isOpen: boolean;
     onClose: () => void;
}

export default function SuccessModal({ isOpen, onClose }: SuccessModalProps) {
     const router = useRouter();

     if (!isOpen) return null;

     const handleLoginClick = () => {
          router.push('/login');
     };

     return (
          <div className={styles.modalOverlay} data-testid="success-modal">
               <div className={styles.modal}>
                    <h2 data-testid="success-message">Registration successful!</h2>
                    <p>Now you can log in to your account.</p>
                    <div className={styles.buttonContainer}>
                         <button onClick={handleLoginClick} className={styles.loginButton} data-testid="modal-login-btn">
                              Login
                         </button>
                         <button onClick={onClose} className={styles.closeButton} data-testid="modal-close-btn">
                              Close
                         </button>
                    </div>
               </div>
          </div>
     );
} 