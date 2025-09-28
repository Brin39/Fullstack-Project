"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMimeTypeFromBase64 = exports.isValidBase64Image = exports.convertImageToBase64 = void 0;
/**
 * Converts image file to Base64 string
 * @param file - Image file
 * @returns Promise with Base64 string
 */
const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};
exports.convertImageToBase64 = convertImageToBase64;
/**
 * Checks if string is a valid Base64 image
 * @param str - String to check
 * @returns boolean
 */
const isValidBase64Image = (str) => {
    if (!str)
        return false;
    // Check if string starts with data:image
    return str.startsWith('data:image');
};
exports.isValidBase64Image = isValidBase64Image;
/**
 * Gets MIME type from Base64 string
 * @param base64String - Base64 string
 * @returns MIME type or null
 */
const getMimeTypeFromBase64 = (base64String) => {
    const matches = base64String.match(/^data:([A-Za-z-+/]+);base64,/);
    return matches ? matches[1] : null;
};
exports.getMimeTypeFromBase64 = getMimeTypeFromBase64;
