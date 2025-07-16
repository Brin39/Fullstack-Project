'use client';

import Image from 'next/image';
import styles from './ViewProductModal.module.css';

interface ProductImagesProps {
     images: string[];
     selectedImageIndex: number;
     onImageSelect: (index: number) => void;
     productName: string;
     isBestOffer: boolean;
}

export default function ProductImages({
     images,
     selectedImageIndex,
     onImageSelect,
     productName,
     isBestOffer
}: ProductImagesProps) {
     const currentImage = images && images.length > 0
          ? images[selectedImageIndex]
          : '/placeholder-image.jpg';

     const hasMultipleImages = images && images.length > 1;

     return (
          <div className={styles.imageSection}>
               <div className={styles.imageContainer}>
                    {isBestOffer && (
                         <div className={styles.bestOfferBadge}>
                              <span>🔥 Best Offer!</span>
                         </div>
                    )}
                    {currentImage && currentImage.startsWith('data:') ? (
                         <img
                              src={currentImage}
                              alt={productName}
                              className={styles.image}
                         />
                    ) : (
                         <Image
                              src={currentImage || '/placeholder-image.jpg'}
                              alt={productName}
                              width={400}
                              height={300}
                              className={styles.image}
                         />
                    )}
               </div>

               {hasMultipleImages && (
                    <div className={styles.thumbnailsContainer}>
                         <div className={styles.thumbnails}>
                              {images.map((image, index) => (
                                   <div
                                        key={`${productName}-image-${index}`}
                                        className={`${styles.thumbnail} ${index === selectedImageIndex ? styles.activeThumbnail : ''}`}
                                        onClick={() => onImageSelect(index)}
                                   >
                                        {image.startsWith('data:') ? (
                                             <img
                                                  src={image}
                                                  alt={`${productName} ${index + 1}`}
                                                  className={styles.thumbnailImage}
                                             />
                                        ) : (
                                             <Image
                                                  src={image}
                                                  alt={`${productName} ${index + 1}`}
                                                  width={60}
                                                  height={60}
                                                  className={styles.thumbnailImage}
                                             />
                                        )}
                                   </div>
                              ))}
                         </div>
                    </div>
               )}
          </div>
     );
} 