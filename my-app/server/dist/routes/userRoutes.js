"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const User_1 = require("../models/User");
const userValidation_1 = require("../middleware/userValidation");
const router = express_1.default.Router();
// נתיבי אימות
router.post('/register', userValidation_1.validateRegistration, authController_1.registerUser);
router.post('/login', userValidation_1.validateLogin, authController_1.loginUser);
// בסיס פעולות משתמש
const getProfileHandler = async (req, res) => {
    try {
        const user = await User_1.User.findById(req.user?._id).select('-password').lean();
        if (!user) {
            res.status(401).json({ message: 'User not found' });
            return;
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Error getting user profile' });
    }
};
router.get('/profile', authMiddleware_1.protect, getProfileHandler);
const updateProfileHandler = async (req, res) => {
    try {
        const { name, email, address, phone } = req.body;
        const user = await User_1.User.findByIdAndUpdate(req.user?._id, { name, email, address, phone }, { new: true }).select('-password').lean();
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating profile' });
    }
};
router.put('/profile', authMiddleware_1.protect, userValidation_1.validateProfileUpdate, updateProfileHandler);
exports.default = router;
