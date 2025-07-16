import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser {
     _id: mongoose.Types.ObjectId;
     name: string;
     email: string;
     password: string;
     role: 'user' | 'admin';
     address?: string;
     phone?: string;
     comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema({
     name: {
          type: String,
          required: [true, 'Name is required'],
          trim: true
     },
     email: {
          type: String,
          required: [true, 'Email is required'],
          unique: true,
          trim: true,
          lowercase: true
     },
     password: {
          type: String,
          required: [true, 'Password is required'],
          minlength: 6
     },
     role: {
          type: String,
          enum: ['user', 'admin'],
          required: true
     },
     address: {
          type: String,
          trim: true
     },
     phone: {
          type: String,
          trim: true
     }
}, {
     timestamps: true
});


userSchema.index({ email: 1 }, { unique: true });

// שיטה להצפנת סיסמה לפני שמטפלים בה
userSchema.pre('save', async function (next) {
     if (!this.isModified('password')) return next();

     try {
          const salt = await bcrypt.genSalt(10);
          this.password = await bcrypt.hash(this.password, salt);
          next();
     } catch (error: any) {
          next(error);
     }
});

// שיטה לבדיקת סיסמה
userSchema.methods.comparePassword = async function (candidatePassword: string) {
     return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema); 