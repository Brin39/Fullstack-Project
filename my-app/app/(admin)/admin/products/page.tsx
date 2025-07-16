'use client';

import { useState } from 'react';
import styles from './page.module.css';
import AdminPageLayout from '@/app/components/admin/AdminPageLayout';
import EditProductModal from './EditProductModal/EditProductModal';
import CreateProductModal from './CreateProductModal/CreateProductModal';
import ViewProductModal from '@/app/components/shared/ViewProductModal/ViewProductModal';
import ProductList from './ProductList/ProductList';
import { useProducts } from '@/app/hooks/useProducts';
import { useModalManagement } from '@/app/hooks/useModalManagement';
import { Product } from '@/app/types/product';

export default function ProductsPage() {
     const {
          products,
          loading,
          error,
          searchQuery,
          setSearchQuery,
          handleSearch,
          handleSaveProduct,
          handleCreateProduct,
          handleDeleteProduct
     } = useProducts();

     const {
          selectedItem: selectedProduct,
          isEditModalOpen,
          isCreateModalOpen,
          isViewModalOpen,
          handleEdit,
          handleView,
          handleCreate,
          handleCloseEditModal,
          handleCloseViewModal,
          handleCloseCreateModal
     } = useModalManagement<Product>();

     const handleDelete = (product: Product) => {
          if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
               handleDeleteProduct(product).catch(console.error);
          }
     };

     if (loading) return <div className={styles.loading}>Loading...</div>;
     if (error) return <div className={styles.error}>{error}</div>;

     return (
          <>
               <AdminPageLayout
                    title="Products management"
                    searchProps={{
                         placeholder: "Search by name...",
                         value: searchQuery,
                         onChange: (value) => {
                              setSearchQuery(value);
                              handleSearch(value);
                         }
                    }}
                    addButtonProps={{
                         text: "Add product",
                         onClick: handleCreate
                    }}
                    countProps={{
                         label: "Total",
                         count: products.length
                    }}
               >
                    <ProductList
                         products={products}
                         onEdit={handleEdit}
                         onView={handleView}
                         onDelete={handleDelete}
                    />
               </AdminPageLayout>

               {selectedProduct && (
                    <EditProductModal
                         product={selectedProduct}
                         isOpen={isEditModalOpen}
                         onClose={handleCloseEditModal}
                         onSave={handleSaveProduct}
                    />
               )}

               <CreateProductModal
                    isOpen={isCreateModalOpen}
                    onClose={handleCloseCreateModal}
                    onCreate={handleCreateProduct}
               />

               {selectedProduct && (
                    <ViewProductModal
                         product={selectedProduct}
                         isOpen={isViewModalOpen}
                         onClose={handleCloseViewModal}
                         onAddToCart={(productId, quantity) => {
                              alert(`Would add ${quantity} of product ${productId} to cart`);
                         }}
                    />
               )}
          </>
     );
} 