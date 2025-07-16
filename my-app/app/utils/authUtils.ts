export const getAuthHeaders = () => {
     const token = localStorage.getItem('token');
     if (!token) {
          throw new Error('No authentication token found');
     }
     return {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
     };
};

export const checkTokenExists = () => {
     const token = localStorage.getItem('token');
     return !!token;
};

export const setAuthToken = (token: string) => {
     localStorage.setItem('token', token);
     window.dispatchEvent(new Event('localStorageChange'));
};

export const clearAuthData = () => {
     localStorage.removeItem('token');
     window.dispatchEvent(new Event('localStorageChange'));
}; 