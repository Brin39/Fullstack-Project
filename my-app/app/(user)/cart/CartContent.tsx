import CartItem from './CartItem/CartItem';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';
import { CartProduct } from '@/app/types/cart';
import { buildApiUrl } from '@/app/utils/apiBase';

interface CartContentProps {
     cartItems: CartProduct[];
     totalAmount: number;
     onQuantityChange: (productId: string, quantity: number) => void;
     onRemove: (productId: string) => void;
     onClearCart: () => void;
}

export default function CartContent({
     cartItems,
     totalAmount,
     onQuantityChange,
     onRemove,
     onClearCart
}: CartContentProps) {
     const router = useRouter();

     const handleCheckout = async () => {
          try {
               const token = localStorage.getItem('token');
               if (!token) {
                    router.push('/login');
                    return;
               }

               const response = await fetch(buildApiUrl('/api/orders'), {
                    method: 'POST',
                    headers: {
                         'Content-Type': 'application/json',
                         'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                         items: cartItems.map(item => ({
                              product: item.product._id,
                              quantity: item.quantity
                         })),
                         totalAmount
                    })
               });

               if (!response.ok) {
                    throw new Error('Failed to create order');
               }

               await onClearCart();
               router.push('/user/orders');
          } catch (error) {
               console.error('Error creating order:', error);
               alert('Failed to create order. Please try again.');
          }
     };

     return (
          <div className={styles.content}>
               {cartItems.length === 0 ? (
                    <p className={styles.emptyCart}>Your cart is empty</p>
               ) : (
                    <>
                         <div className={styles.cartItems}>
                              {cartItems.map(item => (
                                   <CartItem
                                        key={item._id}
                                        item={item}
                                        onQuantityChange={onQuantityChange}
                                        onRemove={onRemove}
                                   />
                              ))}
                         </div>
                         <div className={styles.summary}>
                              <h2>Order Summary</h2>
                              <div className={styles.total}>
                                   <span>Total:</span>
                                   <span>${totalAmount.toFixed(2)}</span>
                              </div>
                              <button
                                   className={styles.checkoutButton}
                                   onClick={handleCheckout}
                              >
                                   Proceed to Checkout
                              </button>
                              <button
                                   className={styles.clearCartButton}
                                   onClick={onClearCart}
                              >
                                   Clear Cart
                              </button>
                         </div>
                    </>
               )}
          </div>
     );
} 