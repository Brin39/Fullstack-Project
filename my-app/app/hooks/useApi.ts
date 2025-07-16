import { useAuth } from './useAuth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export function useApi() {
     const { getAuthHeaders, handleAuthError } = useAuth();

     const apiCall = async (url: string, options: RequestInit = {}) => {
          try {
               const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
               const headers = getAuthHeaders();
               const response = await fetch(fullUrl, {
                    ...options,
                    headers: {
                         ...headers,
                         ...options.headers,
                    },
               });

               if (handleAuthError(response)) return null;
               return response;
          } catch (error) {
               console.error('API call failed:', error);
               throw error;
          }
     };

     const get = async (url: string) => {
          const response = await apiCall(url);
          if (!response) throw new Error(`GET ${url} failed`);
          return response;
     };

     const post = async (url: string, data: any) => {
          const response = await apiCall(url, {
               method: 'POST',
               body: JSON.stringify(data),
          });
          if (!response) throw new Error(`POST ${url} failed`);
          return response;
     };

     const put = async (url: string, data: any) => {
          const response = await apiCall(url, {
               method: 'PUT',
               body: JSON.stringify(data),
          });
          if (!response) throw new Error(`PUT ${url} failed`);
          return response;
     };

     const del = async (url: string) => {
          const response = await apiCall(url, {
               method: 'DELETE',
          });
          if (!response) throw new Error(`DELETE ${url} failed`);
          return response;
     };

     return {
          get,
          post,
          put,
          del,
          apiCall,
     };
} 