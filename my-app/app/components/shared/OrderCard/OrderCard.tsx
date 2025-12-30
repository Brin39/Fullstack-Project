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
          <div className={styles.orderCard} data-testid={`order-card-${order._id}`}>
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
                    <OrderItems items={order.items} variant={variant} orderId={order._id} />
                    <OrderSummary
                         totalAmount={order.totalAmount}
                         createdAt={order.createdAt}
                         orderId={order._id}
                    />
               </div>
               {variant === 'admin' && onUpdateStatus && onDelete && (
                    <div className={styles.orderActions}>
                         <ActionButtons
                              onEdit={() => onUpdateStatus(order._id, order.status)}
                              onDelete={() => onDelete(order._id)}
                              editText="Update Status"
                              showView={false}
                              testIdPrefix={`order-${order._id}`}
                         />
                    </div>
               )}
          </div>
     );
} 