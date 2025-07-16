// עיצוב תאריך
export const formatDate = (date: string | Date): string => {
     return new Date(date).toLocaleDateString();
};

// עיצוב מחיר
export const formatPrice = (price: number): string => {
     return `$${price.toFixed(2)}`;
};

// חיתוך טקסט
export const truncateText = (text: string, maxLength: number): string => {
     if (text.length <= maxLength) return text;
     return text.slice(0, maxLength) + '...';
};

// יצירת מזהה
export const generateId = (): string => {
     return Math.random().toString(36).substr(2, 9);
};

// בדיקת דואר אלקטרוני
export const isValidEmail = (email: string): boolean => {
     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     return emailRegex.test(email);
};

// בדיקת סיסמה
export const isValidPassword = (password: string): boolean => {
     return password.length >= 6;
};

// פונקציית דיבוט
export const debounce = <T extends (...args: any[]) => any>(
     func: T,
     delay: number
): ((...args: Parameters<T>) => void) => {
     let timeoutId: NodeJS.Timeout;
     return (...args: Parameters<T>) => {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => func(...args), delay);
     };
}; 