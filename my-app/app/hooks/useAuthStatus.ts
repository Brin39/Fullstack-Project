import { useState, useEffect } from 'react';
import { clearAuthData } from '@/app/utils/authUtils';
import { buildApiUrl } from '@/app/utils/apiBase';
import { getProfile } from '@/app/hooks/useProfile';

export function useAuthStatus() {
     const [isAuthenticated, setIsAuthenticated] = useState(false);

     const checkAuthStatus = async () => {
          try {
               const token = localStorage.getItem('token');
               if (!token) {
                    setIsAuthenticated(false);
                    return;
               }

               const data = await getProfile();
               if (data) {
                    setIsAuthenticated(true);
               } else {
                    clearAuthData();
                    setIsAuthenticated(false);
               }
          } catch (error) {
               console.error('Auth check failed:', error);
               clearAuthData();
               setIsAuthenticated(false);
          }
     };

     useEffect(() => {
          checkAuthStatus();

          const handleStorageChange = (e: StorageEvent) => {
               if (e.key === 'token') {
                    checkAuthStatus();
               }
          };

          const handleStorageChangeSameWindow = () => {
               checkAuthStatus();
          };

          const handleBeforeUnload = () => {
               clearAuthData();
          };

          const handleVisibilityChange = () => {
               if (document.visibilityState === 'hidden') {
               }
          };

          window.addEventListener('storage', handleStorageChange);
          window.addEventListener('localStorageChange', handleStorageChangeSameWindow);
          window.addEventListener('beforeunload', handleBeforeUnload);
          document.addEventListener('visibilitychange', handleVisibilityChange);

          return () => {
               window.removeEventListener('storage', handleStorageChange);
               window.removeEventListener('localStorageChange', handleStorageChangeSameWindow);
               window.removeEventListener('beforeunload', handleBeforeUnload);
               document.removeEventListener('visibilitychange', handleVisibilityChange);
          };
     }, []);

     return { isAuthenticated };
} 