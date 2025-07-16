import { Request, Response } from 'express';
import { Product } from '../models/Product';

export const createProduct = async (req: Request, res: Response) => {
     try {
          console.log('Create product request body:', req.body);

          const { name, price, description, images, category, stock, bestOffer } = req.body;

          console.log('Extracted fields:', { name, price, description, images, category, stock, bestOffer });

          const product = await Product.create({
               name,
               price,
               description,
               images: images || [],
               category,
               stock,
               bestOffer: bestOffer || false
          });

          console.log('Product created successfully:', product);
          res.status(201).json(product);
     } catch (error) {
          console.error('Create product error:', error);
          res.status(400).json({
               message: 'Error creating product',
               error: error instanceof Error ? error.message : String(error)
          });
     }
};

export const updateProduct = async (req: Request, res: Response) => {
     try {
          console.log('Update product request body:', req.body);
          console.log('Product ID:', req.params.id);

          const { name, price, description, images, category, stock, bestOffer } = req.body;

          const product = await Product.findById(req.params.id);
          console.log('Found product:', product);

          if (product) {
               product.name = name || product.name;
               product.price = price !== undefined ? price : product.price;
               product.description = description || product.description;
               product.images = images !== undefined ? images : (product.images || []);
               product.category = category || product.category || "General";
               product.stock = stock !== undefined ? stock : product.stock;
               product.bestOffer = bestOffer !== undefined ? bestOffer : (product.bestOffer || false);

               console.log('Product before save:', product);
               const updatedProduct = await product.save();
               console.log('Product after save:', updatedProduct);
               res.json(updatedProduct);
          } else {
               console.log('Product not found');
               res.status(404).json({ message: 'Product not found' });
          }
     } catch (error) {
          console.error('Update product error:', error);
          res.status(400).json({
               message: 'Error updating product',
               error: error instanceof Error ? error.message : String(error)
          });
     }
};

export const deleteProduct = async (req: Request, res: Response) => {
     try {
          const product = await Product.findById(req.params.id);

          if (product) {
               await product.deleteOne();
               res.json({ message: 'Product deleted' });
          } else {
               res.status(404).json({ message: 'Product not found' });
          }
     } catch (error) {
          res.status(500).json({ message: 'Error deleting product' });
     }
};

export const getProducts = async (req: Request, res: Response) => {
     try {
          const products = await Product.find({});
          res.json(products);
     } catch (error) {
          res.status(500).json({ message: 'Error fetching products' });
     }
};

export const getBestOfferProducts = async (req: Request, res: Response) => {
     try {
          const products = await Product.find({ bestOffer: true });
          res.json(products);
     } catch (error) {
          res.status(500).json({ message: 'Error fetching best offer products' });
     }
};

export const migrateProducts = async (req: Request, res: Response) => {
     try {

          const result = await Product.updateMany(
               { bestOffer: { $exists: false } },
               { $set: { bestOffer: false } }
          );

          console.log('Migration result:', result);
          res.json({
               message: 'Products migrated successfully',
               modifiedCount: result.modifiedCount
          });
     } catch (error) {
          console.error('Migration error:', error);
          res.status(500).json({ message: 'Error migrating products' });
     }
}; 