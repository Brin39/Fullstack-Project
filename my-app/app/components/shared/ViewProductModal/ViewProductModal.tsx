'use client';

import { useState, useEffect, useMemo } from 'react';
import ProductImages from './ProductImages';
import QuantityControls from './QuantityControls';
import styles from './ViewProductModal.module.css';

import { ProductModal as Product } from '@/app/types/product';

interface ViewProductModalProps {
     product: Product;
     isOpen: boolean;
     onClose: () => void;
     onAddToCart: (productId: string, quantity: number) => void;
     readOnly?: boolean;
}

export default function ViewProductModal({ product, isOpen, onClose, onAddToCart, readOnly = false }: ViewProductModalProps) {
     const [selectedImageIndex, setSelectedImageIndex] = useState(0);
     const [quantity, setQuantity] = useState(1);

     const total = useMemo(() => {
          return quantity >= 2 ? (product.price * quantity).toFixed(2) : null;
     }, [quantity, product.price]);

     const isOutOfStock = (product.stock ?? 0) <= 0;

     useEffect(() => {
          if (isOpen) {
               document.body.style.overflow = 'hidden';
          } else {
               document.body.style.overflow = 'unset';
               setQuantity(1);
          }

          return () => {
               document.body.style.overflow = 'unset';
          };
     }, [isOpen]);

    const handleQuantityChange = (newQuantity: number) => {
         if (readOnly) return;
         if (newQuantity < 1) return;
         if (product.stock && newQuantity > product.stock) return;
         setQuantity(newQuantity);
    };

    const handleAddToCart = () => {
         if (readOnly) return;
         onAddToCart(product._id, quantity);
    };

     if (!isOpen) return null;

     return (
          <div className={styles.modalOverlay} data-testid="product-modal">
               <div className={styles.modal}>
                    <div className={styles.modalHeader}>
                         <h2>Product Preview</h2>
                         <button onClick={onClose} className={styles.closeButton} data-testid="modal-close-btn">×</button>
                    </div>

                    <div className={styles.productHeader}>
                         <h1 className={styles.productTitle} data-testid="modal-product-name">{product.name}</h1>
                         <p className={`${styles.productPrice} ${product.bestOffer ? styles.bestOffer : ''}`} data-testid="modal-product-price">
                              ${product.price}
                         </p>
                    </div>

                    <div className={styles.productContainer}>
                         <ProductImages
                              images={product.images}
                              selectedImageIndex={selectedImageIndex}
                              onImageSelect={setSelectedImageIndex}
                              productName={product.name}
                              isBestOffer={product.bestOffer}
                         />

                         <div className={styles.productDetails}>
                              <div className={styles.description}>
                                   <h3>Description</h3>
                                   <p data-testid="modal-product-description">{product.description}</p>
                              </div>

                              <div className={styles.stock}>
                                   <h3>Availability</h3>
                                   <p data-testid="modal-product-stock">{product.stock && product.stock > 0 ? 'In Stock' : 'Out of Stock'}</p>
                              </div>

                              <QuantityControls
                                   quantity={quantity}
                                   onQuantityChange={handleQuantityChange}
                                   stock={product.stock}
                                   isOutOfStock={isOutOfStock}
                                   total={total}
                                   disabled={readOnly}
                              />

                              <button
                                   className={styles.addToCartButton}
                                   onClick={handleAddToCart}
                                   disabled={isOutOfStock || readOnly}
                                   data-testid="add-to-cart-btn"
                              >
                                   {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                              </button>
                         </div>
                    </div>
               </div>
          </div>
     );
} 