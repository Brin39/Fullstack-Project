import { useState, useEffect } from 'react';
import { Product } from '@/app/types/product';
import { useAuth } from './useAuth';
import { buildApiUrl } from '@/app/utils/apiBase';

export function useProducts() {
     const { getAuthHeaders, handleAuthError } = useAuth();
     const [products, setProducts] = useState<Product[]>([]);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState<string | null>(null);
     const [searchQuery, setSearchQuery] = useState('');

     useEffect(() => {
          fetchProducts();
     }, []);

     const fetchProducts = async () => {
          try {
               const headers = getAuthHeaders();
               const response = await fetch(buildApiUrl('/api/admin/products'), {
                    headers,
               });

               if (handleAuthError(response)) return;
               if (!response.ok) throw new Error('Failed to fetch products');

               const data = await response.json();

               const sortedProducts = data.sort((a: Product, b: Product) => {
                    const updatedAtA = new Date(a.updatedAt).getTime();
                    const updatedAtB = new Date(b.updatedAt).getTime();
                    if (updatedAtA !== updatedAtB) {
                         return updatedAtB - updatedAtA;
                    }
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
               });
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
               const headers = getAuthHeaders();

               if (!query.trim()) {
                    await fetchProducts();
                    return;
               }

               const response = await fetch(buildApiUrl(`/api/products/search?query=${encodeURIComponent(query)}`), {
                    headers,
               });

               if (handleAuthError(response)) return;
               if (!response.ok) {
                    throw new Error('Failed to fetch search results');
               }

               const data = await response.json();
               setProducts(data);
          } catch (err) {
               setError(err instanceof Error ? err.message : 'An error occurred');
          } finally {
               setLoading(false);
          }
     };

     const handleSaveProduct = async (updatedProduct: Partial<Product>) => {
          try {
               const headers = getAuthHeaders();
               const response = await fetch(buildApiUrl(`/api/admin/products/${updatedProduct._id}`), {
                    method: 'PUT',
                    headers,
                    body: JSON.stringify(updatedProduct)
               });

               if (handleAuthError(response)) return;
               if (!response.ok) {
                    const errorData = await response.text();
                    throw new Error(`Failed to update product: ${response.status} ${errorData}`);
               }

               const result = await response.json();
               setProducts(products.map(p =>
                    p._id === updatedProduct._id ? { ...p, ...updatedProduct } : p
               ));

               return result;
          } catch (err) {
               setError(err instanceof Error ? err.message : 'Failed to update product');
               throw err;
          }
     };

     const handleCreateProduct = async (newProduct: Partial<Product>) => {
          try {
               const headers = getAuthHeaders();
               const response = await fetch(buildApiUrl('/api/admin/products'), {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(newProduct),
               });

               if (handleAuthError(response)) return;
               if (!response.ok) {
                    const errorData = await response.text();
                    throw new Error(`Failed to create product: ${response.status} ${errorData}`);
               }

               const createdProduct = await response.json();
               setProducts([...products, createdProduct]);
               return createdProduct;
          } catch (err) {
               setError(err instanceof Error ? err.message : 'Failed to create product');
               throw err;
          }
     };

     const handleDeleteProduct = async (product: Product) => {
          try {
               const headers = getAuthHeaders();
               const response = await fetch(buildApiUrl(`/api/admin/products/${product._id}`), {
                    method: 'DELETE',
                    headers,
               });

               if (handleAuthError(response)) return;
               if (!response.ok) {
                    const errorData = await response.text();
                    throw new Error(`Failed to delete product: ${response.status} ${errorData}`);
               }

               setProducts(products.filter(p => p._id !== product._id));
               return true;
          } catch (err) {
               setError(err instanceof Error ? err.message : 'Failed to delete product');
               throw err;
          }
     };

     return {
          products,
          loading,
          error,
          searchQuery,
          setSearchQuery,
          handleSearch,
          handleSaveProduct,
          handleCreateProduct,
          handleDeleteProduct
     };
} 