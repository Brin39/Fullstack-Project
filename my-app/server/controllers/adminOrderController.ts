import { RequestHandler } from 'express';
import Order from '../models/Order';

export const getOrders: RequestHandler = async (req, res) => {
     try {
          const orders = await Order.find()
               .populate('user', 'name email')
               .populate('items.product');
          res.json(orders);
     } catch (err: any) {
          res.status(500).json({ message: err.message });
     }
};

export const updateOrderStatus: RequestHandler = async (req, res) => {
     try {
          const { status } = req.body;
          const order = await Order.findByIdAndUpdate(
               req.params.id,
               { status },
               { new: true }
          ).populate('user', 'name email')
               .populate('items.product');

          if (!order) {
               res.status(404).json({ message: 'Order not found' });
               return;
          }

          res.json(order);
     } catch (err: any) {
          res.status(500).json({ message: err.message });
     }
};

export const deleteOrder: RequestHandler = async (req, res) => {
     try {
          const order = await Order.findByIdAndDelete(req.params.id);

          if (!order) {
               res.status(404).json({ message: 'Order not found' });
               return;
          }

          res.json({ message: 'Order deleted successfully' });
     } catch (err: any) {
          res.status(500).json({ message: err.message });
     }
}; 