import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { Types } from 'mongoose';

interface JwtPayload {
     id: string;
     isAdmin: boolean;
}

declare global {
     namespace Express {
          interface Request {
               user?: {
                    _id: Types.ObjectId;
                    role?: string;
                    [key: string]: any;
               };
          }
     }
}

const getJwtSecret = (): string => {
     const secret = process.env.JWT_SECRET;
     if (!secret) {
          throw new Error('JWT_SECRET environment variable is required');
     }
     return secret;
};

export const protect: RequestHandler = async (req, res, next) => {
     try {
          let token;

          if (req.headers.authorization?.startsWith('Bearer')) {
               token = req.headers.authorization.split(' ')[1];
          }

          if (!token) {
               res.status(401).json({ message: 'Not authorized, no token' });
               return;
          }

          const decoded = jwt.verify(token, getJwtSecret()) as JwtPayload;

          const user = await User.findById(decoded.id).select('-password');
          if (!user) {
               res.status(401).json({ message: 'User not found' });
               return;
          }

          req.user = {
               ...user.toObject(),
               _id: user._id
          };

          next();
     } catch (error) {
          res.status(401).json({ message: 'Not authorized, token failed' });
     }
};

export const isAdmin: RequestHandler = async (req, res, next) => {
     try {
          if (!req.user) {
               res.status(401).json({ message: 'Not authorized' });
               return;
          }

          const user = await User.findById(req.user._id);

          if (!user || user.role !== 'admin') {
               res.status(403).json({ message: 'Access denied' });
               return;
          }

          next();
     } catch (err: any) {
          res.status(500).json({ message: err.message });
     }
}; 