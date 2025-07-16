import { OrderStatus } from '@/app/utils/orderUtils';

export interface OrderItem {
     product: {
          _id: string;
          name: string;
          price: number;
          images?: string[];
     };
     quantity: number;
}

export interface OrderUser {
     _id: string;
     name: string;
     email: string;
}

export interface Order {
     _id: string;
     user?: OrderUser;
     items: OrderItem[];
     totalAmount: number;
     status: OrderStatus;
     createdAt: string;
} 