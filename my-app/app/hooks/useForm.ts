import { useState, useCallback } from 'react';

interface UseFormOptions<T> {
     initialValues: T;
     onSubmit: (values: T) => Promise<void> | void;
     onCancel?: () => void;
     validate?: (values: T) => Partial<Record<keyof T, string>>;
}

export function useForm<T extends Record<string, any>>({
     initialValues,
     onSubmit,
     onCancel,
     validate
}: UseFormOptions<T>) {
     const [values, setValues] = useState<T>(initialValues);
     const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
     const [isSubmitting, setIsSubmitting] = useState(false);

     const handleChange = useCallback((name: keyof T, value: any) => {
          setValues(prev => ({ ...prev, [name]: value }));
          // Clear error when user starts typing
          if (errors[name]) {
               setErrors(prev => ({ ...prev, [name]: undefined }));
          }
     }, [errors]);

     const handleSubmit = useCallback(async (e?: React.FormEvent) => {
          if (e) {
               e.preventDefault();
          }

          // Validate form
          if (validate) {
               const validationErrors = validate(values);
               if (Object.keys(validationErrors).length > 0) {
                    setErrors(validationErrors);
                    return;
               }
          }

          setIsSubmitting(true);
          try {
               await onSubmit(values);
               // Reset form on successful submission
               setValues(initialValues);
               setErrors({});
          } catch (error) {
               console.error('Form submission error:', error);
          } finally {
               setIsSubmitting(false);
          }
     }, [values, validate, onSubmit, initialValues]);

     const handleCancel = useCallback(() => {
          setValues(initialValues);
          setErrors({});
          onCancel?.();
     }, [initialValues, onCancel]);

     const reset = useCallback(() => {
          setValues(initialValues);
          setErrors({});
     }, [initialValues]);

     return {
          values,
          errors,
          isSubmitting,
          handleChange,
          handleSubmit,
          handleCancel,
          reset,
          setValues
     };
} 