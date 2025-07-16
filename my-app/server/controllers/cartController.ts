import { Request, Response } from 'express';
import Cart from '../models/Cart';
import { Product } from '../models/Product';

export const addToCart = async (req: Request, res: Response) => {
     try {
          if (!req.user) {
               return res.status(401).json({ message: 'User not authenticated' });
          }
          const { productId, quantity } = req.body;
          const userId = req.user._id;

          const product = await Product.findById(productId);
          if (!product) {
               return res.status(404).json({ message: 'Product not found' });
          }

          if (product.stock < quantity) {
               return res.status(400).json({ message: 'Not enough stock available' });
          }

          let cart = await Cart.findOne({ user: userId });
          if (!cart) {
               cart = new Cart({ user: userId, items: [] });
          }

          const existingItemIndex = cart.items.findIndex(
               item => item.product.toString() === productId
          );

          if (existingItemIndex > -1) {
               cart.items[existingItemIndex].quantity += quantity;
          } else {
               cart.items.push({ product: productId, quantity });
          }

          await cart.save();

          const populatedCart = await Cart.findById(cart._id)
               .populate('items.product', 'name price images stock description');

          res.status(200).json(populatedCart);
     } catch (error) {
          console.error('Error adding to cart:', error);
          res.status(500).json({ message: 'Error adding to cart' });
     }
};

export const getCart = async (req: Request, res: Response) => {
     try {
          if (!req.user) {
               return res.status(401).json({ message: 'User not authenticated' });
          }
          const userId = req.user._id;
          const cart = await Cart.findOne({ user: userId })
               .populate('items.product', 'name price images stock description');

          if (!cart) {
               return res.status(200).json({ items: [] });
          }

          res.status(200).json(cart);
     } catch (error) {
          console.error('Error getting cart:', error);
          res.status(500).json({ message: 'Error getting cart' });
     }
};

export const updateCartItem = async (req: Request, res: Response) => {
     try {
          if (!req.user) {
               return res.status(401).json({ message: 'User not authenticated' });
          }
          const { productId } = req.params;
          const { quantity } = req.body;
          const userId = req.user._id;

          if (quantity < 1) {
               return res.status(400).json({ message: 'Quantity must be at least 1' });
          }

          const cart = await Cart.findOne({ user: userId });
          if (!cart) {
               return res.status(404).json({ message: 'Cart not found' });
          }

          const itemIndex = cart.items.findIndex(
               item => item.product.toString() === productId
          );

          if (itemIndex === -1) {
               return res.status(404).json({ message: 'Item not found in cart' });
          }

          const product = await Product.findById(productId);
          if (!product || product.stock < quantity) {
               return res.status(400).json({ message: 'Not enough stock available' });
          }

          cart.items[itemIndex].quantity = quantity;
          await cart.save();

          const updatedCart = await Cart.findById(cart._id)
               .populate('items.product', 'name price images stock description');

          res.status(200).json(updatedCart);
     } catch (error) {
          console.error('Error updating cart item:', error);
          res.status(500).json({ message: 'Error updating cart item' });
     }
};

export const removeFromCart = async (req: Request, res: Response) => {
     try {
          if (!req.user) {
               return res.status(401).json({ message: 'User not authenticated' });
          }
          const { productId } = req.params;
          const userId = req.user._id;

          const cart = await Cart.findOne({ user: userId });
          if (!cart) {
               return res.status(404).json({ message: 'Cart not found' });
          }

          cart.items = cart.items.filter(
               item => item.product.toString() !== productId
          );

          await cart.save();

          const updatedCart = await Cart.findById(cart._id)
               .populate('items.product', 'name price images stock description');

          res.status(200).json(updatedCart);
     } catch (error) {
          console.error('Error removing from cart:', error);
          res.status(500).json({ message: 'Error removing from cart' });
     }
};

export const clearCart = async (req: Request, res: Response) => {
     try {
          if (!req.user) {
               return res.status(401).json({ message: 'User not authenticated' });
          }
          const userId = req.user._id;

          const cart = await Cart.findOne({ user: userId });
          if (!cart) {
               return res.status(404).json({ message: 'Cart not found' });
          }

          cart.items = [];
          await cart.save();

          const updatedCart = await Cart.findById(cart._id)
               .populate('items.product', 'name price images stock description');

          res.status(200).json(updatedCart);
     } catch (error) {
          console.error('Error clearing cart:', error);
          res.status(500).json({ message: 'Error clearing cart' });
     }
}; 