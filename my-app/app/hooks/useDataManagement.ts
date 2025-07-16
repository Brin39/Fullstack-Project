import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

interface UseDataManagementOptions<T> {
     endpoint: string;
     transformData?: (data: any) => T[];
     onError?: (error: string) => void;
}

export function useDataManagement<T>({
     endpoint,
     transformData,
     onError
}: UseDataManagementOptions<T>) {
     const { getAuthHeaders, handleAuthError } = useAuth();
     const [items, setItems] = useState<T[]>([]);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState<string | null>(null);
     const [searchQuery, setSearchQuery] = useState('');

     const fetchItems = useCallback(async () => {
          try {
               setLoading(true);
               setError(null);

               const headers = getAuthHeaders();
               const response = await fetch(endpoint, { headers });

               if (handleAuthError(response)) return;
               if (!response.ok) throw new Error('Failed to fetch data');

               const data = await response.json();
               const itemsArray = transformData ? transformData(data) : data;
               setItems(itemsArray);
          } catch (err) {
               const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
               setError(errorMessage);
               onError?.(errorMessage);
          } finally {
               setLoading(false);
          }
     }, [endpoint, getAuthHeaders, handleAuthError, transformData, onError]);

     const handleSearch = useCallback(async (query: string) => {
          try {
               setLoading(true);
               setSearchQuery(query);

               if (!query.trim()) {
                    await fetchItems();
                    return;
               }

               const headers = getAuthHeaders();
               const response = await fetch(`${endpoint}/search?query=${encodeURIComponent(query)}`, {
                    headers,
               });

               if (handleAuthError(response)) return;
               if (!response.ok) throw new Error('Failed to fetch search results');

               const data = await response.json();
               const itemsArray = transformData ? transformData(data) : data;
               setItems(itemsArray);
          } catch (err) {
               const errorMessage = err instanceof Error ? err.message : 'Search failed';
               setError(errorMessage);
               onError?.(errorMessage);
          } finally {
               setLoading(false);
          }
     }, [endpoint, getAuthHeaders, handleAuthError, transformData, onError, fetchItems]);

     const handleDelete = useCallback(async (itemId: string) => {
          try {
               const headers = getAuthHeaders();
               const response = await fetch(`${endpoint}/${itemId}`, {
                    method: 'DELETE',
                    headers,
               });

               if (handleAuthError(response)) return;
               if (!response.ok) throw new Error('Failed to delete item');

               setItems(prev => prev.filter(item => (item as any)._id !== itemId));
               return true;
          } catch (err) {
               const errorMessage = err instanceof Error ? err.message : 'Failed to delete item';
               setError(errorMessage);
               onError?.(errorMessage);
               throw err;
          }
     }, [endpoint, getAuthHeaders, handleAuthError, onError]);

     useEffect(() => {
          fetchItems();
     }, [fetchItems]);

     return {
          items,
          loading,
          error,
          searchQuery,
          setSearchQuery,
          handleSearch,
          handleDelete,
          refetch: fetchItems
     };
} 