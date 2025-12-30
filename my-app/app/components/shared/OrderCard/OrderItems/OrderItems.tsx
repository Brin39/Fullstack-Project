 import styles from './OrderItems.module.css';

interface OrderItem {
     product: {
          _id: string;
          name: string;
          price: number;
          images?: string[];
     } | null;
     quantity: number;
}

interface OrderItemsProps {
     items: OrderItem[];
     variant?: 'admin' | 'user';
     orderId?: string;
}

export default function OrderItems({ items, variant = 'user', orderId }: OrderItemsProps) {
     if (!items || items.length === 0) {
          return null;
     }

     const truncateName = (name: string, maxLength: number = 25) => {
          return name.length > maxLength ? name.substring(0, maxLength) + '...' : name;
     };

     return (
          <div className={styles.items} data-testid={orderId ? `order-items-${orderId}` : 'order-items'}>
               <strong>Items:</strong>
               {items.map((item, index) => {
                    if (!item.product) {
                         return (
                              <div key={`deleted-${index}`} className={styles.item} data-testid="deleted-product-item">
                                   <span className={styles.deletedProduct}>Deleted product</span> x {item.quantity}
                              </div>
                         );
                    }
                    return (
                         <div key={`${item.product._id}-${index}`} className={styles.item} data-testid={`order-item-${item.product._id}`}>
                              {truncateName(item.product.name)} x {item.quantity}
                              {variant === 'user' && (
                                   <span className={styles.itemPrice}>
                                        ${(item.product.price * item.quantity).toFixed(2)}
                                   </span>
                              )}
                         </div>
                    );
               })}
          </div>
     );
} 