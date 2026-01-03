'use client';

import { useState, useEffect } from 'react';
import UserHeaderWrapper from '@/app/(user)/user/UserHeaderWrapper/page';
import ProductList from '@/app/components/shared/ProductList/ProductList';
import { formatProduct, sortProductsByBestOffer, FormattedProduct } from '@/app/utils/productUtils';
import { buildApiUrl } from '@/app/utils/apiBase';
import styles from './page.module.css';

export default function UserPage() {
     const [products, setProducts] = useState<FormattedProduct[]>([]);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState<string | null>(null);
     const [searchQuery, setSearchQuery] = useState('');

     useEffect(() => {
          fetchProducts();
     }, []);

     const fetchProducts = async () => {
          try {
               setLoading(true);
               setError(null);
               const res = await fetch(buildApiUrl('/api/products?page=1&limit=20'), {
                    headers: {
                         'Content-Type': 'application/json',
                    },
               });

               if (!res.ok) {
                    throw new Error(`Failed to fetch products: ${res.status} ${res.statusText}`);
               }

               const data = await res.json();

               let productsArray: any[];
               if (data.products && Array.isArray(data.products)) {
                    productsArray = data.products;
               } else if (Array.isArray(data)) {
                    productsArray = data;
               } else {
                    throw new Error('Invalid data format received from server');
               }

               const formattedProducts = productsArray.map(formatProduct);
               const sortedProducts = sortProductsByBestOffer(formattedProducts);
               setProducts(sortedProducts);
          } catch (err) {
               setError(err instanceof Error ? err.message : 'Failed to fetch products');
          } finally {
               setLoading(false);
          }
     };

     const handleSearch = async (query: string) => {
          try {
               setLoading(true);
               setError(null);
               setSearchQuery(query);

               if (!query.trim()) {
                    // If query is empty, fetch all products
                    await fetchProducts();
                    return;
               }

               const response = await fetch(buildApiUrl(`/api/products/search?query=${encodeURIComponent(query)}`));

               if (!response.ok) {
                    throw new Error('Failed to fetch search results');
               }

               const data = await response.json();
               const formattedProducts = data.map(formatProduct);
               setProducts(formattedProducts);
          } catch (err) {
               setError(err instanceof Error ? err.message : 'An error occurred');
          } finally {
               setLoading(false);
          }
     };

     return (
          <div className={styles.layout}>
               <UserHeaderWrapper onSearch={handleSearch} />
               <main className={styles.main}>
                    <div className={styles.container}>
                         <h1 className={styles.title}>
                              {searchQuery ? `Search Results for "${searchQuery}"` : 'Our products'}
                         </h1>
                         {loading ? (
                              <div className={styles.loading}>Loading...</div>
                         ) : error ? (
                              <div className={styles.error}>{error}</div>
                         ) : products.length === 0 ? (
                              <div className={styles.error}>
                                   {searchQuery ? 'No products found matching your search.' : 'No products available'}
                              </div>
                         ) : (
                              <ProductList initialProducts={products} />
                         )}
                    </div>
               </main>
          </div>
     );
} 