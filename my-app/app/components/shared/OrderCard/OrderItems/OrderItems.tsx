import styles from './OrderItems.module.css';

interface OrderItem {
     product: {
          _id: string;
          name: string;
          price: number;
          images?: string[];
     };
     quantity: number;
}

interface OrderItemsProps {
     items: OrderItem[];
     variant?: 'admin' | 'user';
}

export default function OrderItems({ items, variant = 'user' }: OrderItemsProps) {
     if (!items || items.length === 0) {
          return null;
     }

     const truncateName = (name: string, maxLength: number = 25) => {
          return name.length > maxLength ? name.substring(0, maxLength) + '...' : name;
     };

     return (
          <div className={styles.items}>
               <strong>Items:</strong>
               {items.map((item, index) => (
                    <div key={`${item.product._id}-${index}`} className={styles.item}>
                         {truncateName(item.product.name)} x {item.quantity}
                         {variant === 'user' && (
                              <span className={styles.itemPrice}>
                                   ${(item.product.price * item.quantity).toFixed(2)}
                              </span>
                         )}
                    </div>
               ))}
          </div>
     );
} 