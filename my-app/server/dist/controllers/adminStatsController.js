"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStats = void 0;
const User_1 = require("../models/User");
const Product_1 = require("../models/Product");
const Order_1 = __importDefault(require("../models/Order"));
const getStats = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const query = {};
        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }
        const [totalUsers, totalProducts, totalOrders, recentOrders] = await Promise.all([
            User_1.User.countDocuments(),
            Product_1.Product.countDocuments(),
            Order_1.default.countDocuments(query),
            Order_1.default.find(query)
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
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.getStats = getStats;
