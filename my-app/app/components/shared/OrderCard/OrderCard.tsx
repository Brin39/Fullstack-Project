import { OrderStatus } from '@/app/utils/orderUtils';
import ActionButtons from '../ActionButtons/ActionButtons';
import OrderInfo from './OrderInfo/OrderInfo';
import CustomerInfo from './CustomerInfo/CustomerInfo';
import OrderItems from './OrderItems/OrderItems';
import OrderSummary from './OrderSummary/OrderSummary';
import { Order } from '@/app/types/order';
import styles from './OrderCard.module.css';

interface OrderCardProps {
     order: Order;
     variant?: 'admin' | 'user';
     onUpdateStatus?: (orderId: string, currentStatus: OrderStatus) => void;
     onDelete?: (orderId: string) => void;
}

export default function OrderCard({
     order,
     variant = 'user',
     onUpdateStatus,
     onDelete
}: OrderCardProps) {
     const hasUser = order.user && variant === 'admin';

     return (
          <div className={styles.orderCard}>
               <OrderInfo
                    orderId={order._id}
                    status={order.status}
                    variant={variant}
               />
               <div className={styles.orderContent}>
                    {hasUser && (
                         <CustomerInfo
                              name={order.user!.name}
                              email={order.user!.email}
                         />
                    )}
                    <OrderItems items={order.items} variant={variant} />
                    <OrderSummary
                         totalAmount={order.totalAmount}
                         createdAt={order.createdAt}
                    />
               </div>
               {variant === 'admin' && onUpdateStatus && onDelete && (
                    <div className={styles.orderActions}>
                         <ActionButtons
                              onEdit={() => onUpdateStatus(order._id, order.status)}
                              onDelete={() => onDelete(order._id)}
                              editText="Update Status"
                              showView={false}
                         />
                    </div>
               )}
          </div>
     );
} 