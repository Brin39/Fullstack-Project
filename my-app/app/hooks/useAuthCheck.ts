import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthHeaders, clearAuthData } from '@/app/utils/authUtils';

export function useAuthCheck() {
     const router = useRouter();

     const checkAuth = useCallback(async () => {
          try {
               const token = localStorage.getItem('token');
               if (!token) {
                    router.replace('/login');
                    return false;
               }

               const response = await fetch('http://localhost:5000/api/users/profile', {
                    headers: {
                         'Authorization': `Bearer ${token}`
                    }
               });

               if (!response.ok) {
                    clearAuthData();
                    router.replace('/login');
                    return false;
               }

               const data = await response.json();
               return { isAuthenticated: true, user: data };
          } catch (error) {
               console.error('Auth check failed:', error);
               clearAuthData();
               router.replace('/login');
               return false;
          }
     }, [router]);

     return { checkAuth, getAuthHeaders };
} 