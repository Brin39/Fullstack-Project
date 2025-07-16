import { RequestHandler } from 'express';
import Order from '../models/Order';

// Обновление статуса заказа
export const updateOrderStatus: RequestHandler = async (req, res) => {
     try {
          const order = await Order.findByIdAndUpdate(
               req.params.id,
               { status: req.body.status },
               { new: true }
          ).populate('user', 'name email')
               .populate('items.product', 'name price');

          if (!order) {
               return res.status(404).json({ message: 'Order not found' });
          }

          res.json(order);
     } catch (error) {
          console.error('Error updating order status:', error);
          res.status(500).json({ message: 'Error updating order status' });
     }
}; 