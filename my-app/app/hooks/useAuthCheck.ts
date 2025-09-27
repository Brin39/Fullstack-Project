import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthHeaders, clearAuthData } from '@/app/utils/authUtils';
import { buildApiUrl } from '@/app/utils/apiBase';
import { getProfile } from '@/app/hooks/useProfile';

export function useAuthCheck() {
     const router = useRouter();

     const checkAuth = useCallback(async () => {
          try {
               const token = localStorage.getItem('token');
               if (!token) {
                    router.replace('/login');
                    return false;
               }

               const data = await getProfile();
               if (!data) {
                    clearAuthData();
                    router.replace('/login');
                    return false;
               }
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