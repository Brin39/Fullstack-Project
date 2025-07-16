export interface OrderItem {
     product: {
          _id: string;
          name: string;
          price: number;
     };
     quantity: number;
}

export interface Order {
     _id: string;
     user: {
          _id: string;
          name: string;
          email: string;
     };
     items: OrderItem[];
     totalAmount: number;
     status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
     createdAt: string;
}

export type OrderStatus = Order['status']; 