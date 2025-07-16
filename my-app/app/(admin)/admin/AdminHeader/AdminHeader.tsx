'use client';

import { useRouter } from 'next/navigation';
import { clearAuthData } from '@/app/utils/authUtils';
import styles from './AdminHeader.module.css';

interface AdminHeaderProps {
     adminName: string;
}

export default function AdminHeader({ adminName }: AdminHeaderProps) {
     const router = useRouter();

     const handleLogout = () => {
          clearAuthData();
          router.push('/');
     };

     return (
          <header className={styles.header}>
               <div className={styles.logo}>
                    <div className={styles.logoContainer}>
                         <svg
                              width="40"
                              height="40"
                              viewBox="0 0 40 40"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className={styles.logoSvg}
                         >
                              <rect width="40" height="40" rx="8" fill="#4F46E5" />
                              <path
                                   d="M20 8L28 16H12L20 8Z"
                                   fill="white"
                              />
                              <path
                                   d="M12 24H28V32H12V24Z"
                                   fill="white"
                              />
                         </svg>
                         <span className={styles.logoText}>MyStore</span>
                    </div>
               </div>
               <div className={styles.adminInfo}>
                    <span className={styles.adminName}>Admin: {adminName}</span>
                    <button onClick={handleLogout} className={styles.logoutButton}>
                         Logout
                    </button>
               </div>
          </header>
     );
} 