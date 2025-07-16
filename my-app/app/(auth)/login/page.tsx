'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthHeader from '../../components/auth/AuthHeader/AuthHeader';
import Footer from '../../components/shared/Footer/Footer';
import RoleSelectModal from '../RoleSelect/page';
import PasswordField from '../../components/auth/PasswordField/PasswordField';
import { useAuthentication } from '../../hooks/useAuthentication';
import styles from './page.module.css';
import formStyles from '../../components/shared.module.css';

export default function LoginPage() {
     const router = useRouter();
     const { checkToken, handleLogin } = useAuthentication();
     const [formData, setFormData] = useState({
          email: '',
          password: ''
     });
     const [error, setError] = useState('');
     const [showRoleModal, setShowRoleModal] = useState(false);

     useEffect(() => {
          checkToken();
     }, [checkToken]);

     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
          setError('');

          const result = await handleLogin(formData);

          if (result.success) {
               if (result.role === 'admin') {
                    setShowRoleModal(true);
               } else {
                    router.push('/user');
               }
          } else {
               setError(result.error || 'Login failed');
          }
     };

     const handleRoleSelect = (role: 'admin' | 'user') => {
          setShowRoleModal(false);
          router.push(role === 'admin' ? '/admin' : '/user');
     };

     return (
          <main>
               <AuthHeader />
               <div className={styles.container}>
                    <h1 className={styles.title}>Login to Your Account</h1>
                    <form onSubmit={handleSubmit} className={formStyles.form}>
                         {error && <div className={formStyles.error}>{error}</div>}
                         <div className={formStyles.formGroup}>
                              <label htmlFor="email">Email</label>
                              <input
                                   type="email"
                                   id="email"
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
                         />
                         <button type="submit" className={formStyles.submitButton}>
                              Login
                         </button>
                    </form>
                    <p className={styles.switchText}>
                         Don't have an account?{' '}
                         <a href="/register" className={styles.switchLink}>
                              Register
                         </a>
                    </p>
               </div>
               <Footer />

               {showRoleModal && <RoleSelectModal onSelect={handleRoleSelect} />}
          </main>
     );
} 