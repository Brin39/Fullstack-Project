import { useCallback } from 'react';

export function useRegistration() {
     const handleRegistration = useCallback(async (formData: {
          name: string;
          email: string;
          password: string;
          confirmPassword: string;
          adminCode?: string;
          isAdminMode: boolean;
     }) => {
          if (formData.password !== formData.confirmPassword) {
               return { success: false, error: 'Passwords do not match' };
          }

          try {
               const endpoint = 'http://localhost:5000/api/users/register';
               const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                         'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                         name: formData.name,
                         email: formData.email,
                         password: formData.password,
                         role: formData.isAdminMode ? 'admin' : 'user',
                         ...(formData.isAdminMode && { adminCode: formData.adminCode })
                    }),
                    credentials: 'include'
               });

               const data = await response.json();

               if (response.ok) {
                    return { success: true, data };
               } else {
                    return { success: false, error: data.message || 'Registration failed' };
               }
          } catch (err) {
               console.error('Registration error:', err);
               return { success: false, error: 'An error occurred. Please try again.' };
          }
     }, []);

     return { handleRegistration };
} 