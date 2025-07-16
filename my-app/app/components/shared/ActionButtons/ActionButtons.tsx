'use client';

import React from 'react';
import styles from './ActionButtons.module.css';

interface ActionButtonsProps {
     onEdit?: () => void;
     onView?: () => void;
     onDelete?: () => void;
     editText?: string;
     viewText?: string;
     deleteText?: string;
     showEdit?: boolean;
     showView?: boolean;
     showDelete?: boolean;
     disabled?: boolean;
}

export default function ActionButtons({
     onEdit,
     onView,
     onDelete,
     editText = 'Edit',
     viewText = 'View',
     deleteText = 'Delete',
     showEdit = true,
     showView = true,
     showDelete = true,
     disabled = false
}: ActionButtonsProps) {
     return (
          <div className={styles.container}>
               {showView && onView && (
                    <button
                         onClick={onView}
                         disabled={disabled}
                         className={`${styles.button} ${styles.viewButton}`}
                         title={viewText}
                    >
                         {viewText}
                    </button>
               )}
               {showEdit && onEdit && (
                    <button
                         onClick={onEdit}
                         disabled={disabled}
                         className={`${styles.button} ${styles.editButton}`}
                         title={editText}
                    >
                         {editText}
                    </button>
               )}
               {showDelete && onDelete && (
                    <button
                         onClick={onDelete}
                         disabled={disabled}
                         className={`${styles.button} ${styles.deleteButton}`}
                         title={deleteText}
                    >
                         {deleteText}
                    </button>
               )}
          </div>
     );
} 