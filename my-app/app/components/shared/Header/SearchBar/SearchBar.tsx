import { useState, useEffect } from 'react';
import styles from './SearchBar.module.css';

interface SearchBarProps {
     onSearch?: (query: string) => void;
     searchValue?: string; // External control for search value
}

export default function SearchBar({ onSearch, searchValue }: SearchBarProps) {
     const [searchQuery, setSearchQuery] = useState(searchValue || '');

     // Sync with external searchValue prop
     useEffect(() => {
          if (searchValue !== undefined) {
               setSearchQuery(searchValue);
          }
     }, [searchValue]);

     const handleSearch = (e: React.FormEvent) => {
          e.preventDefault();
          const trimmedQuery = searchQuery.trim();
          if (onSearch) {
               // Call onSearch even if empty to reset to initial state
               onSearch(trimmedQuery);
          }
     };

     const handleClear = () => {
          setSearchQuery('');
          if (onSearch) {
               onSearch(''); // Reset to initial state
          }
     };

     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          setSearchQuery(e.target.value);
     };

     return (
          <div className={styles.searchContainer}>
               <form onSubmit={handleSearch} className={styles.searchForm} data-testid="search-form">
                    <input
                         type="text"
                         placeholder="Search for products..."
                         value={searchQuery}
                         onChange={handleInputChange}
                         className={styles.searchInput}
                         data-testid="search-input"
                    />
                    {searchQuery && (
                         <button
                              type="button"
                              onClick={handleClear}
                              className={styles.clearButton}
                              data-testid="search-clear-btn"
                              aria-label="Clear search"
                         >
                              <svg
                                   width="16"
                                   height="16"
                                   viewBox="0 0 16 16"
                                   fill="none"
                                   xmlns="http://www.w3.org/2000/svg"
                              >
                                   <path
                                        d="M12 4L4 12M4 4L12 12"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                   />
                              </svg>
                         </button>
                    )}
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