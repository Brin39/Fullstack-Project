import { RequestHandler } from 'express';
import { User } from '../models/User';
import { Product } from '../models/Product';
import Order from '../models/Order';

export const getStats: RequestHandler = async (req, res) => {
     try {
          const { startDate, endDate } = req.query;
          const query: any = {};

          if (startDate && endDate) {
               query.createdAt = {
                    $gte: new Date(startDate as string),
                    $lte: new Date(endDate as string)
               };
          }

          const [totalUsers, totalProducts, totalOrders, recentOrders] = await Promise.all([
               User.countDocuments(),
               Product.countDocuments(),
               Order.countDocuments(query),
               Order.find(query)
                    .sort({ createdAt: -1 })
                    .limit(5)
                    .populate('user', 'name email')
          ]);

          res.json({
               totalUsers,
               totalProducts,
               totalOrders,
               recentOrders
          });
     } catch (err: any) {
          res.status(500).json({ message: err.message });
     }
}; 