"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = void 0;
const Order_1 = __importDefault(require("../models/Order"));
const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order_1.default.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true }).populate('user', 'name email')
            .populate('items.product', 'name price');
        if (!order) {
            res.status(404).json({ message: 'Order not found' });
            return;
        }
        res.json(order);
    }
    catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Error updating order status' });
    }
};
exports.updateOrderStatus = updateOrderStatus;
