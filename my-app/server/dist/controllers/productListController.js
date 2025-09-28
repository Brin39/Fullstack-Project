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
        // Если указаны параметры пагинации, используем их, иначе возвращаем все продукты
        if (page && limit) {
            const products = await Product_1.Product.find(query)
                .sort(sortOptions)
                .skip((Number(page) - 1) * Number(limit))
                .limit(Number(limit));
            const total = await Product_1.Product.countDocuments(query);
            res.json({
                products,
                currentPage: Number(page),
                totalPages: Math.ceil(total / Number(limit)),
                totalProducts: total
            });
        }
        else {
            // Возвращаем все продукты без пагинации
            const products = await Product_1.Product.find(query).sort(sortOptions);
            res.json({ products });
        }
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
