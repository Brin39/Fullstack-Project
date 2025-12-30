import Link from 'next/link';
import { useCartContext } from '@/app/(user)/cart/CartContext';
import styles from './Navigation.module.css';

interface NavigationProps {
     isAuthenticated: boolean;
}

export default function Navigation({ isAuthenticated }: NavigationProps) {
     const { cartItemCount } = useCartContext();

     return (
          <nav className={styles.navigation} data-testid="navigation">
               {isAuthenticated ? (
                    <>
                         <Link href="/user/cart" className={styles.link} data-testid="cart-link">
                              Cart (<span data-testid="cart-count">{cartItemCount}</span>)
                         </Link>
                    </>
               ) : (
                    <>
                         <Link href="/login" className={styles.link} data-testid="nav-login-link">
                              Login
                         </Link>
                         <Link href="/register" className={styles.link} data-testid="nav-register-link">
                              Register
                         </Link>
                    </>
               )}
          </nav>
     );
} 