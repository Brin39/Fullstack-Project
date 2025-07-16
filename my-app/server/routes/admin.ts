import express, { RequestHandler } from 'express';
import { protect, isAdmin } from '../middleware/authMiddleware';
import {
     createProduct,
     updateProduct,
     deleteProduct,
     getProducts,
     getBestOfferProducts,
     migrateProducts
} from '../controllers/productAdminController';
import { getStats } from '../controllers/adminStatsController';
import { getUsers, updateUser, deleteUser, getUserDetails } from '../controllers/adminUserController';
import { getOrders, updateOrderStatus, deleteOrder } from '../controllers/adminOrderController';
import { registerAdmin } from '../controllers/authController';

const router = express.Router();

// בדיקת זכויות מנהל
router.get('/check-admin', protect, isAdmin, (req, res) => {
     console.log('User in check-admin:', req.user);
     res.json({
          message: 'Admin access granted',
          name: req.user?.name,
          email: req.user?.email,
          role: req.user?.role
     });
});

// רישום מנהל
router.post('/register', registerAdmin as RequestHandler);

// סטָטִיסטִיקָה
router.get('/stats', protect as RequestHandler, isAdmin as RequestHandler, getStats as RequestHandler);

// ניהול משתמשים 
router.get('/users/:id/details', protect as RequestHandler, isAdmin as RequestHandler, getUserDetails as RequestHandler);
router.get('/users', protect as RequestHandler, isAdmin as RequestHandler, getUsers as RequestHandler);
router.put('/users/:id', protect as RequestHandler, isAdmin as RequestHandler, updateUser as RequestHandler);
router.delete('/users/:id', protect as RequestHandler, isAdmin as RequestHandler, deleteUser as RequestHandler);

// ניהול מוצרים
router.get('/products', protect as RequestHandler, isAdmin as RequestHandler, getProducts as RequestHandler);
router.get('/products/best-offers', getBestOfferProducts as RequestHandler);
router.post('/products/migrate', protect as RequestHandler, isAdmin as RequestHandler, migrateProducts as RequestHandler);
router.post('/products', protect as RequestHandler, isAdmin as RequestHandler, createProduct as RequestHandler);
router.put('/products/:id', protect as RequestHandler, isAdmin as RequestHandler, updateProduct as RequestHandler);
router.delete('/products/:id', protect as RequestHandler, isAdmin as RequestHandler, deleteProduct as RequestHandler);

// ניהול פעולות
router.get('/orders', protect as RequestHandler, isAdmin as RequestHandler, getOrders as RequestHandler);
router.put('/orders/:id', protect as RequestHandler, isAdmin as RequestHandler, updateOrderStatus as RequestHandler);
router.delete('/orders/:id', protect as RequestHandler, isAdmin as RequestHandler, deleteOrder as RequestHandler);

export default router; 