import styles from './page.module.css';

interface RoleSelectModalProps {
     onSelect: (role: 'admin' | 'user') => void;
}

export default function RoleSelectModal({ onSelect }: RoleSelectModalProps) {
     return (
          <div className={styles.modalOverlay}>
               <div className={styles.modal}>
                    <div className={styles.modalButtons}>
                         <button
                              onClick={() => onSelect('admin')}
                              className={styles.modalButton}
                         >
                              Login as Admin
                         </button>
                         <button
                              onClick={() => onSelect('user')}
                              className={styles.modalButton}
                         >
                              Login as User
                         </button>
                    </div>
               </div>
          </div>
     );
} 