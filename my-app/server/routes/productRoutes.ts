import express, { RequestHandler } from 'express';
import { getProducts } from '../controllers/productListController';
import { getProductById } from '../controllers/productDetailController';
import { createProduct, updateProduct, deleteProduct } from '../controllers/productAdminController';
import { protect, isAdmin } from '../middleware/authMiddleware';
import { Product } from '../models/Product';

const router = express.Router();

// נתיבים ציבוריים
router.get('/', getProducts as RequestHandler);
router.get('/:id', getProductById as RequestHandler);

// נתיבי ניהול
router.post('/', protect as RequestHandler, isAdmin as RequestHandler, createProduct as RequestHandler);
router.put('/:id', protect as RequestHandler, isAdmin as RequestHandler, updateProduct as RequestHandler);
router.delete('/:id', protect as RequestHandler, isAdmin as RequestHandler, deleteProduct as RequestHandler);

// מסלול לחיפוש לפי מילות מפתח
router.get('/search', async (req, res) => {
     try {
          const { query } = req.query;
          if (!query) {
               return res.status(400).json({ message: 'Search query is required' });
          }

          const products = await Product.find(
               { $text: { $search: query as string } },
               { score: { $meta: "textScore" } }
          )
               .sort({ score: { $meta: "textScore" } })
               .limit(20);

          // אם אין תוצאות לחיפוש טקסט, נסה חיפוש על ידי ביטוי רגולרי
          if (products.length === 0) {
               const regexProducts = await Product.find({
                    $or: [
                         { name: { $regex: query, $options: 'i' } },
                         { description: { $regex: query, $options: 'i' } }
                    ]
               }).limit(20);
               return res.json(regexProducts);
          }

          res.json(products);
     } catch (error) {
          console.error('Search error:', error);
          res.status(500).json({ message: 'Error searching products' });
     }
});

export default router; 