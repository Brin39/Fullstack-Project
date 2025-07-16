import { useState, useEffect } from 'react';
import { clearAuthData } from '@/app/utils/authUtils';

export function useAuthStatus() {
     const [isAuthenticated, setIsAuthenticated] = useState(false);

     const checkAuthStatus = async () => {
          try {
               const token = localStorage.getItem('token');
               if (!token) {
                    setIsAuthenticated(false);
                    return;
               }

               const response = await fetch('http://localhost:5000/api/users/profile', {
                    headers: {
                         'Authorization': `Bearer ${token}`
                    }
               });

               if (response.ok) {
                    const data = await response.json();
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