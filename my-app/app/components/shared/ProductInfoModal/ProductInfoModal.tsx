'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './ProductInfoModal.module.css';

import { ProductModal as Product } from '@/app/types/product';

interface ProductInfoModalProps {
     product: Product;
     isOpen: boolean;
     onClose: () => void;
}

export default function ProductInfoModal({ product, isOpen, onClose }: ProductInfoModalProps) {
     const [selectedImageIndex, setSelectedImageIndex] = useState(0);

     if (!isOpen) return null;

     const currentImage = product.images[selectedImageIndex] || '/placeholder-image.jpg';
     const hasMultipleImages = product.images.length > 1;

     return (
          <div className={styles.modalOverlay} onClick={onClose}>
               <div className={styles.modal} onClick={e => e.stopPropagation()}>
                    <div className={styles.modalHeader}>
                         <h2>Product Details</h2>
                         <button onClick={onClose} className={styles.closeButton}>×</button>
                    </div>

                    <div className={styles.productContainer}>
                         <div className={styles.imageSection}>
                              <div className={styles.imageContainer}>
                                   {currentImage.startsWith('data:') ? (
                                        <img
                                             src={currentImage}
                                             alt={product.name}
                                             className={styles.image}
                                        />
                                   ) : (
                                        <Image
                                             src={currentImage}
                                             alt={product.name}
                                             width={400}
                                             height={300}
                                             className={styles.image}
                                        />
                                   )}
                              </div>

                              {hasMultipleImages && (
                                   <div className={styles.thumbnailsContainer}>
                                        <div className={styles.thumbnails}>
                                             {product.images.map((image, index) => (
                                                  <div
                                                       key={`${product._id}-image-${index}`}
                                                       className={`${styles.thumbnail} ${index === selectedImageIndex ? styles.activeThumbnail : ''}`}
                                                       onClick={() => setSelectedImageIndex(index)}
                                                  >
                                                       {image.startsWith('data:') ? (
                                                            <img
                                                                 src={image}
                                                                 alt={`${product.name} ${index + 1}`}
                                                                 className={styles.thumbnailImage}
                                                            />
                                                       ) : (
                                                            <Image
                                                                 src={image}
                                                                 alt={`${product.name} ${index + 1}`}
                                                                 width={50}
                                                                 height={50}
                                                                 className={styles.thumbnailImage}
                                                            />
                                                       )}
                                                  </div>
                                             ))}
                                        </div>
                                   </div>
                              )}
                         </div>

                         <div className={styles.detailsSection}>
                              <h1 className={styles.productTitle}>{product.name}</h1>

                              <div className={styles.descriptionContainer}>
                                   <div className={styles.description}>
                                        {product.description}
                                   </div>
                              </div>

                              <div className={styles.productInfo}>
                                   <p><strong>Availability:</strong> {(product.stock ?? 0) > 0 ? 'In Stock' : 'Out of Stock'}</p>
                              </div>
                         </div>
                    </div>
               </div>
          </div>
     );
} 