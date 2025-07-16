import { Product } from '../types';
import ActionButtons from '@/app/components/shared/ActionButtons/ActionButtons';
import styles from './ProductList.module.css';

interface ProductListProps {
     products: Product[];
     onEdit: (product: Product) => void;
     onView: (product: Product) => void;
     onDelete: (product: Product) => void;
}

export default function ProductList({ products, onEdit, onView, onDelete }: ProductListProps) {
     return (
          <div className={styles.productsList}>
               {products.map((product) => (
                    <div key={product._id} className={styles.productCard}>
                         <div className={styles.productInfo}>
                              <div className={styles.productMain}>
                                   <h3>{product.name}</h3>
                                   <p className={styles.productId}>ID: {product._id.slice(-6)}</p>
                              </div>
                              <div className={styles.productDetails}>
                                   <span className={styles.stock}>
                                        {product.stock > 0 ? 'In stock' : 'Out of stock'}
                                   </span>
                                   <span className={styles.date}>
                                        Created: {new Date(product.createdAt).toLocaleDateString()}
                                   </span>
                                   <span className={styles.date}>
                                        Updated: {new Date(product.updatedAt).toLocaleDateString()}
                                   </span>
                              </div>
                         </div>
                         <div className={styles.actions}>
                              <ActionButtons
                                   onView={() => onView(product)}
                                   onEdit={() => onEdit(product)}
                                   onDelete={() => onDelete(product)}
                              />
                         </div>
                    </div>
               ))}
          </div>
     );
} 