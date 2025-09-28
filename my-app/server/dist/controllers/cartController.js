"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCart = exports.removeFromCart = exports.updateCartItem = exports.getCart = exports.addToCart = void 0;
const Cart_1 = __importDefault(require("../models/Cart"));
const Product_1 = require("../models/Product");
const addToCart = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        const { productId, quantity } = req.body;
        const userId = req.user._id;
        const product = await Product_1.Product.findById(productId);
        if (!product) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }
        if (product.stock < quantity) {
            res.status(400).json({ message: 'Not enough stock available' });
            return;
        }
        let cart = await Cart_1.default.findOne({ user: userId });
        if (!cart) {
            cart = new Cart_1.default({ user: userId, items: [] });
        }
        const existingItemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (existingItemIndex > -1) {
            cart.items[existingItemIndex].quantity += quantity;
        }
        else {
            cart.items.push({ product: productId, quantity });
        }
        await cart.save();
        const populatedCart = await Cart_1.default.findById(cart._id)
            .populate('items.product', 'name price images stock description');
        res.status(200).json(populatedCart);
    }
    catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ message: 'Error adding to cart' });
    }
};
exports.addToCart = addToCart;
const getCart = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        const userId = req.user._id;
        const cart = await Cart_1.default.findOne({ user: userId })
            .populate('items.product', 'name price images stock description');
        if (!cart) {
            res.status(200).json({ items: [] });
            return;
        }
        res.status(200).json(cart);
    }
    catch (error) {
        console.error('Error getting cart:', error);
        res.status(500).json({ message: 'Error getting cart' });
    }
};
exports.getCart = getCart;
const updateCartItem = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        const { productId } = req.params;
        const { quantity } = req.body;
        const userId = req.user._id;
        if (quantity < 1) {
            res.status(400).json({ message: 'Quantity must be at least 1' });
            return;
        }
        const cart = await Cart_1.default.findOne({ user: userId });
        if (!cart) {
            res.status(404).json({ message: 'Cart not found' });
            return;
        }
        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (itemIndex === -1) {
            res.status(404).json({ message: 'Item not found in cart' });
            return;
        }
        const product = await Product_1.Product.findById(productId);
        if (!product || product.stock < quantity) {
            res.status(400).json({ message: 'Not enough stock available' });
            return;
        }
        cart.items[itemIndex].quantity = quantity;
        await cart.save();
        const updatedCart = await Cart_1.default.findById(cart._id)
            .populate('items.product', 'name price images stock description');
        res.status(200).json(updatedCart);
    }
    catch (error) {
        console.error('Error updating cart item:', error);
        res.status(500).json({ message: 'Error updating cart item' });
    }
};
exports.updateCartItem = updateCartItem;
const removeFromCart = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        const { productId } = req.params;
        const userId = req.user._id;
        const cart = await Cart_1.default.findOne({ user: userId });
        if (!cart) {
            res.status(404).json({ message: 'Cart not found' });
            return;
        }
        cart.items = cart.items.filter(item => item.product.toString() !== productId);
        await cart.save();
        const updatedCart = await Cart_1.default.findById(cart._id)
            .populate('items.product', 'name price images stock description');
        res.status(200).json(updatedCart);
    }
    catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({ message: 'Error removing from cart' });
    }
};
exports.removeFromCart = removeFromCart;
const clearCart = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        const userId = req.user._id;
        const cart = await Cart_1.default.findOne({ user: userId });
        if (!cart) {
            res.status(404).json({ message: 'Cart not found' });
            return;
        }
        cart.items = [];
        await cart.save();
        const updatedCart = await Cart_1.default.findById(cart._id)
            .populate('items.product', 'name price images stock description');
        res.status(200).json(updatedCart);
    }
    catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({ message: 'Error clearing cart' });
    }
};
exports.clearCart = clearCart;
