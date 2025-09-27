'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from './components/shared/Header/Header';
import ProductList from './components/shared/ProductList/ProductList';
import Footer from './components/shared/Footer/Footer';
import { formatProduct, sortProductsByBestOffer, FormattedProduct } from './utils/productUtils';
import { useAuthentication } from './hooks/useAuthentication';
import { buildApiUrl } from './utils/apiBase';
import styles from './page.module.css';

export default function Home() {
     const router = useRouter();
     const { checkToken } = useAuthentication();
     const [products, setProducts] = useState<FormattedProduct[]>([]);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState<string | null>(null);
     const [searchQuery, setSearchQuery] = useState('');

     useEffect(() => {
          checkToken();
     }, [checkToken]);

     useEffect(() => {
          fetchProducts();
     }, [router]);

     const fetchProducts = async () => {
          try {
               setLoading(true);
               const res = await fetch(buildApiUrl('/api/products'), {
                    cache: 'no-store',
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
               setSearchQuery(query);

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
          <main>
               <Header onSearch={handleSearch} />
               <h1 className={styles.seoTitle}>
                    MyStore - Your reliable online store of electronics and household appliances.
                    Wide selection of products at affordable prices with quality guarantee and fast delivery.
               </h1>
               <div className={styles.content}>
                    <h2 className={styles.visibleTitle}>
                         {searchQuery ? `Search Results for "${searchQuery}"` : 'Our Products'}
                    </h2>
                    {loading ? (
                         <div className={styles.loading}>Loading...</div>
                    ) : error ? (
                         <div className={styles.error}>{error}</div>
                    ) : products.length === 0 ? (
                         <div className={styles.noResults}>
                              <p>No products found matching your search.</p>
                         </div>
                    ) : (
                         <ProductList initialProducts={products} />
                    )}
               </div>
               <Footer />
          </main>
     );
} 