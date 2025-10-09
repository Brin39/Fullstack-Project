'use client';

import { useState, memo, useCallback } from 'react';
import Image from 'next/image';
import ProductInfoModal from '@/app/components/shared/ProductInfoModal/ProductInfoModal';
import ActionButtons from '@/app/components/shared/ActionButtons/ActionButtons';
import styles from './CartItem.module.css';

interface CartItemProps {
     item: {
          _id: string;
          product: {
               _id: string;
               name: string;
               price: number;
               images: string[];
               description: string;
               stock?: number;
               bestOffer?: boolean;
          };
          quantity: number;
     };
     onQuantityChange: (productId: string, quantity: number) => void;
     onRemove: (productId: string) => void;
}

const CartItem = memo<CartItemProps>(({ item, onQuantityChange, onRemove }) => {
     const [isViewModalOpen, setIsViewModalOpen] = useState(false);

     const total = (item.product.price * item.quantity).toFixed(2);
     const isInStock = (item.product.stock || 0) > 0;
     const stockStatus = isInStock ? 'In Stock' : 'Out of Stock';

     const handleQuantityChange = (newQuantity: number) => {
          if (newQuantity >= 1 && newQuantity <= (item.product.stock || 999)) {
               onQuantityChange(item.product._id, newQuantity);
          }
     };

     const handleOpenViewModal = () => setIsViewModalOpen(true);
     const handleCloseViewModal = () => setIsViewModalOpen(false);

     const handleRemove = useCallback(() => {
          onRemove(item.product._id);
     }, [onRemove, item.product._id]);

     return (
          <>
               <div className={styles.cartItem}>
                    <div className={styles.leftSection}>
                         <div className={styles.imageContainer}>
                              <Image
                                   src={item.product.images[0] || '/placeholder-image.jpg'}
                                   alt={item.product.name}
                                   width={80}
                                   height={80}
                                   className={styles.image}
                              />
                              {item.product.bestOffer && (
                                   <div className={styles.bestOfferBadge}>
                                        <span>🔥 Best Offer!</span>
                                   </div>
                              )}
                         </div>
                         <div className={styles.productInfo}>
                              <h3 className={styles.productName}>{item.product.name}</h3>
                              <p className={styles.productDescription}>
                                   {item.product.description}
                              </p>
                              <div className={styles.quantityControls}>
                                   <button
                                        className={styles.quantityButton}
                                        onClick={() => handleQuantityChange(item.quantity - 1)}
                                        disabled={item.quantity <= 1}
                                   >
                                        -
                                   </button>
                                   <span className={styles.quantity}>{item.quantity}</span>
                                   <button
                                        className={styles.quantityButton}
                                        onClick={() => handleQuantityChange(item.quantity + 1)}
                                        disabled={item.quantity >= (item.product.stock || 999)}
                                   >
                                        +
                                   </button>
                              </div>
                         </div>
                    </div>
                    <div className={styles.rightSection}>
                         <div className={styles.topRight}>
                              <span className={styles.price}>${item.product.price}</span>
                              <span className={`${styles.stock} ${isInStock ? styles.inStock : styles.outOfStock}`}>
                                   {stockStatus}
                              </span>
                         </div>
                         <div className={styles.bottomRight}>
                              <p className={styles.total}>Total: ${total}</p>
                              <div className={styles.actions}>
                                   <ActionButtons
                                        onView={handleOpenViewModal}
                                        onDelete={handleRemove}
                                        viewText="View Product"
                                        deleteText="Remove"
                                        showEdit={false}
                                   />
                              </div>
                         </div>
                    </div>
               </div>

               <ProductInfoModal
                    product={{
                         ...item.product,
                         bestOffer: item.product.bestOffer || false,
                         stock: item.product.stock || 0
                    }}
                    isOpen={isViewModalOpen}
                    onClose={handleCloseViewModal}
               />

          </>
     );
}, (prevProps, nextProps) => {
     return prevProps.item.quantity === nextProps.item.quantity;
});

CartItem.displayName = 'CartItem';

export default CartItem; 