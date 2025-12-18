import { RequestHandler } from 'express';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';

const getJwtSecret = (): string => {
     const secret = process.env.JWT_SECRET;
     if (!secret) {
          throw new Error('JWT_SECRET environment variable is required');
     }
     return secret;
};

const generateToken = (id: string) => {
     return jwt.sign({ id }, getJwtSecret(), {
          expiresIn: '30d',
     });
};

export const registerUser: RequestHandler = async (req, res) => {
     try {
          const { name, email, password, role } = req.body;

          if (!name || !email || !password) {
               res.status(400).json({
                    message: 'Please provide all required fields',
                    received: { name, email, password: password ? 'provided' : 'missing' }
               });
               return;
          }

          const userExists = await User.findOne({ email });
          if (userExists) {
               res.status(400).json({ message: 'User already exists' });
               return;
          }

          const user = await User.create({
               name,
               email,
               password,
               role: role === 'admin' ? 'admin' : 'user'
          });

          res.status(201).json({
               user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
               },
               token: generateToken(user._id.toString()),
          });
     } catch (error: any) {
          res.status(400).json({
               message: 'Error during registration',
               error: error?.message || 'Unknown error'
          });
     }
};

export const loginUser: RequestHandler = async (req, res) => {
     try {
          const { email, password } = req.body;

          const user = await User.findOne({ email });
          if (!user) {
               res.status(401).json({ message: 'Invalid email or password' });
               return;
          }

          const isMatch = await user.comparePassword(password);
          if (!isMatch) {
               res.status(401).json({ message: 'Invalid email or password' });
               return;
          }

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
          res.status(400).json({
               message: 'Error logging in',
               error: error instanceof Error ? error.message : 'Unknown error',
          });
     }
}; 