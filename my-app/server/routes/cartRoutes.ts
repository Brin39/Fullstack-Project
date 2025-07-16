import express from 'express';
import { addToCart, getCart, updateCartItem, removeFromCart, clearCart } from '../controllers/cartController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);

router.post('/', addToCart);

router.get('/', getCart);

router.put('/update/:productId', updateCartItem);

router.delete('/clear', clearCart);

router.delete('/:productId', removeFromCart);

export default router; 