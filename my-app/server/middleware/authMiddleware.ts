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

export const protect: RequestHandler = async (req, res, next) => {
     try {
          let token;

          // בדוק את הטוקן בכותרת ההרשאה
          if (req.headers.authorization?.startsWith('Bearer')) {
               token = req.headers.authorization.split(' ')[1];
               console.log('Token from Authorization header:', token);
          }

          if (!token) {
               console.log('No token provided');
               res.status(401).json({ message: 'Not authorized, no token' });
               return;
          }

          const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret') as JwtPayload;
          console.log('Decoded token:', decoded);

          const user = await User.findById(decoded.id).select('-password');
          if (!user) {
               res.status(401).json({ message: 'User not found' });
               return;
          }

          req.user = {
               ...user.toObject(),
               _id: user._id
          };
          console.log('User found:', req.user);

          next();
     } catch (error) {
          console.error('Auth middleware error:', error);
          res.status(401).json({ message: 'Not authorized, token failed' });
     }
};

export const isAdmin: RequestHandler = async (req, res, next) => {
     try {
          console.log('Checking admin role. User:', req.user);

          if (!req.user) {
               console.log('No user found in request');
               res.status(401).json({ message: 'Not authorized' });
               return;
          }

          const user = await User.findById(req.user._id);
          console.log('Found user in database:', user);

          if (!user || user.role !== 'admin') {
               console.log('Admin access denied. User role:', user?.role);
               res.status(403).json({ message: 'Access denied' });
               return;
          }

          console.log('Admin access granted');
          next();
     } catch (err: any) {
          console.error('Admin check error:', err);
          res.status(500).json({ message: err.message });
     }
}; 