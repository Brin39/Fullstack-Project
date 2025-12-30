'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/app/components/shared/Header/Header';
import { useCartContext } from '@/app/(user)/cart/CartContext';
import { useAuthCheck } from '@/app/hooks/useAuthCheck';
import { clearAuthData } from '@/app/utils/authUtils';
import { buildApiUrl } from '@/app/utils/apiBase';
import styles from './page.module.css';

export default function UserHeaderWrapper() {
     const router = useRouter();
     const { checkAuth } = useAuthCheck();
     const [isDashboardOpen, setIsDashboardOpen] = useState(false);
     const [userName, setUserName] = useState('');
     const dashboardRef = useRef<HTMLDivElement>(null);
     const { cartItemCount, updateCartItemCount } = useCartContext();

     useEffect(() => {
          const checkAuthStatus = async () => {
               const result = await checkAuth();
               if (result && typeof result === 'object' && result.isAuthenticated) {
                    setUserName(result.user.name);
               }
          };

          const fetchCartCount = async () => {
               try {
                    const token = localStorage.getItem('token');
                    if (!token) return;

                    const response = await fetch(buildApiUrl('/api/cart'), {
                         headers: {
                              'Authorization': `Bearer ${token}`
                         }
                    });

                    if (response.ok) {
                         const data = await response.json();
                         updateCartItemCount(data.items ? data.items.length : 0);
                    }
               } catch (error) {
                    console.error('Failed to fetch cart count:', error);
               }
          };

          checkAuthStatus();
          fetchCartCount();
     }, [checkAuth, updateCartItemCount]);

     useEffect(() => {
          const handleClickOutside = (event: MouseEvent) => {
               if (dashboardRef.current && !dashboardRef.current.contains(event.target as Node)) {
                    setIsDashboardOpen(false);
               }
          };

          document.addEventListener('mousedown', handleClickOutside);
          return () => {
               document.removeEventListener('mousedown', handleClickOutside);
          };
     }, []);

     return (
          <div className={styles.wrapper}>
               <div className={styles.headerSection}>
                    <Header hideAuth={true} />
                    <div className={styles.userControls}>
                         <Link href="/cart" className={styles.cartLink} data-testid="cart-link">
                              <div className={styles.cartIconWrapper}>
                                   <img src="/icons/cart.svg" alt="Cart" width={24} height={24} className={styles.icon} />
                                   {cartItemCount > 0 && (
                                        <span className={styles.cartBadge}>{cartItemCount}</span>
                                   )}
                              </div>
                         </Link>
                         <div className={styles.userSection}>
                              <span className={styles.userName}>{userName}</span>
                              <button
                                   className={styles.profileButton}
                                   onClick={() => setIsDashboardOpen(!isDashboardOpen)}
                                   data-testid="profile-button"
                              >
                                   <img src="/icons/profile.svg" alt="Profile" width={24} height={24} className={styles.icon} />
                              </button>
                              {isDashboardOpen && (
                                   <div className={styles.dashboard} ref={dashboardRef} data-testid="user-dashboard">
                                        <Link href="/user/profile" className={styles.dashboardItem} data-testid="dashboard-my-profile">
                                             My profile
                                        </Link>
                                        <Link href="/user/orders" className={styles.dashboardItem} data-testid="dashboard-my-orders">
                                             My orders
                                        </Link>
                                        <button
                                             className={styles.dashboardItem}
                                             onClick={() => {
                                                  clearAuthData();
                                                  window.location.href = '/login';
                                             }}
                                             data-testid="dashboard-logout"
                                        >
                                             Logout
                                        </button>
                                   </div>
                              )}
                         </div>
                    </div>
               </div>
          </div>
     );
} 