import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { setAuthToken, clearAuthData } from '@/app/utils/authUtils';
import { buildApiUrl } from '@/app/utils/apiBase';
import { invalidateProfileCache } from '@/app/hooks/useProfile';

export function useAuthentication() {
     const router = useRouter();

     const checkToken = useCallback(async () => {
          const token = localStorage.getItem('token');
          if (token) {
               try {
                    const response = await fetch(buildApiUrl('/api/users/profile'), {
                         headers: {
                              'Authorization': `Bearer ${token}`
                         }
                    });

                    if (response.ok) {
                         if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/user')) {
                              router.push('/user');
                         }
                         return true;
                    } else {
                         clearAuthData();
                         return false;
                    }
               } catch (error) {
                    console.error('Token check failed:', error);
                    clearAuthData();
                    return false;
               }
          }
          return false;
     }, [router]);

     const handleLogin = useCallback(async (credentials: { email: string; password: string }) => {
          try {
               const response = await fetch(buildApiUrl('/api/users/login'), {
                    method: 'POST',
                    headers: {
                         'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(credentials),
                    credentials: 'include'
               });

               const data = await response.json();

               if (response.ok) {
                    setAuthToken(data.token);
                    invalidateProfileCache();
                    return { success: true, role: data.role };
               } else {
                    return { success: false, error: data.message || 'Login failed' };
               }
          } catch (err) {
               return { success: false, error: 'An error occurred. Please try again.' };
          }
     }, []);

     return { checkToken, handleLogin };
} 