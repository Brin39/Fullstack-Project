import React from 'react';
import { User } from '@/app/hooks/useUsers';
import UserCard from '../UserCard/UserCard';
import styles from '../page.module.css';

interface UserListProps {
     users: User[];
     onView: (user: User) => void;
     onDelete: (userId: string) => Promise<{ success: boolean; error?: string }>;
}

const UserList: React.FC<UserListProps> = ({ users, onView, onDelete }) => {
     if (users.length === 0) {
          return (
               <div className={styles.empty}>
                    <div className={styles.emptyIcon}>👥</div>
                    <h3>No Users</h3>
                    <p>No users found in the system</p>
               </div>
          );
     }

     return (
          <div className={styles.container}>
               {users.map((user) => (
                    <UserCard
                         key={user._id}
                         user={user}
                         onView={onView}
                         onDelete={onDelete}
                    />
               ))}
          </div>
     );
};

export default UserList; 