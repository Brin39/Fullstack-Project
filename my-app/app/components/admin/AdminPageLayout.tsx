'use client';

import React from 'react';
import AdminNavbar from '@/app/(admin)/admin/AdminNavbar/AdminNavbar';
import SearchInput from '@/app/components/shared/SearchInput/SearchInput';
import styles from './AdminPageLayout.module.css';

interface AdminPageLayoutProps {
     title: string;
     children: React.ReactNode;
     searchProps?: {
          placeholder: string;
          value: string;
          onChange: (value: string) => void;
     };
     addButtonProps?: {
          text: string;
          onClick: () => void;
     };
     countProps?: {
          label: string;
          count: number;
     };
}

export default function AdminPageLayout({
     title,
     children,
     searchProps,
     addButtonProps,
     countProps
}: AdminPageLayoutProps) {
     return (
          <div className={styles.layout} data-testid="admin-page-layout">
               <AdminNavbar />
               <div className={styles.content}>
                    <div className={styles.header}>
                         <h1 data-testid="admin-page-title">{title}</h1>
                         <div className={styles.actions}>
                              {searchProps && (
                                   <SearchInput
                                        placeholder={searchProps.placeholder}
                                        value={searchProps.value}
                                        onChange={searchProps.onChange}
                                   />
                              )}
                              {countProps && (
                                   <div className={styles.count} data-testid="admin-count">
                                        <span>{countProps.label}: {countProps.count}</span>
                                   </div>
                              )}
                              {addButtonProps && (
                                   <button
                                        className={styles.addButton}
                                        onClick={addButtonProps.onClick}
                                        data-testid="admin-add-btn"
                                   >
                                        {addButtonProps.text}
                                   </button>
                              )}
                         </div>
                    </div>
                    {children}
               </div>
          </div>
     );
} 