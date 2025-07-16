import React from 'react';
import { UserDetails } from '@/app/hooks/useUsers';
import { getRoleColor, getRoleText, getUserInitials, formatUserDate, getUserStatus } from '@/app/utils/userUtils';
import styles from '../page.module.css';

interface UserModalProps {
     user: UserDetails | null;
     isOpen: boolean;
     onClose: () => void;
     loading?: boolean;
}

const UserModal: React.FC<UserModalProps> = ({ user, isOpen, onClose, loading = false }) => {
     if (!isOpen) return null;

     if (loading) {
          return (
               <div className={styles.overlay} onClick={onClose}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                         <div className={styles.modalHeader}>
                              <h2>Loading User Details...</h2>
                              <button className={styles.closeButton} onClick={onClose}>
                                   ✕
                              </button>
                         </div>
                         <div className={styles.modalContent}>
                              <div className={styles.loadingSpinner}>Loading...</div>
                         </div>
                    </div>
               </div>
          );
     }

     if (!user) return null;

     const status = getUserStatus(user);

     return (
          <div className={styles.overlay} onClick={onClose}>
               <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.modalHeader}>
                         <h2>User Details</h2>
                         <button className={styles.closeButton} onClick={onClose}>
                              ✕
                         </button>
                    </div>

                    <div className={styles.modalContent}>
                         <div className={styles.userHeader}>
                              <div className={styles.modalAvatar}>
                                   <span className={styles.modalInitials}>
                                        {getUserInitials(user.name)}
                                   </span>
                              </div>
                              <div className={styles.modalUserInfo}>
                                   <h3 className={styles.modalName}>{user.name}</h3>
                                   <p className={styles.modalEmail}>{user.email}</p>
                                   <div className={styles.modalStatus}>
                                        <span
                                             className={styles.modalStatusDot}
                                             style={{ backgroundColor: status.color }}
                                        />
                                        <span className={styles.modalStatusText}>{status.text}</span>
                                   </div>
                              </div>
                         </div>

                         <div className={styles.details}>
                              <div className={styles.detailRow}>
                                   <span className={styles.label}>ID:</span>
                                   <span className={styles.value}>{user._id}</span>
                              </div>

                              <div className={styles.detailRow}>
                                   <span className={styles.label}>Role:</span>
                                   <span
                                        className={styles.value}
                                        style={{ color: getRoleColor(user.role) }}
                                   >
                                        {getRoleText(user.role)}
                                   </span>
                              </div>

                              {user.phone && (
                                   <div className={styles.detailRow}>
                                        <span className={styles.label}>Phone:</span>
                                        <span className={styles.value}>{user.phone}</span>
                                   </div>
                              )}

                              {user.address && (
                                   <div className={styles.detailRow}>
                                        <span className={styles.label}>Address:</span>
                                        <span className={styles.value}>{user.address}</span>
                                   </div>
                              )}

                              {user.createdAt && (
                                   <div className={styles.detailRow}>
                                        <span className={styles.label}>Created:</span>
                                        <span className={styles.value}>
                                             {formatUserDate(user.createdAt)}
                                        </span>
                                   </div>
                              )}

                              {user.updatedAt && (
                                   <div className={styles.detailRow}>
                                        <span className={styles.label}>Updated:</span>
                                        <span className={styles.value}>
                                             {formatUserDate(user.updatedAt)}
                                        </span>
                                   </div>
                              )}
                         </div>

                         {/*סטטיסטיקות משתמש*/}
                         <div className={styles.userStats}>
                              <h4>User Statistics</h4>
                              <div className={styles.statsGrid}>
                                   <div className={styles.statItem}>
                                        <span className={styles.statLabel}>Total Orders:</span>
                                        <span className={styles.statValue}>{user.totalOrders || 0}</span>
                                   </div>
                                   <div className={styles.statItem}>
                                        <span className={styles.statLabel}>Total Spent:</span>
                                        <span className={styles.statValue}>
                                             ${user.totalSpent ? user.totalSpent.toFixed(2) : '0.00'}
                                        </span>
                                   </div>
                              </div>
                         </div>

                         {/* סטורי פעילות משתמש */}
                         {user.orders && user.orders.length > 0 && (
                              <div className={styles.ordersSection}>
                                   <h4>Order History</h4>
                                   <div className={styles.ordersList}>
                                        {user.orders.map((order) => (
                                             <div key={order._id} className={styles.orderItem}>
                                                  <div className={styles.orderHeader}>
                                                       <span className={styles.orderId}>
                                                            Order #{order._id.slice(-6)}
                                                       </span>
                                                       <span className={styles.orderDate}>
                                                            {formatUserDate(order.createdAt)}
                                                       </span>
                                                       <span className={styles.orderStatus}>
                                                            {order.status}
                                                       </span>
                                                  </div>
                                                  <div className={styles.orderDetails}>
                                                       <span className={styles.orderAmount}>
                                                            ${order.totalAmount.toFixed(2)}
                                                       </span>
                                                       <span className={styles.orderItems}>
                                                            {order.items.length} item(s)
                                                       </span>
                                                  </div>
                                             </div>
                                        ))}
                                   </div>
                              </div>
                         )}

                         {(!user.orders || user.orders.length === 0) && (
                              <div className={styles.noOrders}>
                                   <p>No orders found for this user.</p>
                              </div>
                         )}
                    </div>

                    <div className={styles.modalFooter}>
                         <button className={styles.closeModalButton} onClick={onClose}>
                              Close
                         </button>
                    </div>
               </div>
          </div>
     );
};

export default UserModal; 