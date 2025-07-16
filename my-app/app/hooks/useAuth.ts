import { useRouter } from 'next/navigation';
import { getAuthHeaders, checkTokenExists, clearAuthData } from '@/app/utils/authUtils';

export function useAuth() {
     const router = useRouter();

     const handleAuthError = (response: Response) => {
          if (response.status === 401) {
               clearAuthData();
               router.push('/login');
               return true; // Error handled
          }
          return false; // Error not handled
     };

     const checkAuth = () => {
          if (!checkTokenExists()) {
               router.push('/login');
               return false;
          }
          return true;
     };

     return {
          getAuthHeaders,
          handleAuthError,
          checkAuth
     };
} 