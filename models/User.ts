import  { Schema, models, model } from 'mongoose';
import { hashPassword } from '../lib/passwords';
import type { User as IUser } from '../types';

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: Schema.Types.ObjectId,
    ref: 'Role',
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  try {
    this.password = await hashPassword(this.password);
    return next();
  } catch (err: any) {
    return next(err);
  }
});

export default models.User || model<IUser>('User', UserSchema);
