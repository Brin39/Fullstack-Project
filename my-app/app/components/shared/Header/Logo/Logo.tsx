import Link from 'next/link';
import styles from './Logo.module.css';

interface LogoProps {
     isAuthenticated: boolean;
}

export default function Logo({ isAuthenticated }: LogoProps) {
     return (
          <div className={styles.logo}>
               <Link href={isAuthenticated ? "/user" : "/"} className={styles.logoLink}>
                    <svg
                         width="40"
                         height="40"
                         viewBox="0 0 40 40"
                         fill="none"
                         xmlns="http://www.w3.org/2000/svg"
                         className={styles.logoSvg}
                    >
                         <rect width="40" height="40" rx="8" fill="var(--primary-color)" />
                         <path
                              d="M20 8L28 16H12L20 8Z"
                              fill="white"
                         />
                         <path
                              d="M12 24H28V32H12V24Z"
                              fill="white"
                         />
                    </svg>
                    <span className={styles.logoText}>MyStore</span>
               </Link>
          </div>
     );
} 