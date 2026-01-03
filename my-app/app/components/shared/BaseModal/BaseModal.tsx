'use client';

import { useEffect } from 'react';
import styles from './BaseModal.module.css';

interface BaseModalProps {
     isOpen: boolean;
     onClose: () => void;
     title: string;
     children: React.ReactNode;
     size?: 'small' | 'medium' | 'large';
}

export default function BaseModal({
     isOpen,
     onClose,
     title,
     children,
     size = 'medium'
}: BaseModalProps) {
     useEffect(() => {
          if (typeof window === 'undefined') return;

          const handleEscape = (e: KeyboardEvent) => {
               if (e.key === 'Escape') {
                    onClose();
               }
          };

          if (isOpen) {
               document.addEventListener('keydown', handleEscape);
               document.body.style.overflow = 'hidden';
          }

          return () => {
               document.removeEventListener('keydown', handleEscape);
               document.body.style.overflow = 'unset';
          };
     }, [isOpen, onClose]);

     if (!isOpen) return null;

     return (
          <div className={styles.modalOverlay} onClick={onClose} data-testid="modal-overlay">
               <div
                    className={`${styles.modal} ${styles[size]}`}
                    onClick={e => e.stopPropagation()}
                    data-testid="modal"
               >
                    <div className={styles.modalHeader} data-testid="modal-header">
                         <h2 data-testid="modal-title">{title}</h2>
                         <button onClick={onClose} className={styles.closeButton} data-testid="modal-close-btn">×</button>
                    </div>
                    <div className={styles.modalContent} data-testid="modal-content">
                         {children}
                    </div>
               </div>
          </div>
     );
} 