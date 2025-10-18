import { useState, useEffect, useCallback } from 'react';
import { Order } from '@/app/types/order';
import { OrderStatus } from '@/app/utils/orderUtils';
import { useAuth } from './useAuth';
import { buildApiUrl } from '@/app/utils/apiBase';

export function useOrders() {
     const { getAuthHeaders, handleAuthError, checkAuth } = useAuth();
     const [orders, setOrders] = useState<Order[]>([]);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState<string | null>(null);
     const [searchQuery, setSearchQuery] = useState('');

     const fetchOrders = useCallback(async () => {
          try {
               const headers = getAuthHeaders();
               const response = await fetch(buildApiUrl('/api/admin/orders'), {
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
     }, [getAuthHeaders, handleAuthError]);

     useEffect(() => {
          if (!checkAuth()) {
               setError('Please login to access this page');
               setLoading(false);
               return;
          }

          fetchOrders();
     }, [checkAuth, fetchOrders]);



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
               const response = await fetch(buildApiUrl(`/api/admin/orders/${orderId}`), {
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
               const response = await fetch(buildApiUrl(`/api/admin/orders/${orderId}`), {
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

     const normalizedQuery = searchQuery.trim().toLowerCase();
     const filteredOrders = orders.filter(order => {
          const userName = order.user?.name?.toLowerCase() ?? '';
          const userEmail = order.user?.email?.toLowerCase() ?? '';
          const orderId = order._id?.toLowerCase() ?? '';
          return (
               userName.includes(normalizedQuery) ||
               userEmail.includes(normalizedQuery) ||
               orderId.includes(normalizedQuery)
          );
     });

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