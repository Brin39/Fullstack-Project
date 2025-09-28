"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const cartController_1 = require("../controllers/cartController");
const router = express_1.default.Router();
// כל מסלולי העגלה דורשים אימות
router.use(authMiddleware_1.protect);
// קבלת הסל
router.get('/', cartController_1.getCart);
// הוספת מוצר לעגלה
router.post('/add', cartController_1.addToCart);
// עדכון כמות הסחורות
router.put('/update/:productId', cartController_1.updateCartItem);
// מחיקת מוצר מהעגלה
router.delete('/remove/:productId', cartController_1.removeFromCart);
// מחיקת העגלה
router.delete('/clear', cartController_1.clearCart);
exports.default = router;
