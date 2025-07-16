import express, { RequestHandler } from 'express';
import { protect, isAdmin } from '../middleware/authMiddleware';
import { validateOrderStatus, validateStatusTransition } from '../middleware/orderValidation';
import { createOrder, getOrderById, getUserOrders } from '../controllers/orderController';
import { getAllOrders, getRecentOrders } from '../controllers/orderListController';
import { updateOrderStatus } from '../controllers/orderStatusController';


const router = express.Router();


router.post('/', protect as RequestHandler, createOrder);
router.get('/my-orders', protect as RequestHandler, getUserOrders);
router.get('/:id', protect as RequestHandler, getOrderById);


router.get('/recent', protect as RequestHandler, isAdmin as RequestHandler, getRecentOrders);
router.get('/admin/all-orders', protect as RequestHandler, isAdmin as RequestHandler, getAllOrders);
router.put('/:id/status',
     protect as RequestHandler,
     isAdmin as RequestHandler,
     validateOrderStatus,
     validateStatusTransition,
     updateOrderStatus
);

export default router; 