import styles from './OrderSummary.module.css';

interface OrderSummaryProps {
     totalAmount: number;
     createdAt: string;
}

export default function OrderSummary({ totalAmount, createdAt }: OrderSummaryProps) {
     return (
          <div className={styles.summary}>
               <div className={styles.total}>
                    <strong>Total:</strong> ${totalAmount.toFixed(2)}
               </div>
               <div className={styles.date}>
                    <strong>Date:</strong> {new Date(createdAt).toLocaleDateString()}
               </div>
          </div>
     );
} 