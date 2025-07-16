import { Product } from '@/app/types/product';

export interface FormattedProduct {
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

export const formatProduct = (product: any): FormattedProduct => ({
     _id: product._id,
     name: product.name,
     description: product.description,
     price: product.price,
     category: product.category || 'General',
     stock: product.stock || 0,
     images: product.images || [],
     createdAt: product.createdAt || new Date().toISOString(),
     updatedAt: product.updatedAt || new Date().toISOString(),
     bestOffer: product.bestOffer || false
});

export const sortProductsByBestOffer = (products: FormattedProduct[]): FormattedProduct[] => {
     return products.sort((a, b) => {
          if (a.bestOffer && !b.bestOffer) return -1;
          if (!a.bestOffer && b.bestOffer) return 1;
          return 0;
     });
};

export const fetchAndFormatProducts = async (): Promise<FormattedProduct[]> => {
     try {
          const res = await fetch('http://localhost:5000/api/products', {
               cache: 'no-store',
               headers: {
                    'Content-Type': 'application/json',
               },
               next: { revalidate: 0 }
          });

          if (!res.ok) {
               throw new Error(`Failed to fetch products: ${res.status} ${res.statusText}`);
          }

          const data = await res.json();
          const productsArray = data.products || data;

          if (!Array.isArray(productsArray)) {
               throw new Error('Invalid data format received from server');
          }

          const formattedProducts = productsArray.map(formatProduct);
          return sortProductsByBestOffer(formattedProducts);
     } catch (error) {
          console.error('Error fetching products:', error);
          return [];
     }
}; 