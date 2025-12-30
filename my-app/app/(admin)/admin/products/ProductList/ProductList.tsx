import { Product } from '@/app/types/product';
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
          <div className={styles.productsList} data-testid="admin-products-list">
               {products.map((product) => (
                    <div key={product._id} className={styles.productCard} data-testid={`admin-product-row-${product._id}`}>
                         <div className={styles.productInfo}>
                              <div className={styles.productMain}>
                                   <h3 data-testid={`admin-product-name-${product._id}`}>{product.name}</h3>
                                   <p className={styles.productId}>ID: {product._id.slice(-6)}</p>
                              </div>
                              <div className={styles.productDetails}>
                                   <span className={styles.stock} data-testid={`admin-product-stock-${product._id}`}>
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
                                   testIdPrefix={`admin-product-${product._id}`}
                              />
                         </div>
                    </div>
               ))}
          </div>
     );
} 