import { useState, useEffect } from 'react';

export interface User {
     _id: string;
     name: string;
     email: string;
     role: string;
     address?: string;
     phone?: string;
     createdAt?: string;
     updatedAt?: string;
}

export interface UserDetails extends User {
     orders?: Array<{
          _id: string;
          totalAmount: number;
          status: string;
          createdAt: string;
          items: Array<{
               product: {
                    _id: string;
                    name: string;
                    price: number;
               };
               quantity: number;
          }>;
     }>;
     totalOrders?: number;
     totalSpent?: number;
}

export const useUsers = () => {
     const [users, setUsers] = useState<User[]>([]);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState<string | null>(null);
     const [searchQuery, setSearchQuery] = useState('');
     const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);
     const [showModal, setShowModal] = useState(false);
     const [loadingUserDetails, setLoadingUserDetails] = useState(false);

     // קבלת כל המשתמשים
     const fetchUsers = async () => {
          try {
               setLoading(true);
               setError(null);

               const token = localStorage.getItem('token');
               if (!token) {
                    setError('Not logged in. Please log in again.');
                    setLoading(false);
                    return;
               }

               const response = await fetch('http://localhost:5000/api/admin/users', {
                    headers: {
                         'Authorization': `Bearer ${token}`,
                         'Content-Type': 'application/json',
                    },
               });

               if (response.ok) {
                    const data = await response.json();
                    setUsers(data.users || data);
               } else {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || `HTTP ${response.status}: Failed to fetch users`);
               }
          } catch (err) {
               console.error('Fetch users error:', err);
               setError(err instanceof Error ? err.message : 'Failed to fetch users');
          } finally {
               setLoading(false);
          }
     };

     // קבלת פרטים מפורטים של משתמש
     const fetchUserDetails = async (userId: string) => {
          try {
               setLoadingUserDetails(true);
               const token = localStorage.getItem('token');
               if (!token) {
                    throw new Error('Not authenticated');
               }

               const url = `http://localhost:5000/api/admin/users/${userId}/details`;
               console.log('Fetching user details from:', url);

               const response = await fetch(url, {
                    headers: {
                         'Authorization': `Bearer ${token}`
                    }
               });

               console.log('Response status:', response.status);
               console.log('Response ok:', response.ok);

               if (response.ok) {
                    const userDetails = await response.json();
                    console.log('User details received:', userDetails);
                    setSelectedUser(userDetails);
               } else {
                    const errorText = await response.text();
                    console.error('Error response:', errorText);
                    throw new Error('Failed to fetch user details');
               }
          } catch (err) {
               console.error('Fetch user details error:', err);
               setError(err instanceof Error ? err.message : 'Failed to fetch user details');
          } finally {
               setLoadingUserDetails(false);
          }
     };

     // מחיקת משתמש
     const handleDeleteUser = async (userId: string) => {
          try {
               const token = localStorage.getItem('token');
               if (!token) {
                    throw new Error('Not authenticated');
               }

               const response = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
                    method: 'DELETE',
                    headers: {
                         'Authorization': `Bearer ${token}`,
                         'Content-Type': 'application/json',
                    },
               });

               if (response.ok) {
                    setUsers(users.filter(user => user._id !== userId));
                    return { success: true };
               } else {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || 'Failed to delete user');
               }
          } catch (err) {
               console.error('Delete user error:', err);
               setError(err instanceof Error ? err.message : 'Failed to delete user');
               return { success: false, error: err instanceof Error ? err.message : 'Failed to delete user' };
          }
     };

     // צפייה בפרטים של משתמש
     const handleViewUser = async (user: User) => {
          setShowModal(true);
          await fetchUserDetails(user._id);
     };

     // סגירת חלון מוליד
     const handleCloseModal = () => {
          setShowModal(false);
          setSelectedUser(null);
     };

     // סינון משתמשים לפי חיפוש
     const filteredUsers = users.filter(user =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user._id.toLowerCase().includes(searchQuery.toLowerCase())
     );

     useEffect(() => {
          fetchUsers();
     }, []);

     return {
          users: filteredUsers,
          loading,
          error,
          searchQuery,
          setSearchQuery,
          selectedUser,
          showModal,
          loadingUserDetails,
          handleDeleteUser,
          handleViewUser,
          handleCloseModal,
          refetch: fetchUsers
     };
}; 