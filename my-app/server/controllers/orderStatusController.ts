import { RequestHandler } from 'express';
import Order from '../models/Order';


export const updateOrderStatus: RequestHandler = async (req, res) => {
     try {
          const order = await Order.findByIdAndUpdate(
               req.params.id,
               { status: req.body.status },
               { new: true }
          ).populate('user', 'name email')
               .populate('items.product', 'name price');

          if (!order) {
               res.status(404).json({ message: 'Order not found' });
               return;
          }

          res.json(order);
     } catch (error) {
          res.status(500).json({ message: 'Error updating order status' });
     }
}; 