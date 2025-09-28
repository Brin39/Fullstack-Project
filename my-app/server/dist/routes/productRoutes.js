"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productListController_1 = require("../controllers/productListController");
const productDetailController_1 = require("../controllers/productDetailController");
const productAdminController_1 = require("../controllers/productAdminController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const Product_1 = require("../models/Product");
const router = express_1.default.Router();
// נתיבים ציבוריים
router.get('/', productListController_1.getProducts);
router.get('/:id', productDetailController_1.getProductById);
// נתיבי ניהול
router.post('/', authMiddleware_1.protect, authMiddleware_1.isAdmin, productAdminController_1.createProduct);
router.put('/:id', authMiddleware_1.protect, authMiddleware_1.isAdmin, productAdminController_1.updateProduct);
router.delete('/:id', authMiddleware_1.protect, authMiddleware_1.isAdmin, productAdminController_1.deleteProduct);
// מסלול לחיפוש לפי מילות מפתח
const searchHandler = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            res.status(400).json({ message: 'Search query is required' });
            return;
        }
        const products = await Product_1.Product.find({ $text: { $search: query } }, { score: { $meta: "textScore" } })
            .sort({ score: { $meta: "textScore" } })
            .limit(20);
        // אם אין תוצאות לחיפוש טקסט, נסה חיפוש על ידי ביטוי רגולרי
        if (products.length === 0) {
            const regexProducts = await Product_1.Product.find({
                $or: [
                    { name: { $regex: query, $options: 'i' } },
                    { description: { $regex: query, $options: 'i' } }
                ]
            }).limit(20);
            res.json(regexProducts);
            return;
        }
        res.json(products);
    }
    catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ message: 'Error searching products' });
    }
};
router.get('/search', searchHandler);
exports.default = router;
