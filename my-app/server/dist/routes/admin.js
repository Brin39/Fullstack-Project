"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const productAdminController_1 = require("../controllers/productAdminController");
const adminStatsController_1 = require("../controllers/adminStatsController");
const adminUserController_1 = require("../controllers/adminUserController");
const adminOrderController_1 = require("../controllers/adminOrderController");
const authController_1 = require("../controllers/authController");
const router = express_1.default.Router();
// בדיקת זכויות מנהל
router.get('/check-admin', authMiddleware_1.protect, authMiddleware_1.isAdmin, (req, res) => {
    console.log('User in check-admin:', req.user);
    res.json({
        message: 'Admin access granted',
        name: req.user?.name,
        email: req.user?.email,
        role: req.user?.role
    });
});
// רישום מנהל
router.post('/register', authController_1.registerAdmin);
// סטָטִיסטִיקָה
router.get('/stats', authMiddleware_1.protect, authMiddleware_1.isAdmin, adminStatsController_1.getStats);
// ניהול משתמשים 
router.get('/users/:id/details', authMiddleware_1.protect, authMiddleware_1.isAdmin, adminUserController_1.getUserDetails);
router.get('/users', authMiddleware_1.protect, authMiddleware_1.isAdmin, adminUserController_1.getUsers);
router.put('/users/:id', authMiddleware_1.protect, authMiddleware_1.isAdmin, adminUserController_1.updateUser);
router.delete('/users/:id', authMiddleware_1.protect, authMiddleware_1.isAdmin, adminUserController_1.deleteUser);
// ניהול מוצרים
router.get('/products', authMiddleware_1.protect, authMiddleware_1.isAdmin, productAdminController_1.getProducts);
router.get('/products/best-offers', productAdminController_1.getBestOfferProducts);
router.post('/products/migrate', authMiddleware_1.protect, authMiddleware_1.isAdmin, productAdminController_1.migrateProducts);
router.post('/products', authMiddleware_1.protect, authMiddleware_1.isAdmin, productAdminController_1.createProduct);
router.put('/products/:id', authMiddleware_1.protect, authMiddleware_1.isAdmin, productAdminController_1.updateProduct);
router.delete('/products/:id', authMiddleware_1.protect, authMiddleware_1.isAdmin, productAdminController_1.deleteProduct);
// ניהול פעולות
router.get('/orders', authMiddleware_1.protect, authMiddleware_1.isAdmin, adminOrderController_1.getOrders);
router.put('/orders/:id', authMiddleware_1.protect, authMiddleware_1.isAdmin, adminOrderController_1.updateOrderStatus);
router.delete('/orders/:id', authMiddleware_1.protect, authMiddleware_1.isAdmin, adminOrderController_1.deleteOrder);
exports.default = router;
