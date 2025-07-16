import { Order } from '../types';
import AdminOrderCard from '../OrderCard/OrderCard';
import styles from './OrderList.module.css';

interface OrderListProps {
     orders: Order[];
     onUpdateStatus: (orderId: string, currentStatus: Order['status']) => void;
     onDelete: (orderId: string) => void;
}

export default function OrderList({ orders, onUpdateStatus, onDelete }: OrderListProps) {
     return (
          <div className={styles.ordersList}>
               {orders.map((order) => (
                    <AdminOrderCard
                         key={order._id}
                         order={order}
                         onUpdateStatus={onUpdateStatus}
                         onDelete={onDelete}
                    />
               ))}
          </div>
     );
} 