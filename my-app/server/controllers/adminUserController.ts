import { RequestHandler } from 'express';
import { User } from '../models/User';
import Order from '../models/Order';
import mongoose from 'mongoose';

export const getUsers: RequestHandler = async (req, res) => {
     try {
          const page = parseInt(req.query.page as string) || 1;
          const limit = parseInt(req.query.limit as string) || 10;
          const search = req.query.search as string;

          const query: any = {};
          if (search) {
               query.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
               ];
          }

          const users = await User.find(query)
               .select('-password')
               .sort({ createdAt: -1 })
               .skip((page - 1) * limit)
               .limit(limit);

          const total = await User.countDocuments(query);

          res.json({
               users,
               currentPage: page,
               totalPages: Math.ceil(total / limit),
               totalUsers: total
          });
     } catch (err: any) {
          res.status(500).json({ message: err.message });
     }
};

export const getUserDetails: RequestHandler = async (req, res) => {
     try {
          const userId = req.params.id;
          console.log('Getting user details for ID:', userId);

          
          const user = await User.findById(userId).select('-password');
          if (!user) {
               console.log('User not found');
               res.status(404).json({ message: 'User not found' });
               return;
          }
          console.log('User found:', user.name);

          // קבלת סטורי פעילות משתמש
          const orders = await Order.find({
               user: new mongoose.Types.ObjectId(userId)
          })
               .populate('items.product', 'name price')
               .sort({ createdAt: -1 })
               .limit(10);
          console.log('Orders found:', orders.length);


          const totalOrders = await Order.countDocuments({
               user: new mongoose.Types.ObjectId(userId)
          });

          console.log('User ID for aggregation:', userId);
          console.log('User ID as ObjectId:', new mongoose.Types.ObjectId(userId));


          const allOrders = await Order.find({}).limit(5);
          console.log('Sample orders in DB:', allOrders.map(o => ({
               id: o._id,
               user: o.user,
               totalAmount: o.totalAmount
          })));


          const totalSpent = await Order.aggregate([
               {
                    $match: {
                         user: new mongoose.Types.ObjectId(userId)
                    }
               },
               {
                    $group: {
                         _id: null,
                         total: { $sum: '$totalAmount' }
                    }
               }
          ]);

          console.log('Total orders:', totalOrders, 'Total spent:', totalSpent);

          const userDetails = {
               ...user.toObject(),
               orders: orders,
               totalOrders: totalOrders,
               totalSpent: totalSpent.length > 0 ? totalSpent[0].total : 0
          };

          console.log('Sending user details');
          res.json(userDetails);
     } catch (err: any) {
          console.error('Error in getUserDetails:', err);
          res.status(500).json({ message: err.message });
     }
};

export const updateUser: RequestHandler = async (req, res) => {
     try {
          const { name, email, role } = req.body;
          const user = await User.findByIdAndUpdate(
               req.params.id,
               { name, email, role },
               { new: true }
          ).select('-password');

          if (!user) {
               res.status(404).json({ message: 'User not found' });
               return;
          }

          res.json(user);
     } catch (err: any) {
          res.status(500).json({ message: err.message });
     }
};

export const deleteUser: RequestHandler = async (req, res) => {
     try {
          const user = await User.findByIdAndDelete(req.params.id);
          if (!user) {
               res.status(404).json({ message: 'User not found' });
               return;
          }
          res.json({ message: 'User deleted' });
     } catch (err: any) {
          res.status(500).json({ message: err.message });
     }
}; 