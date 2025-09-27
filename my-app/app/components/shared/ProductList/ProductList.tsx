'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProductCard from '../ProductCard/ProductCard';
import ViewProductModal from '../ViewProductModal/ViewProductModal';
import AuthModal from '../../auth/AuthModal/AuthModal';
import { useCartContext } from '@/app/(user)/cart/CartContext';
import styles from './ProductList.module.css';
import { buildApiUrl } from '@/app/utils/apiBase';

import { ProductCard as Product } from '@/app/types/product';

interface ProductListProps {
     initialProducts: Product[];
}

export default function ProductList({ initialProducts }: ProductListProps) {
     const router = useRouter();
     const { updateCartItemCount } = useCartContext();
     const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
     const [isModalOpen, setIsModalOpen] = useState(false);
     const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

     const handleViewProduct = (product: Product) => {
          const token = localStorage.getItem('token');
          if (!token) {
               setSelectedProduct(product);
               setIsAuthModalOpen(true);
               return;
          }
          setSelectedProduct(product);
          setIsModalOpen(true);
     };

     const handleAuthSuccess = () => {
          setIsAuthModalOpen(false);
          const token = localStorage.getItem('token');
          if (token) {
               setIsModalOpen(true);
          }
     };

     const handleAddToCart = async (productId: string, quantity: number) => {
          try {
               const token = localStorage.getItem('token');
               if (!token) {
                    router.replace('/login');
                    return;
               }

               const response = await fetch(buildApiUrl('/api/cart'), {
                    method: 'POST',
                    headers: {
                         'Content-Type': 'application/json',
                         'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ productId, quantity })
               });

               if (!response.ok) {
                    throw new Error('Failed to add to cart');
               }

               const data = await response.json();
               updateCartItemCount(data.items ? data.items.length : 0);
               setIsModalOpen(false);
          } catch (error) {
               console.error('Failed to add to cart:', error);
          }
     };

     return (
          <div className={styles.productList}>
               {initialProducts.map((product) => (
                    <ProductCard
                         key={product._id}
                         product={product}
                         onViewProduct={() => handleViewProduct(product)}
                    />
               ))}
               {selectedProduct && (
                    <>
                         <ViewProductModal
                              product={selectedProduct}
                              isOpen={isModalOpen}
                              onClose={() => setIsModalOpen(false)}
                              onAddToCart={handleAddToCart}
                         />
                         <AuthModal
                              isOpen={isAuthModalOpen}
                              onClose={() => setIsAuthModalOpen(false)}
                              onAuthSuccess={handleAuthSuccess}
                         />
                    </>
               )}
          </div>
     );
} 