import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
     user: mongoose.Types.ObjectId;
     items: {
          product: mongoose.Types.ObjectId;
          quantity: number;
     }[];
     totalAmount: number;
     status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
     createdAt: Date;
}

const orderSchema = new Schema({
     user: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true
     },
     items: [{
          product: {
               type: Schema.Types.ObjectId,
               ref: 'Product',
               required: true
          },
          quantity: {
               type: Number,
               required: true,
               min: 1
          }
     }],
     totalAmount: {
          type: Number,
          required: true,
          min: 0
     },
     status: {
          type: String,
          enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
          default: 'pending'
     },
     createdAt: {
          type: Date,
          default: Date.now
     }
});

// אינדקס לפי תאריך יצירה למיון וסינון מהירים
orderSchema.index({ createdAt: -1 });

// אינדקס מורכב לחיפוש לפי תאריך יצירה של משתמש מסוג זה
orderSchema.index({ user: 1, createdAt: -1 });

// אינדקסים לחיפוש מהיר
orderSchema.index({ status: 1, createdAt: -1 }); // עבור סינון לפי סטאטוס

export default mongoose.model<IOrder>('Order', orderSchema); 