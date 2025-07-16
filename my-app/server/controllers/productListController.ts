import { Request, Response } from 'express';
import { Product } from '../models/Product';

export const getProducts = async (req: Request, res: Response) => {
     try {
          const {
               page,
               limit,
               sort = 'createdAt',
               order = 'desc',
               minPrice,
               maxPrice,
               search
          } = req.query;

          const query: any = {};

          // סנן לפי מחיר
          if (minPrice || maxPrice) {
               query.price = {};
               if (minPrice) query.price.$gte = Number(minPrice);
               if (maxPrice) query.price.$lte = Number(maxPrice);
          }

          // חיפוש לפי שם ותיאור
          if (search) {
               query.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
               ];
          }

          // מיון
          const sortOptions: any = {};
          sortOptions[sort as string] = order === 'desc' ? -1 : 1;

          // Если указаны параметры пагинации, используем их, иначе возвращаем все продукты
          if (page && limit) {
               const products = await Product.find(query)
                    .sort(sortOptions)
                    .skip((Number(page) - 1) * Number(limit))
                    .limit(Number(limit));

               const total = await Product.countDocuments(query);

               res.json({
                    products,
                    currentPage: Number(page),
                    totalPages: Math.ceil(total / Number(limit)),
                    totalProducts: total
               });
          } else {
               // Возвращаем все продукты без пагинации
               const products = await Product.find(query).sort(sortOptions);
               res.json({ products });
          }
     } catch (error) {
          console.error('Error in getProducts:', error);
          res.status(500).json({
               message: 'Error getting products',
               error: error instanceof Error ? error.message : 'Unknown error'
          });
     }
}; 