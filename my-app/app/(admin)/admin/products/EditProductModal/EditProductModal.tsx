'use client';

import { useMemo } from 'react';
import { useForm } from '@/app/hooks/useForm';
import BaseModal from '@/app/components/shared/BaseModal/BaseModal';
import ProductFormFields from '../ProductFormFields/ProductFormFields';
import { Product, EditProductModalProps } from '@/app/types/product';
import { validateProduct } from '@/app/utils/productValidation';
import styles from './EditProductModal.module.css';

const initialFormData = (product: Product): Partial<Product> => ({
     _id: product._id,
     name: product.name,
     description: product.description,
     price: product.price,
     category: product.category,
     stock: product.stock,
     images: product.images || [],
     bestOffer: product.bestOffer || false
});

export default function EditProductModal({ product, isOpen, onClose, onSave }: EditProductModalProps) {
     const initialValues = useMemo(() => initialFormData(product), [product]);

     const {
          values,
          errors,
          isSubmitting,
          handleChange,
          handleSubmit,
          handleCancel,
          reset
     } = useForm({
          initialValues,
          onSubmit: async (formData) => {
               await onSave(formData as Product);
               reset();
               onClose();
          },
          onCancel: onClose,
          validate: validateProduct
     });

     return (
          <BaseModal
               isOpen={isOpen}
               onClose={handleCancel}
               title="Edit Product"
               size="medium"
          >
               <form onSubmit={handleSubmit} className={styles.form}>
                    <ProductFormFields
                         values={values}
                         errors={errors}
                         onChange={handleChange}
                    />
                    <div className={styles.buttonContainer}>
                         <button
                              type="button"
                              onClick={handleCancel}
                              className={styles.cancelButton}
                         >
                              Cancel
                         </button>
                         <button
                              type="submit"
                              disabled={isSubmitting}
                              className={styles.submitButton}
                         >
                              {isSubmitting ? 'Saving...' : 'Save Changes'}
                         </button>
                    </div>
               </form>
          </BaseModal>
     );
} 