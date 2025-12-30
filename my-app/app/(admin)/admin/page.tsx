'use client';

import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function AdminDashboard() {
     const router = useRouter();

     const sections = [
          {
               title: 'Product Management',
               description: 'Adding, editing and deleting products',
               path: '/admin/products',
               icon: '📦'
          },
          {
               title: 'User Management',
               description: 'Viewing and managing system users',
               path: '/admin/users',
               icon: '👥'
          },
          {
               title: 'Order Management',
               description: 'Viewing and processing orders',
               path: '/admin/orders',
               icon: '🛒'
          }
     ];

     return (
          <div className={styles.dashboard} data-testid="admin-dashboard">
               <h1 className={styles.title}>Admin Dashboard</h1>
               <div className={styles.grid} data-testid="admin-cards-grid">
                    {sections.map((section) => (
                         <div
                              key={section.path}
                              className={styles.card}
                              onClick={() => router.push(section.path)}
                              data-testid={`admin-card-${section.path.split('/').pop()}`}
                         >
                              <div className={styles.icon}>{section.icon}</div>
                              <h2 className={styles.cardTitle}>{section.title}</h2>
                              <p className={styles.description}>{section.description}</p>
                         </div>
                    ))}
               </div>
          </div>
     );
} 