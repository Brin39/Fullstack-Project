'use client';

import React from 'react';
import styles from './ProductFormFields.module.css';
import { ProductFormData, FormField } from '@/app/types/product';
import ProductImageUploader from '../ProductImageUploader/ProductImageUploader';

const formFields: FormField[] = [
     {
          id: 'name',
          label: 'Name',
          type: 'text',
          required: true,
          className: styles.input
     },
     {
          id: 'description',
          label: 'Description',
          type: 'textarea',
          required: true,
          className: styles.textarea
     },
     {
          id: 'price',
          label: 'Price',
          type: 'number',
          required: true,
          className: styles.numberInput,
          min: 0,
          step: 0.01
     },
     {
          id: 'category',
          label: 'Category',
          type: 'text',
          required: false,
          className: styles.input
     },
     {
          id: 'stock',
          label: 'Stock',
          type: 'number',
          required: true,
          className: styles.numberInput,
          min: 0
     }
];

export default function ProductFormFields({
     values,
     errors,
     onChange
}: {
     values: ProductFormData;
     errors: Partial<Record<keyof ProductFormData, string>>;
     onChange: (name: keyof ProductFormData, value: any) => void;
}) {
     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
          const { name, value, type } = e.target;
          const fieldValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked :
               type === 'number' ? Number(value) : value;
          onChange(name as keyof ProductFormData, fieldValue);
     };

     return (
          <>
               {formFields.map(field => (
                    <div key={field.id} className={styles.formGroup}>
                         <label htmlFor={field.id} className={styles.label}>{field.label}</label>
                         {field.type === 'textarea' ? (
                              <textarea
                                   id={field.id}
                                   name={field.id}
                                   value={String(values[field.id] || '')}
                                   onChange={handleInputChange}
                                   className={`${field.className} ${errors[field.id] ? styles.error : ''}`}
                                   required={field.required}
                              />
                         ) : (
                              <input
                                   type={field.type}
                                   id={field.id}
                                   name={field.id}
                                   value={field.type === 'number' ? (values[field.id] as number || 0) : String(values[field.id] || '')}
                                   onChange={handleInputChange}
                                   className={`${field.className} ${errors[field.id] ? styles.error : ''}`}
                                   required={field.required}
                                   {...(field.type === 'number' && { min: field.min, step: field.step })}
                              />
                         )}
                         {errors[field.id] && (
                              <span className={styles.errorMessage}>{errors[field.id]}</span>
                         )}
                    </div>
               ))}

               <div className={styles.formGroup}>
                    <label className={styles.label}>
                         <input
                              type="checkbox"
                              name="bestOffer"
                              checked={values.bestOffer || false}
                              onChange={handleInputChange}
                              className={styles.checkbox}
                         />
                         Best Offer
                    </label>
               </div>

               <div className={styles.formGroup}>
                    <label className={styles.label}>Images</label>
                    <ProductImageUploader
                         images={values.images || []}
                         onImagesChange={(images) => onChange('images', images)}
                    />
               </div>
          </>
     );
} 