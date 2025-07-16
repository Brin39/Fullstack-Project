import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './AdminNavbar.module.css';

const navItems = [
     { path: '/admin/products', label: 'Products' },
     { path: '/admin/orders', label: 'Orders' },
     { path: '/admin/users', label: 'Users' }
];

export default function AdminNavbar() {
     const pathname = usePathname();

     return (
          <nav className={styles.navbar}>
               <ul className={styles.navList}>
                    {navItems.map((item) => (
                         <li key={item.path}>
                              <Link
                                   href={item.path}
                                   className={`${styles.navLink} ${pathname === item.path ? styles.active : ''}`}
                              >
                                   {item.label}
                              </Link>
                         </li>
                    ))}
               </ul>
          </nav>
     );
} 