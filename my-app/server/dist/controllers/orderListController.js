"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecentOrders = exports.getAllOrders = exports.getUserOrders = void 0;
const Order_1 = __importDefault(require("../models/Order"));
const getUserOrders = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status;
        const query = { user: req.user._id };
        if (status) {
            query.status = status;
        }
        const orders = await Order_1.default.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('items.product', 'name price image');
        const total = await Order_1.default.countDocuments(query);
        res.json({
            orders,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalOrders: total
        });
    }
    catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ message: 'Error fetching user orders' });
    }
};
exports.getUserOrders = getUserOrders;
// Получение всех заказов (для админа) с пагинацией
const getAllOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status;
        const userId = req.query.userId;
        const query = {};
        if (status)
            query.status = status;
        if (userId)
            query.user = userId;
        const orders = await Order_1.default.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('user', 'name email')
            .populate('items.product', 'name price image');
        const total = await Order_1.default.countDocuments(query);
        res.json({
            orders,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalOrders: total
        });
    }
    catch (error) {
        console.error('Error fetching all orders:', error);
        res.status(500).json({ message: 'Error fetching all orders' });
    }
};
exports.getAllOrders = getAllOrders;
// Получение последних заказов
const getRecentOrders = async (req, res) => {
    try {
        const recentOrders = await Order_1.default.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('user', 'name email')
            .populate('items.product', 'name price');
        res.json(recentOrders);
    }
    catch (error) {
        console.error('Error fetching recent orders:', error);
        res.status(500).json({ message: 'Error fetching recent orders' });
    }
};
exports.getRecentOrders = getRecentOrders;
