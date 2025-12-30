import { useState } from 'react';
import styles from './SearchBar.module.css';

interface SearchBarProps {
     onSearch?: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
     const [searchQuery, setSearchQuery] = useState('');

     const handleSearch = (e: React.FormEvent) => {
          e.preventDefault();
          if (searchQuery.trim() && onSearch) {
               onSearch(searchQuery.trim());
          }
     };

     return (
          <div className={styles.searchContainer}>
               <form onSubmit={handleSearch} className={styles.searchForm} data-testid="search-form">
                    <input
                         type="text"
                         placeholder="Search for products..."
                         value={searchQuery}
                         onChange={(e) => setSearchQuery(e.target.value)}
                         className={styles.searchInput}
                         data-testid="search-input"
                    />
                    <button type="submit" className={styles.searchButton} data-testid="search-btn">
                         <svg
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                         >
                              <path
                                   d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z"
                                   stroke="currentColor"
                                   strokeWidth="2"
                                   strokeLinecap="round"
                                   strokeLinejoin="round"
                              />
                              <path
                                   d="M19 19L14.65 14.65"
                                   stroke="currentColor"
                                   strokeWidth="2"
                                   strokeLinecap="round"
                                   strokeLinejoin="round"
                              />
                         </svg>
                    </button>
               </form>
          </div>
     );
} 