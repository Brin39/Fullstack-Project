'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './ProductImageUploader.module.css';
import { ProductImageUploaderProps } from '../../../../types/product';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const DEFAULT_MAX_IMAGES = 5;

export default function ProductImageUploader({
     images,
     onImagesChange,
     maxImages = DEFAULT_MAX_IMAGES
}: ProductImageUploaderProps) {
     const [error, setError] = useState<string | null>(null);

     const validateFiles = (files: FileList): boolean => {
          if (files.length + images.length > maxImages) {
               setError(`Maximum ${maxImages} images allowed`);
               return false;
          }

          for (let i = 0; i < files.length; i++) {
               if (files[i].size > MAX_FILE_SIZE) {
                    setError('Image size should be less than 5MB');
                    return false;
               }
          }

          return true;
     };

     const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
          const files = e.target.files;
          if (!files) return;

          if (!validateFiles(files)) return;

          const newImages: string[] = [];
          const promises = Array.from(files).map(file =>
               new Promise<string>((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.readAsDataURL(file);
               })
          );

          try {
               const results = await Promise.all(promises);
               onImagesChange([...images, ...results]);
               setError(null);
          } catch (err) {
               setError('Failed to process images');
          }
     };

     const removeImage = (index: number) => {
          onImagesChange(images.filter((_: string, i: number) => i !== index));
     };

     const moveToFirst = (index: number) => {
          if (index === 0) return; // Already first
          const newImages = [...images];
          const [movedImage] = newImages.splice(index, 1);
          newImages.unshift(movedImage);
          onImagesChange(newImages);
     };



     return (
          <div className={styles.imageUpload} data-testid="product-image-uploader">
               {error && <div className={styles.error} data-testid="image-upload-error">{error}</div>}
               <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    disabled={images.length >= maxImages}
                    data-testid="product-image-input"
               />
               <p className={styles.uploadHint} data-testid="image-upload-hint">
                    Upload up to {maxImages} images (max 5MB each). First image will be the main image.
               </p>
               <div className={styles.imagePreview} data-testid="image-preview-container">
                    {images.map((image: string, index: number) => (
                         <div key={`image-${image.substring(0, 20)}-${index}`} className={`${styles.imageContainer} ${index === 0 ? styles.mainImage : ''}`} data-testid={`image-preview-${index}`}>
                              {index === 0 && <div className={styles.mainImageBadge} data-testid="main-image-badge">Main</div>}
                              {image && (
                                   <Image
                                        src={image}
                                        alt={`Preview ${index + 1}`}
                                        width={100}
                                        height={100}
                                        className={styles.previewImage}
                                        data-testid={`preview-image-${index}`}
                                   />
                              )}
                              <div className={styles.imageControls} data-testid={`image-controls-${index}`}>
                                   {index !== 0 && (
                                        <button
                                             type="button"
                                             onClick={() => moveToFirst(index)}
                                             className={styles.controlButton}
                                             title="Make main image"
                                             data-testid={`make-main-image-btn-${index}`}
                                        >
                                             ⭐
                                        </button>
                                   )}
                              </div>

                              <button
                                   type="button"
                                   onClick={() => removeImage(index)}
                                   className={styles.removeImage}
                                   title="Remove image"
                                   data-testid={`remove-image-btn-${index}`}
                              >
                                   ×
                              </button>
                         </div>
                    ))}
               </div>
          </div>
     );
} 