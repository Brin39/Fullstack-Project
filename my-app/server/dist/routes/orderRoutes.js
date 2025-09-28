"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const orderValidation_1 = require("../middleware/orderValidation");
const orderController_1 = require("../controllers/orderController");
const orderListController_1 = require("../controllers/orderListController");
const orderStatusController_1 = require("../controllers/orderStatusController");
const router = express_1.default.Router();
router.post('/', authMiddleware_1.protect, orderController_1.createOrder);
router.get('/my-orders', authMiddleware_1.protect, orderController_1.getUserOrders);
router.get('/:id', authMiddleware_1.protect, orderController_1.getOrderById);
router.get('/recent', authMiddleware_1.protect, authMiddleware_1.isAdmin, orderListController_1.getRecentOrders);
router.get('/admin/all-orders', authMiddleware_1.protect, authMiddleware_1.isAdmin, orderListController_1.getAllOrders);
router.put('/:id/status', authMiddleware_1.protect, authMiddleware_1.isAdmin, orderValidation_1.validateOrderStatus, orderValidation_1.validateStatusTransition, orderStatusController_1.updateOrderStatus);
exports.default = router;
