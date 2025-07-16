'use client';

import styles from './page.module.css';
import AdminPageLayout from '@/app/components/admin/AdminPageLayout';
import OrderList from './OrderList/OrderList';
import { useOrders } from '@/app/hooks/useOrders';

export default function OrdersPage() {
     const {
          orders,
          loading,
          error,
          searchQuery,
          setSearchQuery,
          handleUpdateStatus,
          handleDeleteOrder
     } = useOrders();

     if (loading) return <div className={styles.loading}>Loading...</div>;
     if (error) return <div className={styles.error}>Error: {error}</div>;

     return (
          <>
               <AdminPageLayout
                    title="Orders Management"
                    searchProps={{
                         placeholder: "Search by customer name, email or order ID...",
                         value: searchQuery,
                         onChange: setSearchQuery
                    }}
                    countProps={{
                         label: "Total",
                         count: orders.length
                    }}
               >
                    <OrderList
                         orders={orders}
                         onUpdateStatus={handleUpdateStatus}
                         onDelete={handleDeleteOrder}
                    />
               </AdminPageLayout>
          </>
     );
} 