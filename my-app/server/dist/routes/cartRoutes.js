"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cartController_1 = require("../controllers/cartController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.use(authMiddleware_1.protect);
router.post('/', cartController_1.addToCart);
router.get('/', cartController_1.getCart);
router.put('/update/:productId', cartController_1.updateCartItem);
router.delete('/clear', cartController_1.clearCart);
router.delete('/:productId', cartController_1.removeFromCart);
exports.default = router;
