import { ProductFormData } from '../types/product';

export function validateProduct(values: ProductFormData): Partial<Record<keyof ProductFormData, string>> {
     const errors: Partial<Record<keyof ProductFormData, string>> = {};

     if (!values.name?.trim()) {
          errors.name = 'Name is required';
     }

     if (!values.description?.trim()) {
          errors.description = 'Description is required';
     }

     if (!values.price || values.price <= 0) {
          errors.price = 'Price must be greater than 0';
     }

     if (values.stock == null || values.stock < 0) {
          errors.stock = 'Stock must be 0 or greater';
     }

     return errors;
} 