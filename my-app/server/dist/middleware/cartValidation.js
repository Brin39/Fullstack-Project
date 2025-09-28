"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCartItem = void 0;
const validateCartItem = (quantity) => {
    return quantity > 0 && Number.isInteger(quantity);
};
exports.validateCartItem = validateCartItem;
