import styles from './OrderSummary.module.css';

interface OrderSummaryProps {
     totalAmount: number;
     createdAt: string;
     orderId?: string;
}

export default function OrderSummary({ totalAmount, createdAt, orderId }: OrderSummaryProps) {
     return (
          <div className={styles.summary} data-testid={orderId ? `order-summary-${orderId}` : 'order-summary'}>
               <div className={styles.total} data-testid={orderId ? `order-total-${orderId}` : 'order-total'}>
                    <strong>Total:</strong> ${totalAmount.toFixed(2)}
               </div>
               <div className={styles.date} data-testid={orderId ? `order-date-${orderId}` : 'order-date'}>
                    <strong>Date:</strong> {new Date(createdAt).toLocaleDateString()}
               </div>
          </div>
     );
} 