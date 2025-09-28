"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateStatusTransition = exports.validateOrderStatus = exports.VALID_ORDER_STATUSES = void 0;
const Order_1 = __importDefault(require("../models/Order"));
// סטטוסים של הזמנות תקפים
exports.VALID_ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
// תוכנת ביניים לאימות סטטוס
const validateOrderStatus = (req, res, next) => {
    const { status } = req.body;
    if (!status) {
        return res.status(400).json({ message: 'Status is required' });
    }
    if (!exports.VALID_ORDER_STATUSES.includes(status)) {
        return res.status(400).json({
            message: 'Invalid status',
            validStatuses: exports.VALID_ORDER_STATUSES
        });
    }
    next();
};
exports.validateOrderStatus = validateOrderStatus;
// תוכנת ביניים לאימות הזמנה
const validateStatusTransition = async (req, res, next) => {
    try {
        const order = await Order_1.default.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        const currentStatus = order.status;
        const newStatus = req.body.status;
        // בדיקה של תהליכים סטטוס תקינים
        const validTransitions = {
            pending: ['processing', 'cancelled'],
            processing: ['shipped', 'cancelled'],
            shipped: ['delivered'],
            delivered: [], // לא ניתן לשנות את סטטוס הזמנה שהתקבלה
            cancelled: [] // לא ניתן לשנות את סטטוס הזמנה שנבטלה
        };
        if (!validTransitions[currentStatus].includes(newStatus)) {
            return res.status(400).json({
                message: `Cannot change status from ${currentStatus} to ${newStatus}`,
                validTransitions: validTransitions[currentStatus]
            });
        }
        next();
    }
    catch (error) {
        console.error('Error validating status transition:', error);
        res.status(500).json({ message: 'Error validating status transition' });
    }
};
exports.validateStatusTransition = validateStatusTransition;
