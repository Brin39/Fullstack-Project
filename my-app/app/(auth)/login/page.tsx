'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import AuthHeader from '../../components/auth/AuthHeader/AuthHeader';
import Footer from '../../components/shared/Footer/Footer';
import PasswordField from '../../components/auth/PasswordField/PasswordField';
import { useAuthentication } from '../../hooks/useAuthentication';
import styles from './page.module.css';
import formStyles from '../../components/shared.module.css';

function LoginContent() {
     const router = useRouter();
     const { checkToken, handleLogin } = useAuthentication();
     const [formData, setFormData] = useState({
          email: '',
          password: ''
     });
     const [error, setError] = useState('');

     useEffect(() => {
          checkToken();
     }, [checkToken]);

     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
          setError('');

          const result = await handleLogin(formData);

          if (result.success) {
               router.push(result.role === 'admin' ? '/admin' : '/user');
          } else {
               setError(result.error || 'Login failed');
          }
     };

     return (
          <main>
               <AuthHeader />
               <div className={styles.container}>
                    <h1 className={styles.title}>Login to Your Account</h1>
                    <form onSubmit={handleSubmit} className={formStyles.form} data-testid="login-form">
                         {error && <div className={formStyles.error} data-testid="error-message">{error}</div>}
                         <div className={formStyles.formGroup}>
                              <label htmlFor="email">Email</label>
                              <input
                                   type="email"
                                   id="email"
                                   data-testid="email-input"
                                   value={formData.email}
                                   onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                   required
                              />
                         </div>
                         <PasswordField
                              id="password"
                              label="Password"
                              value={formData.password}
                              onChange={(value) => setFormData({ ...formData, password: value })}
                              required
                              testId="password-input"
                         />
                         <button type="submit" className={formStyles.submitButton} data-testid="submit-btn">
                              Login
                         </button>
                    </form>
                    <p className={styles.switchText}>
                         Don&apos;t have an account?{' '}
                         <a href="/register" className={styles.switchLink} data-testid="register-link">
                              Register
                         </a>
                    </p>
               </div>
               <Footer />
          </main>
     );
}

export default function LoginPage() {
     return (
          <Suspense fallback={<div style={{ padding: 16 }}>Loading...</div>}>
               <LoginContent />
          </Suspense>
     );
}