'use client';

import { useState, useEffect } from 'react';
import PasswordField from '../PasswordField/PasswordField';
import styles from '../../shared.module.css';

interface RegisterFormProps {
     onSubmit: (formData: {
          name: string;
          email: string;
          password: string;
          confirmPassword: string;
          adminCode?: string;
     }) => void;
     isAdminMode: boolean;
     error?: string;
}

export default function RegisterForm({ onSubmit, isAdminMode, error }: RegisterFormProps) {
     const [formData, setFormData] = useState({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          adminCode: isAdminMode ? '' : undefined
     });

     useEffect(() => {
          setFormData(prev => ({
               ...prev,
               adminCode: isAdminMode ? '' : undefined
          }));
     }, [isAdminMode]);

     const handleSubmit = (e: React.FormEvent) => {
          e.preventDefault();
          onSubmit(formData);
     };

     return (
          <form onSubmit={handleSubmit} className={styles.form}>
               {error && <div className={styles.error}>{error}</div>}
               <div className={styles.formGroup}>
                    <label htmlFor="name">Name</label>
                    <input
                         type="text"
                         id="name"
                         value={formData.name}
                         onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                         required
                    />
               </div>
               <div className={styles.formGroup}>
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
               <PasswordField
                    id="confirmPassword"
                    label="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={(value) => setFormData({ ...formData, confirmPassword: value })}
                    required
               />
               {isAdminMode && (
                    <PasswordField
                         id="adminCode"
                         label="Admin Code"
                         value={formData.adminCode || ''}
                         onChange={(value) => setFormData({ ...formData, adminCode: value })}
                         required
                    />
               )}
               <button type="submit" className={styles.submitButton}>
                    {isAdminMode ? 'Register as Admin' : 'Register'}
               </button>
          </form>
     );
} 