'use client';

import styles from './ViewProductModal.module.css';

interface QuantityControlsProps {
     quantity: number;
     onQuantityChange: (quantity: number) => void;
     stock?: number;
     isOutOfStock: boolean;
     total: string | null;
}

export default function QuantityControls({ quantity, onQuantityChange, stock, isOutOfStock, total }: QuantityControlsProps) {
     return (
          <div className={styles.quantity}>
               <div className={styles.labels}>
                    <label htmlFor="quantity">Quantity:</label>
                    {total && <label htmlFor="total">Total:</label>}
               </div>
               <div className={styles.controls}>
                    <div className={styles.quantityControls}>
                         <button
                              className={styles.quantityButton}
                              type="button"
                              onClick={() => onQuantityChange(quantity - 1)}
                              disabled={quantity <= 1 || isOutOfStock}
                         >
                              -
                         </button>
                         <input
                              type="number"
                              id="quantity"
                              value={quantity}
                              onChange={(e) => onQuantityChange(parseInt(e.target.value) || 1)}
                              className={styles.quantityInput}
                              min="1"
                              max={stock}
                              disabled={isOutOfStock}
                         />
                         <button
                              className={styles.quantityButton}
                              type="button"
                              onClick={() => onQuantityChange(quantity + 1)}
                              disabled={isOutOfStock || (stock !== undefined && quantity >= stock)}
                         >
                              +
                         </button>
                    </div>
                    {total && (
                         <div className={styles.total}>
                              ${total}
                         </div>
                    )}
               </div>
          </div>
     );
} 