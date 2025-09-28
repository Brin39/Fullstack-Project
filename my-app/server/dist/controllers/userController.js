"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const User_1 = require("../models/User");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// צור אסימון JWT
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET || 'your_jwt_secret', {
        expiresIn: '30d',
    });
};
// רישום משתמש
const registerUser = async (req, res) => {
    try {
        console.log('=== Registration Start ===');
        console.log('1. Raw request body:', req.body);
        const { name, email, password, role } = req.body;
        console.log('2. Extracted data:', { name, email, role });
        if (!name || !email || !password) {
            console.log('3. Missing required fields');
            return res.status(400).json({
                message: 'Please provide all required fields',
                received: { name, email, password: password ? 'provided' : 'missing' }
            });
        }
        console.log('4. Checking if user exists');
        const userExists = await User_1.User.findOne({ email });
        if (userExists) {
            console.log('5. User already exists');
            return res.status(400).json({ message: 'User already exists' });
        }
        console.log('6. Creating user with data:', { name, email, role });
        try {
            const user = await User_1.User.create({
                name,
                email,
                password,
                role: role === 'admin' ? 'admin' : 'user'
            });
            console.log('7. User created successfully:', user.toObject());
            const response = {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                token: generateToken(user._id.toString()),
            };
            console.log('8. Sending response:', response);
            res.status(201).json(response);
        }
        catch (createError) {
            console.error('Error during user creation:', createError);
            throw createError;
        }
    }
    catch (error) {
        console.error('=== Registration Error ===');
        console.error('Error type:', error?.constructor?.name);
        console.error('Error message:', error?.message);
        console.error('Error stack:', error?.stack);
        res.status(400).json({
            message: 'Error during registration',
            error: error?.message || 'Unknown error',
            details: error?.stack
        });
    }
};
exports.registerUser = registerUser;
// כניסת משתמש
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        // מציאת משתמש
        const user = await User_1.User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        // בדיקת סיסמה
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        // שלח תשובה
        res.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token: generateToken(user._id.toString()),
        });
    }
    catch (error) {
        console.error('Error in loginUser:', error);
        res.status(400).json({
            message: 'Error logging in',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
exports.loginUser = loginUser;
