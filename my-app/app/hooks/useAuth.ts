import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { getAuthHeaders, checkTokenExists, clearAuthData } from '@/app/utils/authUtils';

export function useAuth() {
     const router = useRouter();

     const handleAuthError = useCallback((response: Response) => {
          if (response.status === 401) {
               clearAuthData();
               router.push('/login');
               return true; // Error handled
          }
          return false; // Error not handled
     }, [router]);

     const checkAuth = useCallback(() => {
          if (!checkTokenExists()) {
               router.push('/login');
               return false;
          }
          return true;
     }, [router]);

     return {
          getAuthHeaders,
          handleAuthError,
          checkAuth
     };
} 