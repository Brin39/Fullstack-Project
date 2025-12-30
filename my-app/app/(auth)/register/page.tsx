'use client';

import { useState, useEffect } from 'react';
import AuthHeader from '../../components/auth/AuthHeader/AuthHeader';
import Footer from '../../components/shared/Footer/Footer';
import RegisterForm from '../../components/auth/RegisterForm/RegisterForm';
import SuccessModal from '../../components/auth/SuccessModal/SuccessModal';
import { useRegistration } from '../../hooks/useRegistration';
import styles from './page.module.css';

export default function RegisterPage() {
     const { handleRegistration } = useRegistration();
     const [error, setError] = useState('');
     const [isAdminMode, setIsAdminMode] = useState(false);
     const [showSuccessModal, setShowSuccessModal] = useState(false);
     const secretSequence = ['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'];

     useEffect(() => {
          if (typeof window === 'undefined') return;

          let currentSequence: string[] = [];
          const handleKeyDown = (e: KeyboardEvent) => {
               currentSequence.push(e.key);
               if (currentSequence.length > secretSequence.length) {
                    currentSequence.shift();
               }

               if (currentSequence.join(',') === secretSequence.join(',')) {
                    setIsAdminMode(true);
                    currentSequence = [];
               }
          };

          window.addEventListener('keydown', handleKeyDown);
          return () => window.removeEventListener('keydown', handleKeyDown);
     }, []);

     const handleSubmit = async (formData: {
          name: string;
          email: string;
          password: string;
          confirmPassword: string;
          adminCode?: string;
     }) => {
          setError('');

          const result = await handleRegistration({
               ...formData,
               isAdminMode
          });

          if (result.success) {
               setShowSuccessModal(true);
          } else {
               setError(result.error || 'Registration failed');
          }
     };

     return (
          <main>
               <AuthHeader />
               <div className={styles.container}>
                    <h1 className={styles.title}>
                         {isAdminMode ? 'Create an Admin Account' : 'Create an Account'}
                    </h1>
                    <RegisterForm
                         onSubmit={handleSubmit}
                         isAdminMode={isAdminMode}
                         error={error}
                    />
                    <p className={styles.switchText}>
                         Already have an account?{' '}
                         <a href="/login" className={styles.switchLink} data-testid="login-link">
                              Login
                         </a>
                    </p>
               </div>
               <Footer />
               <SuccessModal
                    isOpen={showSuccessModal}
                    onClose={() => setShowSuccessModal(false)}
               />
          </main>
     );
} 