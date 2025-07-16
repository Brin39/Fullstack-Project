'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

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