'use client';

import { useEffect } from 'react';
import styles from './ProductForm.module.css';
import ProductFormFields from '../../../(admin)/admin/products/ProductFormFields/ProductFormFields';
import ProductImageUploader from '../../../(admin)/admin/products/ProductImageUploader/ProductImageUploader';
import { Product } from '../../../types/product';
import { useForm } from '../../../hooks/useForm';

interface ProductFormProps {
     initialData: Partial<Product>;
     onSubmit: (data: Partial<Product>) => Promise<void>;
     onCancel: () => void;
     submitButtonText: string;
     loadingButtonText: string;
}

export default function ProductForm({
     initialData,
     onSubmit,
     onCancel,
     submitButtonText,
     loadingButtonText
}: ProductFormProps) {
     const {
          values,
          errors,
          isSubmitting,
          handleChange,
          handleSubmit,
          reset,
          setValues
     } = useForm({
          initialValues: initialData,
          onSubmit,
          onCancel,
          validate: () => ({})
     });

     useEffect(() => {
          setValues(initialData);
     }, [initialData, setValues]);

     return (
          <form onSubmit={handleSubmit} className={styles.form} data-testid="product-form">
               {Object.keys(errors).length > 0 && (
                    <div className={styles.error} data-testid="product-form-error">
                         {Object.values(errors).join(', ')}
                    </div>
               )}

               <ProductFormFields
                    values={values}
                    errors={errors}
                    onChange={handleChange}
               />

               <div className={styles.formGroup}>
                    <label>Images</label>
                    <ProductImageUploader
                         images={values.images || []}
                         onImagesChange={(images) => setValues({ ...values, images })}
                    />
               </div>

               <div className={styles.formActions}>
                    <button
                         type="button"
                         onClick={onCancel}
                         className={styles.cancelButton}
                         data-testid="product-form-cancel-btn"
                    >
                         Cancel
                    </button>
                    <button
                         type="submit"
                         className={styles.saveButton}
                         disabled={isSubmitting}
                         data-testid="product-form-submit-btn"
                    >
                         {isSubmitting ? loadingButtonText : submitButtonText}
                    </button>
               </div>
          </form>
     );
} 