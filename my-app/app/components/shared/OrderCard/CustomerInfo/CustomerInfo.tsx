import styles from './CustomerInfo.module.css';

interface CustomerInfoProps {
     name: string;
     email: string;
}

export default function CustomerInfo({ name, email }: CustomerInfoProps) {
     return (
          <div className={styles.customer}>
               <strong>Customer:</strong> {name}
               <br />
               <span className={styles.email}>{email}</span>
          </div>
     );
} 