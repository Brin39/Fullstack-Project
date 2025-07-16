import { Types } from 'mongoose';

export interface CartItem {
     product: Types.ObjectId;
     quantity: number;
}

export const validateCartItem = (quantity: number): boolean => {
     return quantity > 0 && Number.isInteger(quantity);
}; 