import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from '../controllers/cartController';

const router = express.Router();

// כל מסלולי העגלה דורשים אימות
router.use(protect);

// קבלת הסל
router.get('/', getCart);

// הוספת מוצר לעגלה
router.post('/add', addToCart);

// עדכון כמות הסחורות
router.put('/update/:productId', updateCartItem);

// מחיקת מוצר מהעגלה
router.delete('/remove/:productId', removeFromCart);

// מחיקת העגלה
router.delete('/clear', clearCart);

export default router; 