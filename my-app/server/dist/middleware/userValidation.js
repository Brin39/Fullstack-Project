"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLogin = exports.validateProfileUpdate = exports.validateRegistration = void 0;
const User_1 = require("../models/User");
// אימות דוא"ל
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
// אימות שם
const isValidName = (name) => {
    return name.length >= 2 && name.length <= 50;
};
// תוכנת ביניים לאימות הרשמה
const validateRegistration = async (req, res, next) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required for registration' });
    }
    if (!isValidName(name)) {
        return res.status(400).json({ message: 'Name must be between 2 and 50 characters' });
    }
    if (!isValidEmail(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }
    if (password.length < 6) {
        return res.status(400).json({
            message: 'Password must be at least 6 characters long, including letters and numbers'
        });
    }
    // אימות ייחודיות של דוא"ל
    const existingUser = await User_1.User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: 'User with this email already exists' });
    }
    next();
};
exports.validateRegistration = validateRegistration;
// תוכנת ביניים לאימות עדכון פרופיל
const validateProfileUpdate = async (req, res, next) => {
    const { name, email } = req.body;
    if (name && !isValidName(name)) {
        return res.status(400).json({ message: 'Name must be between 2 and 50 characters' });
    }
    if (email && !isValidEmail(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }
    // אימות ייחודיות של דוא"ל
    if (email) {
        const existingUser = await User_1.User.findOne({
            email,
            _id: { $ne: req.user?._id }
        });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }
    }
    next();
};
exports.validateProfileUpdate = validateProfileUpdate;
// תוכנת ביניים לאימות כניסה
const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    if (!isValidEmail(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }
    next();
};
exports.validateLogin = validateLogin;
