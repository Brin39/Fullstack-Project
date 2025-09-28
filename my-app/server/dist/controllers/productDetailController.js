"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductById = void 0;
const Product_1 = require("../models/Product");
const getProductById = async (req, res) => {
    try {
        const product = await Product_1.Product.findById(req.params.id);
        if (product) {
            res.json(product);
        }
        else {
            res.status(404).json({ message: 'Product not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error getting product' });
    }
};
exports.getProductById = getProductById;
