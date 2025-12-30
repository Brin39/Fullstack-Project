import { RequestHandler } from 'express';
import Cart from '../models/Cart';
import { Product } from '../models/Product';

export const addToCart: RequestHandler = async (req, res) => {
     try {
          if (!req.user) {
               res.status(401).json({ message: 'User not authenticated' });
               return;
          }
          const { productId, quantity } = req.body;
          const userId = req.user._id;

          const product = await Product.findById(productId);
          if (!product) {
               res.status(404).json({ message: 'Product not found' });
               return;
          }

          if (product.stock < quantity) {
               res.status(400).json({ message: 'Not enough stock available' });
               return;
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
          res.status(500).json({ message: 'Error adding to cart' });
     }
};

export const getCart: RequestHandler = async (req, res) => {
     try {
          if (!req.user) {
               res.status(401).json({ message: 'User not authenticated' });
               return;
          }
          const userId = req.user._id;
          const cart = await Cart.findOne({ user: userId })
               .populate('items.product', 'name price images stock description');

          if (!cart) {
               res.status(200).json({ items: [] });
               return;
          }

          res.status(200).json(cart);
     } catch (error) {
          res.status(500).json({ message: 'Error getting cart' });
     }
};

export const updateCartItem: RequestHandler = async (req, res) => {
     try {
          if (!req.user) {
               res.status(401).json({ message: 'User not authenticated' });
               return;
          }
          const { productId } = req.params;
          const { quantity } = req.body;
          const userId = req.user._id;

          console.log(`[updateCartItem] Received: productId=${productId}, quantity=${quantity}, userId=${userId}`);

          if (quantity < 1) {
               res.status(400).json({ message: 'Quantity must be at least 1' });
               return;
          }

          const cart = await Cart.findOne({ user: userId });
          if (!cart) {
               res.status(404).json({ message: 'Cart not found' });
               return;
          }

          const itemIndex = cart.items.findIndex(
               item => item.product.toString() === productId
          );

          if (itemIndex === -1) {
               res.status(404).json({ message: 'Item not found in cart' });
               return;
          }

          console.log(`[updateCartItem] Current quantity: ${cart.items[itemIndex].quantity}, New quantity: ${quantity}`);

          const product = await Product.findById(productId);
          if (!product || product.stock < quantity) {
               res.status(400).json({ message: 'Not enough stock available' });
               return;
          }

          cart.items[itemIndex].quantity = quantity;
          await cart.save();

          const updatedCart = await Cart.findById(cart._id)
               .populate('items.product', 'name price images stock description');

          const updatedItem = updatedCart.items.find(item => item.product._id.toString() === productId);
          console.log(`[updateCartItem] Updated quantity in response: ${updatedItem?.quantity}`);

          res.status(200).json(updatedCart);
     } catch (error) {
          console.error('[updateCartItem] Error:', error);
          res.status(500).json({ message: 'Error updating cart item' });
     }
};

export const removeFromCart: RequestHandler = async (req, res) => {
     try {
          if (!req.user) {
               res.status(401).json({ message: 'User not authenticated' });
               return;
          }
          const { productId } = req.params;
          const userId = req.user._id;

          const cart = await Cart.findOne({ user: userId });
          if (!cart) {
               res.status(404).json({ message: 'Cart not found' });
               return;
          }

          cart.items = cart.items.filter(
               item => item.product.toString() !== productId
          );

          await cart.save();

          const updatedCart = await Cart.findById(cart._id)
               .populate('items.product', 'name price images stock description');

          res.status(200).json(updatedCart);
     } catch (error) {
          res.status(500).json({ message: 'Error removing from cart' });
     }
};

export const clearCart: RequestHandler = async (req, res) => {
     try {
          if (!req.user) {
               res.status(401).json({ message: 'User not authenticated' });
               return;
          }
          const userId = req.user._id;

          const cart = await Cart.findOne({ user: userId });
          if (!cart) {
               res.status(404).json({ message: 'Cart not found' });
               return;
          }

          cart.items = [];
          await cart.save();

          const updatedCart = await Cart.findById(cart._id)
               .populate('items.product', 'name price images stock description');

          res.status(200).json(updatedCart);
     } catch (error) {
          res.status(500).json({ message: 'Error clearing cart' });
     }
}; 