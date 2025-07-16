'use client';

import Logo from './Logo/Logo';
import SearchBar from './SearchBar/SearchBar';
import Navigation from './Navigation/Navigation';
import { useAuthStatus } from '@/app/hooks/useAuthStatus';
import styles from './Header.module.css';

interface HeaderProps {
     hideAuth?: boolean;
     onSearch?: (query: string) => void;
}

export default function Header({ hideAuth = false, onSearch }: HeaderProps) {
     const { isAuthenticated } = useAuthStatus();

     return (
          <header className={styles.header}>
               <Logo isAuthenticated={isAuthenticated} />
               <SearchBar onSearch={onSearch} />
               {!hideAuth && <Navigation isAuthenticated={isAuthenticated} />}
          </header>
     );
} 