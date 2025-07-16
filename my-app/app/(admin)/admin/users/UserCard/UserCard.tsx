import React from 'react';
import { User } from '@/app/hooks/useUsers';
import { getRoleColor, getRoleText, getUserInitials, getUserStatus } from '@/app/utils/userUtils';
import ActionButtons from '@/app/components/shared/ActionButtons/ActionButtons';
import styles from '../page.module.css';

interface UserCardProps {
     user: User;
     onView: (user: User) => void;
     onDelete: (userId: string) => Promise<{ success: boolean; error?: string }>;
}

const UserCard: React.FC<UserCardProps> = ({ user, onView, onDelete }) => {
     const [isDeleting, setIsDeleting] = React.useState(false);
     const status = getUserStatus(user);

     const handleDelete = async () => {
          if (window.confirm('Are you sure you want to delete this user?')) {
               setIsDeleting(true);
               try {
                    const result = await onDelete(user._id);
                    if (!result.success) {
                         alert(`Delete error: ${result.error}`);
                    }
               } finally {
                    setIsDeleting(false);
               }
          }
     };

     return (
          <div className={styles.card}>
               <div className={styles.cardHeader}>
                    <div className={styles.avatar}>
                         <span className={styles.initials}>
                              {getUserInitials(user.name)}
                         </span>
                    </div>
                    <div className={styles.userInfo}>
                         <h3 className={styles.name}>{user.name}</h3>
                         <p className={styles.email}>{user.email}</p>
                         <div className={styles.meta}>
                              <span className={styles.id}>ID: {user._id}</span>
                              <span
                                   className={styles.role}
                                   style={{ color: getRoleColor(user.role) }}
                              >
                                   {getRoleText(user.role)}
                              </span>
                         </div>
                    </div>
                    <div className={styles.status}>
                         <span
                              className={styles.statusDot}
                              style={{ backgroundColor: status.color }}
                         />
                         <span className={styles.statusText}>{status.text}</span>
                    </div>
               </div>

               <div className={styles.actions}>
                    <ActionButtons
                         onView={() => onView(user)}
                         onDelete={handleDelete}
                         disabled={isDeleting}
                         deleteText={isDeleting ? 'Deleting...' : 'Delete'}
                         showEdit={false}
                    />
               </div>
          </div>
     );
};

export default UserCard; 