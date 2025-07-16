import { useState, useCallback } from 'react';

export function useModalManagement<T>() {
     const [selectedItem, setSelectedItem] = useState<T | null>(null);
     const [isEditModalOpen, setIsEditModalOpen] = useState(false);
     const [isViewModalOpen, setIsViewModalOpen] = useState(false);
     const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

     const handleEdit = useCallback((item: T) => {
          setSelectedItem(item);
          setIsEditModalOpen(true);
     }, []);

     const handleView = useCallback((item: T) => {
          setSelectedItem(item);
          setIsViewModalOpen(true);
     }, []);

     const handleCreate = useCallback(() => {
          setIsCreateModalOpen(true);
     }, []);

     const handleCloseEditModal = useCallback(() => {
          setSelectedItem(null);
          setIsEditModalOpen(false);
     }, []);

     const handleCloseViewModal = useCallback(() => {
          setSelectedItem(null);
          setIsViewModalOpen(false);
     }, []);

     const handleCloseCreateModal = useCallback(() => {
          setIsCreateModalOpen(false);
     }, []);

     return {
          selectedItem,
          isEditModalOpen,
          isViewModalOpen,
          isCreateModalOpen,
          handleEdit,
          handleView,
          handleCreate,
          handleCloseEditModal,
          handleCloseViewModal,
          handleCloseCreateModal,
          setSelectedItem
     };
} 