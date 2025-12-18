'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { buildApiUrl } from '@/app/utils/apiBase';

interface CartContextType {
     cartItemCount: number;
     updateCartItemCount: (count: number) => void;
     incrementCartCount: () => void;
     decrementCartCount: () => void;
     resetCartCount: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
     const [cartItemCount, setCartItemCount] = useState(0);

     // Load cart count from server on mount
     useEffect(() => {
          const loadCartCount = async () => {
               const token = localStorage.getItem('token');
               if (!token) return;

               try {
                    const response = await fetch(buildApiUrl('/api/cart'), {
                         headers: {
                              'Authorization': `Bearer ${token}`
                         }
                    });

                    if (response.ok) {
                         const data = await response.json();
                         setCartItemCount(data.items?.length || 0);
                    }
               } catch (error) {
                    // Silent fail - cart will sync when user visits cart page
               }
          };

          loadCartCount();
     }, []);

     const updateCartItemCount = useCallback((count: number) => {
          setCartItemCount(Math.max(0, count));
     }, []);

     const incrementCartCount = useCallback(() => {
          setCartItemCount(prev => prev + 1);
     }, []);

     const decrementCartCount = useCallback(() => {
          setCartItemCount(prev => Math.max(0, prev - 1));
     }, []);

     const resetCartCount = useCallback(() => {
          setCartItemCount(0);
     }, []);

     return (
          <CartContext.Provider value={{
               cartItemCount,
               updateCartItemCount,
               incrementCartCount,
               decrementCartCount,
               resetCartCount
          }}>
               {children}
          </CartContext.Provider>
     );
}

export function useCartContext() {
     const context = useContext(CartContext);
     if (context === undefined) {
          throw new Error('useCartContext must be used within a CartProvider');
     }
     return context;
} 