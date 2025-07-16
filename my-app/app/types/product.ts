export interface Product {
     _id: string;
     name: string;
     description: string;
     price: number;
     category: string;
     stock: number;
     images: string[];
     createdAt: string;
     updatedAt: string;
     bestOffer: boolean;
}

export interface ProductFormData {
     name?: string;
     description?: string;
     price?: number;
     category?: string;
     stock?: number;
     images?: string[];
     bestOffer?: boolean;
}

// סוגים חלקיים עבור הקשרים שונים
export type ProductPreview = Pick<Product, '_id' | 'name' | 'description' | 'price' | 'images' | 'bestOffer'>;
export type ProductCard = Pick<Product, '_id' | 'name' | 'description' | 'price' | 'images' | 'stock' | 'bestOffer'>;
export type ProductModal = Pick<Product, '_id' | 'name' | 'description' | 'price' | 'images' | 'bestOffer' | 'stock'>;

// ממשקים עבור חלונות מוליכים
export interface EditProductModalProps {
     product: Product;
     isOpen: boolean;
     onClose: () => void;
     onSave: (updatedProduct: Partial<Product>) => Promise<void>;
}

export interface CreateProductModalProps {
     isOpen: boolean;
     onClose: () => void;
     onCreate: (product: Partial<Product>) => Promise<void>;
}

// מערכת שדות של טפס
export interface BaseField {
     id: keyof ProductFormData;
     label: string;
     required: boolean;
     className: string;
}

export interface TextField extends BaseField {
     type: 'text';
}

export interface NumberField extends BaseField {
     type: 'number';
     min?: number;
     step?: number;
}

export interface TextareaField extends BaseField {
     type: 'textarea';
}

export type FormField = TextField | NumberField | TextareaField;

// ממשק למעליק תמונות
export interface ProductImageUploaderProps {
     images: string[];
     onImagesChange: (images: string[]) => void;
     maxImages?: number;
} 