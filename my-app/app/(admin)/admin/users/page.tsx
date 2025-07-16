'use client';

import styles from './page.module.css';
import AdminPageLayout from '@/app/components/admin/AdminPageLayout';
import UserList from './UserList/UserList';
import UserModal from './UserModal/UserModal';
import { useUsers } from '@/app/hooks/useUsers';

export default function UsersPage() {
     const {
          users,
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
          refetch
     } = useUsers();

     const testApi = async () => {
          try {
               const response = await fetch('http://localhost:5000/api/admin/users', {
                    headers: {
                         'Authorization': `Bearer ${localStorage.getItem('token')}`,
                         'Content-Type': 'application/json',
                    },
               });
               console.log('Test API response:', response);
               const data = await response.json();
               console.log('Test API data:', data);
          } catch (err) {
               console.error('Test API error:', err);
          }
     };

     if (loading) return <div className={styles.loading}>Loading...</div>;
     if (error) return (
          <div className={styles.error}>
               Error: {error}
               <button onClick={testApi} style={{ marginLeft: '1rem', padding: '0.5rem 1rem' }}>
                    Test API
               </button>
               <button onClick={refetch} style={{ marginLeft: '1rem', padding: '0.5rem 1rem' }}>
                    Retry
               </button>
          </div>
     );

     return (
          <>
               <AdminPageLayout
                    title="User Management"
                    searchProps={{
                         placeholder: "Search by name, email or ID...",
                         value: searchQuery,
                         onChange: setSearchQuery
                    }}
                    countProps={{
                         label: "Total",
                         count: users.length
                    }}
               >
                    <UserList
                         users={users}
                         onView={handleViewUser}
                         onDelete={handleDeleteUser}
                    />
               </AdminPageLayout>

               <UserModal
                    user={selectedUser}
                    isOpen={showModal}
                    onClose={handleCloseModal}
                    loading={loadingUserDetails}
               />
          </>
     );
} 