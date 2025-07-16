/**
 * Converts image file to Base64 string
 * @param file - Image file
 * @returns Promise with Base64 string
 */
export const convertImageToBase64 = (file: File): Promise<string> => {
     return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (error) => reject(error);
     });
};

/**
 * Checks if string is a valid Base64 image
 * @param str - String to check
 * @returns boolean
 */
export const isValidBase64Image = (str: string): boolean => {
     if (!str) return false;
     // Check if string starts with data:image
     return str.startsWith('data:image');
};

/**
 * Gets MIME type from Base64 string
 * @param base64String - Base64 string
 * @returns MIME type or null
 */
export const getMimeTypeFromBase64 = (base64String: string): string | null => {
     const matches = base64String.match(/^data:([A-Za-z-+/]+);base64,/);
     return matches ? matches[1] : null;
}; 