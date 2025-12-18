import express, { RequestHandler } from 'express';
import { getProducts } from '../controllers/productListController';
import { getProductById } from '../controllers/productDetailController';
import { createProduct, updateProduct, deleteProduct } from '../controllers/productAdminController';
import { protect, isAdmin } from '../middleware/authMiddleware';
import { Product } from '../models/Product';

const router = express.Router();

// מסלול לחיפוש לפי מילות מפתח
const searchHandler: RequestHandler = async (req, res) => {
     try {
          const { query } = req.query;
          if (!query) {
               res.status(400).json({ message: 'Search query is required' });
               return;
          }

          // נסה חיפוש טקסטואלי אם יש אינדקס טקסט; אחרת ניפול לחיפוש רגולרי
          try {
               const textResults = await Product.find(
                    { $text: { $search: query as string } },
                    { score: { $meta: 'textScore' } }
               )
                    .sort({ score: { $meta: 'textScore' } })
                    .limit(20);

               if (textResults.length > 0) {
                    res.json(textResults);
                    return;
               }
          } catch (_err) {
               // אין אינדקס טקסט או שגיאה אחרת – נמשיך לחיפוש רגולרי
          }

          const regexProducts = await Product.find({
               $or: [
                    { name: { $regex: query as string, $options: 'i' } },
                    { description: { $regex: query as string, $options: 'i' } }
               ]
          }).limit(20);
          res.json(regexProducts);
     } catch (error) {
          res.status(500).json({ message: 'Error searching products' });
     }
};

// נתיבים ציבוריים
router.get('/', getProducts as RequestHandler);
// שים את /search לפני /:id כדי למנוע התנגשות עם נתיב דינמי
router.get('/search', searchHandler as RequestHandler);
router.get('/:id', getProductById as RequestHandler);

// נתיבי ניהול
router.post('/', protect as RequestHandler, isAdmin as RequestHandler, createProduct as RequestHandler);
router.put('/:id', protect as RequestHandler, isAdmin as RequestHandler, updateProduct as RequestHandler);
router.delete('/:id', protect as RequestHandler, isAdmin as RequestHandler, deleteProduct as RequestHandler);

export default router;