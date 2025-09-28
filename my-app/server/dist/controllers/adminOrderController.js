"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrder = exports.updateOrderStatus = exports.getOrders = void 0;
const Order_1 = __importDefault(require("../models/Order"));
const getOrders = async (req, res) => {
    try {
        const orders = await Order_1.default.find()
            .populate('user', 'name email')
            .populate('items.product');
        res.json(orders);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.getOrders = getOrders;
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order_1.default.findByIdAndUpdate(req.params.id, { status }, { new: true }).populate('user', 'name email')
            .populate('items.product');
        if (!order) {
            res.status(404).json({ message: 'Order not found' });
            return;
        }
        res.json(order);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.updateOrderStatus = updateOrderStatus;
const deleteOrder = async (req, res) => {
    try {
        const order = await Order_1.default.findByIdAndDelete(req.params.id);
        if (!order) {
            res.status(404).json({ message: 'Order not found' });
            return;
        }
        res.json({ message: 'Order deleted successfully' });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.deleteOrder = deleteOrder;
