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

     // Проверяем, есть ли pendingCartItem после возврата с страницы логина
     useEffect(() => {
          const checkPendingCartItem = async () => {
               const savedPendingItem = sessionStorage.getItem('pendingCartItem');
               if (savedPendingItem) {
                    const { productId, quantity } = JSON.parse(savedPendingItem);
                    const token = localStorage.getItem('token');
                    if (token) {
                         // Пользователь залогинен, добавляем товар в корзину
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
          // Информация о товаре уже сохранена в sessionStorage
          // После логина пользователь вернется, и useEffect добавит товар в корзину
     };

     const handleAddToCart = async (productId: string, quantity: number) => {
          const token = localStorage.getItem('token');
          if (!token) {
               // Сохраняем информацию о товаре в sessionStorage и показываем модальное окно аутентификации
               const cartItem = { productId, quantity };
               setPendingCartItem(cartItem);
               sessionStorage.setItem('pendingCartItem', JSON.stringify(cartItem));
               setIsAuthModalOpen(true);
               return;
          }

          // Если пользователь залогинен, сразу добавляем в корзину
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