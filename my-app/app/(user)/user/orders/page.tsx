'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import UserHeaderWrapper from '../UserHeaderWrapper/page';
import OrderCard from '@/app/components/shared/OrderCard/OrderCard';
import { OrderStatus } from '@/app/utils/orderUtils';
import styles from './page.module.css';
import { buildApiUrl } from '@/app/utils/apiBase';

interface Order {
     _id: string;
     items: {
          product: {
               _id: string;
               name: string;
               price: number;
               images: string[];
          };
          quantity: number;
     }[];
     totalAmount: number;
     status: OrderStatus;
     createdAt: string;
}

export default function OrdersPage() {
     const router = useRouter();
     const [orders, setOrders] = useState<Order[]>([]);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState<string | null>(null);

     useEffect(() => {
          const fetchOrders = async () => {
               try {
                    const token = localStorage.getItem('token');
                    if (!token) {
                         router.replace('/login');
                         return;
                    }

                    const response = await fetch(buildApiUrl('/api/orders/my-orders'), {
                         headers: {
                              'Authorization': `Bearer ${token}`
                         }
                    });

                    if (!response.ok) {
                         throw new Error('Failed to fetch orders');
                    }

                    const data = await response.json();
                    setOrders(data);
               } catch (err) {
                    setError(err instanceof Error ? err.message : 'Failed to fetch orders');
               } finally {
                    setLoading(false);
               }
          };

          fetchOrders();
     }, [router]);

     return (
          <div className={styles.layout}>
               <UserHeaderWrapper />
               <main className={styles.main}>
                    <div className={styles.container}>
                         <h1 className={styles.title}>My Orders</h1>
                         {loading ? (
                              <div className={styles.loading}>Loading...</div>
                         ) : error ? (
                              <div className={styles.error}>{error}</div>
                         ) : orders.length === 0 ? (
                              <div className={styles.noOrders}>
                                   <p>You haven&apos;t placed any orders yet.</p>
                              </div>
                         ) : (
                              <div className={styles.ordersList}>
                                   {orders.map((order) => (
                                        <OrderCard
                                             key={order._id}
                                             order={order}
                                             variant="user"
                                        />
                                   ))}
                              </div>
                         )}
                    </div>
               </main>
          </div>
     );
} 