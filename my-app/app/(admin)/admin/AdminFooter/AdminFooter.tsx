import styles from './AdminFooter.module.css';

export default function AdminFooter() {
     return (
          <footer className={styles.footer}>
               <div className={styles.contacts}>
                    <h3>Support Contacts</h3>
                    <div className={styles.contactList}>
                         <div className={styles.contactItem}>
                              <span className={styles.contactTitle}>Technical Support:</span>
                              <span className={styles.contactNumber}>+972 (54) 123-45-67</span>
                         </div>
                         <div className={styles.contactItem}>
                              <span className={styles.contactTitle}>Sales Manager:</span>
                              <span className={styles.contactNumber}>+972 (54) 765-43-21</span>
                         </div>
                         <div className={styles.contactItem}>
                              <span className={styles.contactTitle}>Customer Support Manager:</span>
                              <span className={styles.contactNumber}>+972 (54) 987-65-43</span>
                         </div>
                    </div>
               </div>
          </footer>
     );
} 