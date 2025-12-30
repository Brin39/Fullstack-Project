import React from 'react';
import styles from './SearchInput.module.css';

interface SearchInputProps {
     placeholder: string;
     value: string;
     onChange: (value: string) => void;
     className?: string;
}

export default function SearchInput({
     placeholder,
     value,
     onChange,
     className = ''
}: SearchInputProps) {
     return (
          <div className={`${styles.search} ${className}`}>
               <input
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={styles.input}
                    data-testid="admin-search-input"
               />
          </div>
     );
} 