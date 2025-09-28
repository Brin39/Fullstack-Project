import { RequestHandler } from 'express';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';

// צור אסימון JWT
const generateToken = (id: string) => {
     return jwt.sign({ id }, process.env.JWT_SECRET || 'your_jwt_secret', {
          expiresIn: '30d',
     });
};

// רישום משתמש
export const registerUser: RequestHandler = async (req, res) => {
     try {
          console.log('=== Registration Start ===');
          console.log('1. Raw request body:', req.body);

          const { name, email, password, role } = req.body;
          console.log('2. Extracted data:', { name, email, role });

          if (!name || !email || !password) {
               console.log('3. Missing required fields');
               res.status(400).json({
                    message: 'Please provide all required fields',
                    received: { name, email, password: password ? 'provided' : 'missing' }
               });
               return;
          }

          console.log('4. Checking if user exists');
          const userExists = await User.findOne({ email });
          if (userExists) {
               console.log('5. User already exists');
               res.status(400).json({ message: 'User already exists' });
               return;
          }

          console.log('6. Creating user with data:', { name, email, role });
          try {
               const user = await User.create({
                    name,
                    email,
                    password,
                    role: role === 'admin' ? 'admin' : 'user'
               });
               console.log('7. User created successfully:', user.toObject());

               const response = {
                    user: {
                         id: user._id,
                         name: user.name,
                         email: user.email,
                         role: user.role,
                    },
                    token: generateToken(user._id.toString()),
               };
               console.log('8. Sending response:', response);
               res.status(201).json(response);
          } catch (createError) {
               console.error('Error during user creation:', createError);
               throw createError;
          }
     } catch (error: any) {
          console.error('=== Registration Error ===');
          console.error('Error type:', error?.constructor?.name);
          console.error('Error message:', error?.message);
          console.error('Error stack:', error?.stack);
          res.status(400).json({
               message: 'Error during registration',
               error: error?.message || 'Unknown error',
               details: error?.stack
          });
     }
};

// כניסת משתמש
export const loginUser: RequestHandler = async (req, res) => {
     try {
          const { email, password } = req.body;

          // מציאת משתמש
          const user = await User.findOne({ email });
          if (!user) {
               res.status(401).json({ message: 'Invalid email or password' });
               return;
          }

          // בדיקת סיסמה
          const isMatch = await user.comparePassword(password);
          if (!isMatch) {
               res.status(401).json({ message: 'Invalid email or password' });
               return;
          }

          // שלח תשובה
          res.json({
               user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
               },
               token: generateToken(user._id.toString()),
          });
     } catch (error) {
          console.error('Error in loginUser:', error);
          res.status(400).json({
               message: 'Error logging in',
               error: error instanceof Error ? error.message : 'Unknown error',
          });
     }
}; 