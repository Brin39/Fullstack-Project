import { Order } from '../types';
import OrderCard from '@/app/components/shared/OrderCard/OrderCard';

interface OrderCardProps {
     order: Order;
     onUpdateStatus: (orderId: string, currentStatus: Order['status']) => void;
     onDelete: (orderId: string) => void;
}

export default function AdminOrderCard({ order, onUpdateStatus, onDelete }: OrderCardProps) {
     return (
          <OrderCard
               order={order}
               variant="admin"
               onUpdateStatus={onUpdateStatus}
               onDelete={onDelete}
          />
     );
} 