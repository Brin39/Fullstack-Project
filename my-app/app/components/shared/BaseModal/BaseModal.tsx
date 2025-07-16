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
          <div className={styles.modalOverlay} onClick={onClose}>
               <div
                    className={`${styles.modal} ${styles[size]}`}
                    onClick={e => e.stopPropagation()}
               >
                    <div className={styles.modalHeader}>
                         <h2>{title}</h2>
                         <button onClick={onClose} className={styles.closeButton}>×</button>
                    </div>
                    <div className={styles.modalContent}>
                         {children}
                    </div>
               </div>
          </div>
     );
} 