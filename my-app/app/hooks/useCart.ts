'use client';

import { useState, useEffect, useCallback } from 'react';
import { useCartContext } from '@/app/(user)/cart/CartContext';
import { useAuth } from './useAuth';
import { CartProduct } from '@/app/types/cart';
import { buildApiUrl } from '@/app/utils/apiBase';

export const useCart = () => {
     const { getAuthHeaders, handleAuthError } = useAuth();
     const { updateCartItemCount } = useCartContext();
     const [cartItems, setCartItems] = useState<CartProduct[]>([]);
     const [isLoading, setIsLoading] = useState(true);
     const [error, setError] = useState<string | null>(null);

     const fetchCartItems = useCallback(async () => {
          try {
               setError(null);
               const headers = getAuthHeaders();
               const response = await fetch(buildApiUrl('/api/cart'), {
                    headers
               });

               if (handleAuthError(response)) return;
               if (!response.ok) {
                    throw new Error('Failed to fetch cart items');
               }

               const data = await response.json();
               setCartItems(data.items || []);
          } catch (err) {
               setError(err instanceof Error ? err.message : 'Failed to fetch cart items');
          } finally {
               setIsLoading(false);
          }
     }, [getAuthHeaders, handleAuthError]);

     const handleQuantityChange = async (productId: string, quantity: number) => {
          try {
               // Optimistic UI update
               setCartItems(prevItems =>
                    prevItems.map(item =>
                         item.product._id === productId
                              ? { ...item, quantity }
                              : item
                    )
               );

               const headers = getAuthHeaders();
               const response = await fetch(buildApiUrl(`/api/cart/update/${productId}`), {
                    method: 'PUT',
                    headers: {
                         ...headers,
                         'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ quantity })
               });

               if (handleAuthError(response)) return;
               if (!response.ok) {
                    // If request failed, rollback changes
                    await fetchCartItems();
                    throw new Error('Failed to update quantity');
               }

               // Update state from server response
               const data = await response.json();
               setCartItems(data.items || []);
          } catch (error) {
               console.error('Failed to update quantity:', error);
               // In case of error, refresh data from server
               await fetchCartItems();
          }
     };

     const handleRemoveItem = async (productId: string) => {
          try {
               // Optimistic UI update
               setCartItems(prevItems => prevItems.filter(item => item.product._id !== productId));

               const headers = getAuthHeaders();
               const response = await fetch(buildApiUrl(`/api/cart/${productId}`), {
                    method: 'DELETE',
                    headers
               });

               if (handleAuthError(response)) return;
               if (!response.ok) {
                    // If request failed, rollback changes
                    await fetchCartItems();
                    throw new Error('Failed to remove item');
               }

               // Update state from server response
               const data = await response.json();
               setCartItems(data.items || []);
          } catch (error) {
               console.error('Failed to remove item:', error);
               // In case of error, refresh data from server
               await fetchCartItems();
          }
     };

     const handleClearCart = async () => {
          try {
               const headers = getAuthHeaders();
               const response = await fetch(buildApiUrl('/api/cart/clear'), {
                    method: 'DELETE',
                    headers
               });

               if (handleAuthError(response)) return;
               if (!response.ok) {
                    throw new Error('Failed to clear cart');
               }

               setCartItems([]);
               updateCartItemCount(0);
          } catch (error) {
               console.error('Failed to clear cart:', error);
               setError('Failed to clear cart');
          }
     };

     useEffect(() => {
          fetchCartItems();
     }, [fetchCartItems]);

     useEffect(() => {
          updateCartItemCount(cartItems.length);
     }, [cartItems, updateCartItemCount]);

     const totalAmount = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

     return {
          cartItems,
          isLoading,
          error,
          totalAmount,
          handleQuantityChange,
          handleRemoveItem,
          handleClearCart
     };
}; 