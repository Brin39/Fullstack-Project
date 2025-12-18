import { Request, Response, RequestHandler } from 'express';
import Order from '../models/Order';
import { Product } from '../models/Product';

interface AuthRequest extends Request {
     user?: any;
}

// יצירת הזמנה
export const createOrder: RequestHandler = async (req, res) => {
     try {
          if (!req.user) {
               res.status(401).json({ message: 'User not authenticated' });
               return;
          }

          const { items } = req.body;

          if (!items || items.length === 0) {
               res.status(400).json({ message: 'No products in order' });
               return;
          }

          // חישוב סכום הזמנה
          let totalAmount = 0;
          for (const item of items) {
               const product = await Product.findById(item.product);
               if (!product) {
                    res.status(404).json({ message: `Product not found: ${item.product}` });
                    return;
               }
               totalAmount += product.price * item.quantity;
          }

          const order = await Order.create({
               user: req.user._id,
               items,
               totalAmount,
               status: 'pending'
          });

          await order.populate('items.product', 'name price images');

          res.status(201).json(order);
     } catch (error) {
          res.status(500).json({ message: 'Error creating order' });
     }
};

// מציאת הזמנה לפי ID
export const getOrderById: RequestHandler = async (req, res) => {
     try {
          if (!req.user) {
               res.status(401).json({ message: 'User not authenticated' });
               return;
          }

          const order = await Order.findById(req.params.id)
               .populate('user', 'name email')
               .populate('items.product', 'name price');

          if (!order) {
               res.status(404).json({ message: 'Order not found' });
               return;
          }

          // בדיקת הרשאות גישה
          if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
               res.status(403).json({ message: 'Access denied' });
               return;
          }

          res.json(order);
     } catch (error) {
          res.status(500).json({ message: 'Error getting order' });
     }
};

export const getUserOrders: RequestHandler = async (req, res) => {
     try {
          if (!req.user) {
               res.status(401).json({ message: 'User not authenticated' });
               return;
          }

          const orders = await Order.find({ user: req.user._id })
               .populate('items.product', 'name price images')
               .sort({ createdAt: -1 });

          res.json(orders);
     } catch (error) {
          res.status(500).json({ message: 'Error fetching orders' });
     }
};


