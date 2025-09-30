"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProducts = void 0;
const Product_1 = require("../models/Product");
const getProducts = async (req, res) => {
    try {
        const { page, limit, sort = 'createdAt', order = 'desc', minPrice, maxPrice, search } = req.query;
        const query = {};
        // סנן לפי מחיר
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice)
                query.price.$gte = Number(minPrice);
            if (maxPrice)
                query.price.$lte = Number(maxPrice);
        }
        // חיפוש לפי שם ותיאור
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        // מיון
        const sortOptions = {};
        sortOptions[sort] = order === 'desc' ? -1 : 1;
        const pageNum = Number(page) || 1;
        const limitNum = Math.min(Number(limit) || 20, 100);
        const projection = 'name price images createdAt updatedAt bestOffer category stock description';
        const products = await Product_1.Product.find(query)
            .sort(sortOptions)
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum)
            .select(projection)
            .lean();
        const total = await Product_1.Product.countDocuments(query);
        res.json({
            products,
            currentPage: pageNum,
            totalPages: Math.ceil(total / limitNum),
            totalProducts: total
        });
    }
    catch (error) {
        console.error('Error in getProducts:', error);
        res.status(500).json({
            message: 'Error getting products',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getProducts = getProducts;
