'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from '../../shared.module.css';

interface PasswordFieldProps {
     id: string;
     label: string;
     value: string;
     onChange: (value: string) => void;
     required?: boolean;
     placeholder?: string;
}

export default function PasswordField({
     id,
     label,
     value,
     onChange,
     required = false,
     placeholder
}: PasswordFieldProps) {
     const [showPassword, setShowPassword] = useState(false);

     const togglePasswordVisibility = () => {
          setShowPassword(prev => !prev);
     };

     return (
          <div className={styles.formGroup}>
               <label htmlFor={id}>{label}</label>
               <div className={styles.passwordInput}>
                    <input
                         type={showPassword ? "text" : "password"}
                         id={id}
                         value={value}
                         onChange={(e) => onChange(e.target.value)}
                         required={required}
                         placeholder={placeholder}
                    />
                    <button
                         type="button"
                         className={styles.eyeButton}
                         onClick={togglePasswordVisibility}
                    >
                         <Image
                              src={showPassword ? "/icons/eye-open.svg" : "/icons/eye-closed.svg"}
                              alt={showPassword ? "Hide password" : "Show password"}
                              width={20}
                              height={20}
                         />
                    </button>
               </div>
          </div>
     );
} 