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
     testIdPrefix?: string;
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
     disabled = false,
     testIdPrefix
}: ActionButtonsProps) {
     return (
          <div className={styles.container} data-testid={testIdPrefix ? `${testIdPrefix}-actions` : 'action-buttons'}>
               {showView && onView && (
                    <button
                         onClick={onView}
                         disabled={disabled}
                         className={`${styles.button} ${styles.viewButton}`}
                         title={viewText}
                         data-testid={testIdPrefix ? `${testIdPrefix}-view-btn` : 'view-btn'}
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
                         data-testid={testIdPrefix ? `${testIdPrefix}-edit-btn` : 'edit-btn'}
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
                         data-testid={testIdPrefix ? `${testIdPrefix}-delete-btn` : 'delete-btn'}
                    >
                         {deleteText}
                    </button>
               )}
          </div>
     );
} 