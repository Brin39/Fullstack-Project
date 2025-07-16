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
          <div className={styles.modalOverlay}>
               <div className={styles.modal}>
                    <h2>Registration successful!</h2>
                    <p>Now you can log in to your account.</p>
                    <div className={styles.buttonContainer}>
                         <button onClick={handleLoginClick} className={styles.loginButton}>
                              Login
                         </button>
                         <button onClick={onClose} className={styles.closeButton}>
                              Close
                         </button>
                    </div>
               </div>
          </div>
     );
} 