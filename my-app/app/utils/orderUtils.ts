export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export const getStatusColor = (status: OrderStatus) => {
     const colors = {
          pending: '#F59E0B',
          processing: '#3B82F6',
          shipped: '#8B5CF6',
          delivered: '#10B981',
          cancelled: '#EF4444',
     };
     return colors[status];
};

export const getStatusTransitions = (): Record<OrderStatus, OrderStatus> => {
     return {
          pending: 'processing',
          processing: 'shipped',
          shipped: 'delivered',
          delivered: 'delivered',
          cancelled: 'cancelled'
     };
};

export const canUpdateStatus = (status: OrderStatus): boolean => {
     return status !== 'delivered' && status !== 'cancelled';
}; 