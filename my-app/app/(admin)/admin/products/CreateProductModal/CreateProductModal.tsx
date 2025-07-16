'use client';

import { useForm } from '@/app/hooks/useForm';
import BaseModal from '@/app/components/shared/BaseModal/BaseModal';
import ProductFormFields from '../ProductFormFields/ProductFormFields';
import { Product, CreateProductModalProps } from '@/app/types/product';
import { validateProduct } from '@/app/utils/productValidation';
import styles from './CreateProductModal.module.css';

const initialFormData: Partial<Product> = {
     name: '',
     description: '',
     price: 0,
     category: '',
     stock: 0,
     images: [],
     bestOffer: false
};

export default function CreateProductModal({ isOpen, onClose, onCreate }: CreateProductModalProps) {
     const {
          values,
          errors,
          isSubmitting,
          handleChange,
          handleSubmit,
          handleCancel,
          reset
     } = useForm({
          initialValues: initialFormData,
          onSubmit: async (formData) => {
               await onCreate(formData as Product);
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
               title="Create Product"
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
                              {isSubmitting ? 'Creating...' : 'Create Product'}
                         </button>
                    </div>
               </form>
          </BaseModal>
     );
} 