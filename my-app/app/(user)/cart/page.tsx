'use client';

import UserHeaderWrapper from '@/app/(user)/user/UserHeaderWrapper/page';
import styles from './page.module.css';
import { useCart } from '../../hooks/useCart';
import CartContent from './CartContent';

export default function CartPage() {
     const {
          cartItems,
          isLoading,
          error,
          totalAmount,
          handleQuantityChange,
          handleRemoveItem,
          handleClearCart
     } = useCart();

     if (isLoading) {
          return (
               <div className={styles.layout}>
                    <UserHeaderWrapper />
                    <main className={styles.main}>
                         <div className={styles.container}>
                              <p>Loading...</p>
                         </div>
                    </main>
               </div>
          );
     }

     if (error) {
          return (
               <div className={styles.layout}>
                    <UserHeaderWrapper />
                    <main className={styles.main}>
                         <div className={styles.container}>
                              <p className={styles.error}>{error}</p>
                         </div>
                    </main>
               </div>
          );
     }

     return (
          <div className={styles.layout}>
               <UserHeaderWrapper />
               <main className={styles.main}>
                    <div className={styles.container}>
                         <h1 className={styles.title}>Shopping Cart</h1>
                         <CartContent
                              cartItems={cartItems}
                              totalAmount={totalAmount}
                              onQuantityChange={handleQuantityChange}
                              onRemove={handleRemoveItem}
                              onClearCart={handleClearCart}
                         />
                    </div>
               </main>
          </div>
     );
} 