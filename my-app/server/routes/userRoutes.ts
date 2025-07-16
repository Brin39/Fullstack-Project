import express, { RequestHandler } from 'express';
import { registerUser, loginUser } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';
import { User } from '../models/User';
import {
     validateRegistration,
     validateLogin,
     validateProfileUpdate
} from '../middleware/userValidation';

const router = express.Router();

// נתיבי אימות
router.post('/register', validateRegistration, registerUser as RequestHandler);
router.post('/login', validateLogin, loginUser as RequestHandler);

// בסיס פעולות משתמש
router.get('/profile', protect as RequestHandler, async (req, res) => {
     try {
          const user = await User.findById(req.user?._id).select('-password');
          if (!user) {
               return res.status(401).json({ message: 'User not found' });
          }
          res.json(user);
     } catch (error) {
          res.status(500).json({ message: 'Error getting user profile' });
     }
});

router.put('/profile',
     protect as RequestHandler,
     validateProfileUpdate,
     async (req, res) => {
          try {
               const { name, email, address, phone } = req.body;
               const user = await User.findByIdAndUpdate(
                    req.user?._id,
                    { name, email, address, phone },
                    { new: true }
               ).select('-password');

               res.json(user);
          } catch (error) {
               res.status(500).json({ message: 'Error updating profile' });
          }
     }
);

export default router; 