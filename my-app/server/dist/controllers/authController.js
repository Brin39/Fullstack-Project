"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerAdmin = exports.registerUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET || 'your_jwt_secret_key', {
        expiresIn: '30d',
    });
};
const registerUser = async (req, res) => {
    try {
        console.log('=== Registration Start ===');
        console.log('1. Raw request body:', req.body);
        const { name, email, password, role, adminCode } = req.body;
        console.log('2. Extracted data:', { name, email, role });
        const userExists = await User_1.User.findOne({ email });
        if (userExists) {
            console.log('3. User already exists');
            res.status(400).json({ message: 'User already exists' });
            return;
        }
        if (role === 'admin') {
            if (!adminCode || adminCode !== process.env.ADMIN_CREATION_CODE) {
                console.log('4. Invalid admin code');
                res.status(403).json({
                    message: 'Unauthorized attempt to create admin account'
                });
                return;
            }
        }
        console.log('5. Creating user');
        const user = await User_1.User.create({
            name,
            email,
            password,
            role: role || 'user'
        });
        console.log('6. User created successfully');
        res.status(201).json({
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id.toString()),
        });
    }
    catch (error) {
        console.error('7. Error during registration:', error);
        res.status(400).json({
            message: 'Error during registration',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.registerUser = registerUser;
const registerAdmin = async (req, res) => {
    try {
        const { name, email, password, adminCode } = req.body;
        if (!adminCode || adminCode !== process.env.ADMIN_CREATION_CODE) {
            res.status(403).json({
                message: 'Invalid admin creation code'
            });
            return;
        }
        const userExists = await User_1.User.findOne({ email });
        if (userExists) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }
        const user = await User_1.User.create({
            name,
            email,
            password,
            role: 'admin'
        });
        if (user) {
            res.status(201).json({
                _id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id.toString()),
            });
        }
    }
    catch (error) {
        res.status(400).json({ message: 'Error during admin registration' });
    }
};
exports.registerAdmin = registerAdmin;
const loginUser = async (req, res) => {
    try {
        console.log('=== Login Attempt ===');
        console.log('1. Request body:', req.body);
        const { email, password } = req.body;
        // מציאת משתמש
        const user = await User_1.User.findOne({ email });
        console.log('2. User found:', user ? 'Yes' : 'No');
        if (!user) {
            console.log('3. User not found');
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }
        // בדיקת סיסמה
        const isMatch = await user.comparePassword(password);
        console.log('4. Password match:', isMatch ? 'Yes' : 'No');
        if (!isMatch) {
            console.log('5. Password does not match');
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }
        console.log('6. Login successful, sending response');
        res.json({
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id.toString()),
        });
    }
    catch (error) {
        console.error('7. Error during login:', error);
        res.status(400).json({ message: 'Error during login' });
    }
};
exports.loginUser = loginUser;
