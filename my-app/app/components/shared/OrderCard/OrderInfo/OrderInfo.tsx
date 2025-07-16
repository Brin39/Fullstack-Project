import { OrderStatus } from '@/app/utils/orderUtils';
import styles from './OrderInfo.module.css';

interface OrderInfoProps {
     orderId: string;
     status: OrderStatus;
     variant?: 'admin' | 'user';
}

export default function OrderInfo({ orderId, status, variant = 'user' }: OrderInfoProps) {
     const shortOrderId = orderId?.slice(-6) || 'N/A';

     return (
          <div className={styles.orderInfo}>
               <h3>Order #{shortOrderId}</h3>
               <span
                    className={styles.status}
                    style={{
                         backgroundColor: getStatusColor(status)
                    }}
               >
                    {status}
               </span>
               {variant === 'admin' && (
                    <p className={styles.orderId}>ID: {orderId}</p>
               )}
          </div>
     );
}

const getStatusColor = (status: OrderStatus) => {
     const colors = {
          pending: '#F59E0B',
          processing: '#3B82F6',
          shipped: '#8B5CF6',
          delivered: '#10B981',
          cancelled: '#EF4444',
     };
     return colors[status];
}; 