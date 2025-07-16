import Link from 'next/link';
import { useCartContext } from '@/app/(user)/cart/CartContext';
import styles from './Navigation.module.css';

interface NavigationProps {
     isAuthenticated: boolean;
}

export default function Navigation({ isAuthenticated }: NavigationProps) {
     const { cartItemCount } = useCartContext();

     return (
          <nav className={styles.navigation}>
               {isAuthenticated ? (
                    <>
                         <Link href="/user/cart" className={styles.link}>
                              Cart ({cartItemCount})
                         </Link>
                    </>
               ) : (
                    <>
                         <Link href="/login" className={styles.link}>
                              Login
                         </Link>
                         <Link href="/register" className={styles.link}>
                              Register
                         </Link>
                    </>
               )}
          </nav>
     );
} 