'use client';

import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
     return (
          <footer className={styles.footer}>
               <div className={styles.container}>
                    <div className={styles.section}>
                         <h3 className={styles.title}>About us</h3>
                         <p className={styles.description}>
                              We offer a wide range of high-quality products at affordable prices.
                         </p>
                    </div>

                    <div className={styles.section}>
                         <h3 className={styles.title}>Contacts</h3>
                         <ul className={styles.list}>
                              <li>Email: info@mystore.com</li>
                              <li>Phone: +7 (999) 123-45-67</li>
                              <li>Address: Arad, Shahaf, 123</li>
                         </ul>
                    </div>

                    <div className={styles.section}>
                         <h3 className={styles.title}>Information</h3>
                         <ul className={styles.list}>
                              <li><Link href="/about" className={styles.link}>About us</Link></li>
                              <li><Link href="/delivery" className={styles.link}>Delivery</Link></li>
                              <li><Link href="/returns" className={styles.link}>Returns</Link></li>
                              <li><Link href="/privacy" className={styles.link}>Privacy</Link></li>
                         </ul>
                    </div>
               </div>

               <div className={styles.bottom}>
                    <p className={styles.copyright}>
                         © {new Date().getFullYear()} My Store. All rights reserved.
                    </p>
               </div>
          </footer>
     );
} 