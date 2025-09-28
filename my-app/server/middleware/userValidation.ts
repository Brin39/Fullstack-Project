import { RequestHandler } from 'express';
import { User } from '../models/User';

// אימות דוא"ל
const isValidEmail = (email: string): boolean => {
     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     return emailRegex.test(email);
};

// אימות שם
const isValidName = (name: string): boolean => {
     return name.length >= 2 && name.length <= 50;
};

// תוכנת ביניים לאימות הרשמה
export const validateRegistration: RequestHandler = async (req, res, next) => {
     const { name, email, password } = req.body;

     if (!name || !email || !password) {
          res.status(400).json({ message: 'All fields are required for registration' });
          return;
     }

     if (!isValidName(name)) {
          res.status(400).json({ message: 'Name must be between 2 and 50 characters' });
          return;
     }

     if (!isValidEmail(email)) {
          res.status(400).json({ message: 'Invalid email format' });
          return;
     }

     if (password.length < 6) {
          res.status(400).json({
               message: 'Password must be at least 6 characters long, including letters and numbers'
          });
          return;
     }

     // אימות ייחודיות של דוא"ל
     const existingUser = await User.findOne({ email });
     if (existingUser) {
          res.status(400).json({ message: 'User with this email already exists' });
          return;
     }

     next();
};

// תוכנת ביניים לאימות עדכון פרופיל
export const validateProfileUpdate: RequestHandler = async (req, res, next) => {
     const { name, email } = req.body;

     if (name && !isValidName(name)) {
          res.status(400).json({ message: 'Name must be between 2 and 50 characters' });
          return;
     }

     if (email && !isValidEmail(email)) {
          res.status(400).json({ message: 'Invalid email format' });
          return;
     }

     // אימות ייחודיות של דוא"ל
     if (email) {
          const existingUser = await User.findOne({
               email,
               _id: { $ne: req.user?._id }
          });
          if (existingUser) {
               res.status(400).json({ message: 'User with this email already exists' });
               return;
          }
     }

     next();
};

// תוכנת ביניים לאימות כניסה
export const validateLogin: RequestHandler = (req, res, next) => {
     const { email, password } = req.body;

     if (!email || !password) {
          res.status(400).json({ message: 'Email and password are required' });
          return;
     }

     if (!isValidEmail(email)) {
          res.status(400).json({ message: 'Invalid email format' });
          return;
     }

     if (password.length < 6) {
          res.status(400).json({ message: 'Password must be at least 6 characters long' });
          return;
     }

     next();
}; 