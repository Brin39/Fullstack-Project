import { useState, useEffect } from 'react';
import { Order } from '@/app/(admin)/admin/orders/types';
import { OrderStatus } from '@/app/utils/orderUtils';
import { useAuth } from './useAuth';

export function useOrders() {
     const { getAuthHeaders, handleAuthError, checkAuth } = useAuth();
     const [orders, setOrders] = useState<Order[]>([]);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState<string | null>(null);
     const [searchQuery, setSearchQuery] = useState('');

     useEffect(() => {
          if (!checkAuth()) {
               setError('Please login to access this page');
               setLoading(false);
               return;
          }

          fetchOrders();
     }, []);

     const fetchOrders = async () => {
          try {
               const headers = getAuthHeaders();
               const response = await fetch('http://localhost:5000/api/admin/orders', {
                    headers,
               });

               if (handleAuthError(response)) return;
               if (!response.ok) throw new Error('Failed to fetch orders');

               const data = await response.json();
               setOrders(data);
          } catch (err) {
               setError(err instanceof Error ? err.message : 'Failed to fetch orders');
          } finally {
               setLoading(false);
          }
     };

     const handleUpdateStatus = async (orderId: string, currentStatus: OrderStatus) => {
          const statusTransitions: Record<OrderStatus, OrderStatus> = {
               pending: 'processing',
               processing: 'shipped',
               shipped: 'delivered',
               delivered: 'delivered',
               cancelled: 'cancelled'
          };

          const nextStatus = statusTransitions[currentStatus];

          if (currentStatus === 'delivered' || currentStatus === 'cancelled') {
               alert('Cannot change status of delivered or cancelled orders');
               return;
          }

          if (!confirm(`Change status from ${currentStatus} to ${nextStatus}?`)) {
               return;
          }

          try {
               const headers = getAuthHeaders();
               const response = await fetch(`http://localhost:5000/api/admin/orders/${orderId}`, {
                    method: 'PUT',
                    headers,
                    body: JSON.stringify({ status: nextStatus }),
               });

               if (handleAuthError(response)) return;
               if (!response.ok) {
                    throw new Error('Failed to update order status');
               }

               const updatedOrder = await response.json();
               setOrders(orders.map(order =>
                    order._id === orderId ? updatedOrder : order
               ));
          } catch (err) {
               setError(err instanceof Error ? err.message : 'Failed to update order status');
          }
     };

     const handleDeleteOrder = async (orderId: string) => {
          if (!confirm('Are you sure you want to delete this order?')) {
               return;
          }

          try {
               const headers = getAuthHeaders();
               const response = await fetch(`http://localhost:5000/api/admin/orders/${orderId}`, {
                    method: 'DELETE',
                    headers,
               });

               if (handleAuthError(response)) return;
               if (!response.ok) {
                    throw new Error('Failed to delete order');
               }

               setOrders(orders.filter(order => order._id !== orderId));
          } catch (err) {
               setError(err instanceof Error ? err.message : 'Failed to delete order');
          }
     };

     const filteredOrders = orders.filter(order =>
          order.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order._id.toLowerCase().includes(searchQuery.toLowerCase())
     );

     return {
          orders: filteredOrders,
          loading,
          error,
          searchQuery,
          setSearchQuery,
          handleUpdateStatus,
          handleDeleteOrder
     };
} 