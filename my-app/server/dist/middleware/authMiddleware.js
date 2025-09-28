"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const protect = async (req, res, next) => {
    try {
        let token;
        // בדוק את הטוקן בכותרת ההרשאה
        if (req.headers.authorization?.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
            console.log('Token from Authorization header:', token);
        }
        if (!token) {
            console.log('No token provided');
            return res.status(401).json({ message: 'Not authorized, no token' });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        console.log('Decoded token:', decoded);
        const user = await User_1.User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        req.user = {
            ...user.toObject(),
            _id: user._id
        };
        console.log('User found:', req.user);
        next();
    }
    catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};
exports.protect = protect;
const isAdmin = async (req, res, next) => {
    try {
        console.log('Checking admin role. User:', req.user);
        if (!req.user) {
            console.log('No user found in request');
            return res.status(401).json({ message: 'Not authorized' });
        }
        const user = await User_1.User.findById(req.user._id);
        console.log('Found user in database:', user);
        if (!user || user.role !== 'admin') {
            console.log('Admin access denied. User role:', user?.role);
            return res.status(403).json({ message: 'Access denied' });
        }
        console.log('Admin access granted');
        next();
    }
    catch (err) {
        console.error('Admin check error:', err);
        res.status(500).json({ message: err.message });
    }
};
exports.isAdmin = isAdmin;
