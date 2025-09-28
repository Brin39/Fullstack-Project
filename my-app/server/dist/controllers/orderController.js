"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserOrders = exports.getOrderById = exports.createOrder = void 0;
const Order_1 = __importDefault(require("../models/Order"));
const Product_1 = require("../models/Product");
// יצירת הזמנה
const createOrder = async (req, res) => {
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
            const product = await Product_1.Product.findById(item.product);
            if (!product) {
                res.status(404).json({ message: `Product not found: ${item.product}` });
                return;
            }
            totalAmount += product.price * item.quantity;
        }
        const order = await Order_1.default.create({
            user: req.user._id,
            items,
            totalAmount,
            status: 'pending'
        });
        await order.populate('items.product', 'name price images');
        res.status(201).json(order);
    }
    catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Error creating order' });
    }
};
exports.createOrder = createOrder;
// מציאת הזמנה לפי ID
const getOrderById = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        const order = await Order_1.default.findById(req.params.id)
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
    }
    catch (error) {
        console.error('Error getting order:', error);
        res.status(500).json({ message: 'Error getting order' });
    }
};
exports.getOrderById = getOrderById;
const getUserOrders = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        const orders = await Order_1.default.find({ user: req.user._id })
            .populate('items.product', 'name price images')
            .sort({ createdAt: -1 });
        res.json(orders);
    }
    catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Error fetching orders' });
    }
};
exports.getUserOrders = getUserOrders;
