'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import styles from './AuthModal.module.css';

interface AuthModalProps {
     isOpen: boolean;
     onClose: () => void;
     onAuthSuccess?: () => void;
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
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
          <div className={styles.overlay}>
               <div className={styles.modal}>
                    <button className={styles.closeButton} onClick={onClose}>
                         <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                         >
                              <path
                                   d="M18 6L6 18M6 6L18 18"
                                   stroke="currentColor"
                                   strokeWidth="2"
                                   strokeLinecap="round"
                                   strokeLinejoin="round"
                              />
                         </svg>
                    </button>
                    <h2 className={styles.title}>Authentication Required</h2>
                    <p className={styles.message}>
                         Please sign in or create an account to continue with your purchase.
                    </p>
                    <div className={styles.buttons}>
                         <Link
                              href="/login"
                              className={styles.button}
                              onClick={onAuthSuccess}
                         >
                              Sign In
                         </Link>
                         <Link
                              href="/register"
                              className={styles.button}
                              onClick={onAuthSuccess}
                         >
                              Create Account
                         </Link>
                    </div>
               </div>
          </div>
     );
} 