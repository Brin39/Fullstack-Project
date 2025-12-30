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
     const [pendingCartItem, setPendingCartItem] = useState<{ productId: string; quantity: number } | null>(null);

     const addToCart = async (productId: string, quantity: number) => {
          try {
               const token = localStorage.getItem('token');
               if (!token) {
                    throw new Error('No token available');
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

     // Check if there is a pendingCartItem after returning from login page
     useEffect(() => {
          const checkPendingCartItem = async () => {
               const savedPendingItem = sessionStorage.getItem('pendingCartItem');
               if (savedPendingItem) {
                    const { productId, quantity } = JSON.parse(savedPendingItem);
                    const token = localStorage.getItem('token');
                    if (token) {
                         // User is logged in, add item to cart
                         await addToCart(productId, quantity);
                         sessionStorage.removeItem('pendingCartItem');
                         setPendingCartItem(null);
                    }
               }
          };
          checkPendingCartItem();
     }, []);

     const handleViewProduct = (product: Product) => {
          setSelectedProduct(product);
          setIsModalOpen(true);
     };

     const handleAuthSuccess = () => {
          setIsAuthModalOpen(false);
          // Product information is already saved in sessionStorage
          // After login, user will return and useEffect will add item to cart
     };

     const handleAddToCart = async (productId: string, quantity: number) => {
          const token = localStorage.getItem('token');
          if (!token) {
               // Save product information to sessionStorage and show authentication modal
               const cartItem = { productId, quantity };
               setPendingCartItem(cartItem);
               sessionStorage.setItem('pendingCartItem', JSON.stringify(cartItem));
               setIsAuthModalOpen(true);
               return;
          }

          // If user is logged in, add to cart immediately
          await addToCart(productId, quantity);
     };

     return (
          <div className={styles.productList} data-testid="product-list">
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