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
          <div className={styles.card} data-testid={`admin-user-row-${user._id}`}>
               <div className={styles.cardHeader}>
                    <div className={styles.avatar}>
                         <span className={styles.initials}>
                              {getUserInitials(user.name)}
                         </span>
                    </div>
                    <div className={styles.userInfo}>
                         <h3 className={styles.name} data-testid={`admin-user-name-${user._id}`}>{user.name}</h3>
                         <p className={styles.email} data-testid={`admin-user-email-${user._id}`}>{user.email}</p>
                         <div className={styles.meta}>
                              <span className={styles.id}>ID: {user._id}</span>
                              <span
                                   className={styles.role}
                                   style={{ color: getRoleColor(user.role) }}
                                   data-testid={`admin-user-role-${user._id}`}
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
                         <span className={styles.statusText} data-testid={`admin-user-status-${user._id}`}>{status.text}</span>
                    </div>
               </div>

               <div className={styles.actions}>
                    <ActionButtons
                         onView={() => onView(user)}
                         onDelete={handleDelete}
                         disabled={isDeleting}
                         deleteText={isDeleting ? 'Deleting...' : 'Delete'}
                         showEdit={false}
                         testIdPrefix={`admin-user-${user._id}`}
                    />
               </div>
          </div>
     );
};

export default UserCard; 