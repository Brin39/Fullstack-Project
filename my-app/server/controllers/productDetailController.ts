import { Request, Response } from 'express';
import { Product } from '../models/Product';

export const getProductById = async (req: Request, res: Response) => {
     try {
          const product = await Product.findById(req.params.id);
          if (product) {
               res.json(product);
          } else {
               res.status(404).json({ message: 'Product not found' });
          }
     } catch (error) {
          res.status(500).json({ message: 'Error getting product' });
     }
}; 