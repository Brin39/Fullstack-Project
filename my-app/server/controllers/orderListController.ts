import { RequestHandler } from 'express';
import Order from '../models/Order';


export const getUserOrders: RequestHandler = async (req, res) => {
     try {
          if (!req.user) {
               res.status(401).json({ message: 'User not authenticated' });
               return;
          }

          const page = parseInt(req.query.page as string) || 1;
          const limit = parseInt(req.query.limit as string) || 10;
          const status = req.query.status as string;

          const query: any = { user: req.user._id };
          if (status) {
               query.status = status;
          }

          const orders = await Order.find(query)
               .sort({ createdAt: -1 })
               .skip((page - 1) * limit)
               .limit(limit)
               .populate('items.product', 'name price image');

          const total = await Order.countDocuments(query);

          res.json({
               orders,
               currentPage: page,
               totalPages: Math.ceil(total / limit),
               totalOrders: total
          });
     } catch (error) {
          console.error('Error fetching user orders:', error);
          res.status(500).json({ message: 'Error fetching user orders' });
     }
};

// Получение всех заказов (для админа) с пагинацией
export const getAllOrders: RequestHandler = async (req, res) => {
     try {
          const page = parseInt(req.query.page as string) || 1;
          const limit = parseInt(req.query.limit as string) || 10;
          const status = req.query.status as string;
          const userId = req.query.userId as string;

          const query: any = {};
          if (status) query.status = status;
          if (userId) query.user = userId;

          const orders = await Order.find(query)
               .sort({ createdAt: -1 })
               .skip((page - 1) * limit)
               .limit(limit)
               .populate('user', 'name email')
               .populate('items.product', 'name price image');

          const total = await Order.countDocuments(query);

          res.json({
               orders,
               currentPage: page,
               totalPages: Math.ceil(total / limit),
               totalOrders: total
          });
     } catch (error) {
          console.error('Error fetching all orders:', error);
          res.status(500).json({ message: 'Error fetching all orders' });
     }
};

// Получение последних заказов
export const getRecentOrders: RequestHandler = async (req, res) => {
     try {
          const recentOrders = await Order.find()
               .sort({ createdAt: -1 })
               .limit(10)
               .populate('user', 'name email')
               .populate('items.product', 'name price');

          res.json(recentOrders);
     } catch (error) {
          console.error('Error fetching recent orders:', error);
          res.status(500).json({ message: 'Error fetching recent orders' });
     }
}; 