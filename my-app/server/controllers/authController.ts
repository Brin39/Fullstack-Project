import { Request, Response, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

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
          const { name, email, password, role, adminCode } = req.body;

          const userExists = await User.findOne({ email });
          if (userExists) {
               res.status(400).json({ message: 'User already exists' });
               return;
          }

          if (role === 'admin') {
               if (!adminCode || adminCode !== process.env.ADMIN_CREATION_CODE) {
                    res.status(403).json({
                         message: 'Unauthorized attempt to create admin account'
                    });
                    return;
               }
          }

          const user = await User.create({
               name,
               email,
               password,
               role: role || 'user'
          });

          res.status(201).json({
               _id: user._id.toString(),
               name: user.name,
               email: user.email,
               role: user.role,
               token: generateToken(user._id.toString()),
          });
     } catch (error) {
          res.status(400).json({
               message: 'Error during registration',
               error: error instanceof Error ? error.message : 'Unknown error'
          });
     }
};

export const registerAdmin: RequestHandler = async (req, res) => {
     try {
          const { name, email, password, adminCode } = req.body;

          if (!adminCode || adminCode !== process.env.ADMIN_CREATION_CODE) {
               res.status(403).json({
                    message: 'Invalid admin creation code'
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
               role: 'admin'
          });

          if (user) {
               res.status(201).json({
                    _id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    token: generateToken(user._id.toString()),
               });
          }
     } catch (error) {
          res.status(400).json({ message: 'Error during admin registration' });
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
               _id: user._id.toString(),
               name: user.name,
               email: user.email,
               role: user.role,
               token: generateToken(user._id.toString()),
          });
     } catch (error) {
          res.status(400).json({ message: 'Error during login' });
     }
}; 