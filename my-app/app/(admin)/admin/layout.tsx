'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminHeader from './AdminHeader/AdminHeader';
import AdminFooter from './AdminFooter/AdminFooter';
import { useAuthCheck } from '@/app/hooks/useAuthCheck';
import styles from './layout.module.css';
import { buildApiUrl } from '@/app/utils/apiBase';

export default function AdminLayout({
     children,
}: {
     children: React.ReactNode;
}) {
     const router = useRouter();
     const { getAuthHeaders } = useAuthCheck();
     const [isLoading, setIsLoading] = useState(true);
     const [adminName, setAdminName] = useState('');
     const [showWelcome, setShowWelcome] = useState(false);

     useEffect(() => {
          const checkAuth = async () => {
               try {
                    const headers = getAuthHeaders();
                    const response = await fetch(buildApiUrl('/api/admin/check-admin'), {
                         headers
                    });

                    if (!response.ok) {
                         console.error('Auth check failed:', await response.text());
                         router.replace('/login');
                         return;
                    }

                    const data = await response.json();
                    console.log('Admin data:', data);
                    setAdminName(data.name || 'Admin');
                    setIsLoading(false);


                    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
                    if (!hasSeenWelcome) {
                         setShowWelcome(true);
                         localStorage.setItem('hasSeenWelcome', 'true');
                         setTimeout(() => {
                              setShowWelcome(false);
                         }, 3000);
                    }
               } catch (error) {
                    console.error('Auth check error:', error);
                    router.replace('/login');
               }
          };

          checkAuth();
     }, [getAuthHeaders, router]);

     if (isLoading) {
          return <div className={styles.loading}>Loading...</div>;
     }

     return (
          <div className={styles.container}>
               <AdminHeader adminName={adminName} />
               <main className={styles.main}>
                    {children}
               </main>
               <AdminFooter />
               {showWelcome && (
                    <div className={styles.welcomeModal}>
                         <div className={styles.welcomeContent}>
                              <h2>Welcome, {adminName}!</h2>
                              <p>You have successfully logged in to the admin panel</p>
                         </div>
                    </div>
               )}
          </div>
     );
} 