"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUserDetails = exports.getUsers = void 0;
const User_1 = require("../models/User");
const Order_1 = __importDefault(require("../models/Order"));
const mongoose_1 = __importDefault(require("mongoose"));
const getUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search;
        const query = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }
        const users = await User_1.User.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);
        const total = await User_1.User.countDocuments(query);
        res.json({
            users,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalUsers: total
        });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.getUsers = getUsers;
const getUserDetails = async (req, res) => {
    try {
        const userId = req.params.id;
        console.log('Getting user details for ID:', userId);
        const user = await User_1.User.findById(userId).select('-password');
        if (!user) {
            console.log('User not found');
            res.status(404).json({ message: 'User not found' });
            return;
        }
        console.log('User found:', user.name);
        // קבלת סטורי פעילות משתמש
        const orders = await Order_1.default.find({
            user: new mongoose_1.default.Types.ObjectId(userId)
        })
            .populate('items.product', 'name price')
            .sort({ createdAt: -1 })
            .limit(10);
        console.log('Orders found:', orders.length);
        const totalOrders = await Order_1.default.countDocuments({
            user: new mongoose_1.default.Types.ObjectId(userId)
        });
        console.log('User ID for aggregation:', userId);
        console.log('User ID as ObjectId:', new mongoose_1.default.Types.ObjectId(userId));
        const allOrders = await Order_1.default.find({}).limit(5);
        console.log('Sample orders in DB:', allOrders.map(o => ({
            id: o._id,
            user: o.user,
            totalAmount: o.totalAmount
        })));
        const totalSpent = await Order_1.default.aggregate([
            {
                $match: {
                    user: new mongoose_1.default.Types.ObjectId(userId)
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
    }
    catch (err) {
        console.error('Error in getUserDetails:', err);
        res.status(500).json({ message: err.message });
    }
};
exports.getUserDetails = getUserDetails;
const updateUser = async (req, res) => {
    try {
        const { name, email, role } = req.body;
        const user = await User_1.User.findByIdAndUpdate(req.params.id, { name, email, role }, { new: true }).select('-password');
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json(user);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    try {
        const user = await User_1.User.findByIdAndDelete(req.params.id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json({ message: 'User deleted' });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.deleteUser = deleteUser;
