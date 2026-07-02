import mongoose, { Schema, Document } from 'mongoose';

export interface UserDocument extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'customer' | 'admin' | 'staff';
  image?: string;
  phone?: string;
  emailVerified: boolean;
  firebaseUid?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, select: false },
    role: {
      type: String,
      enum: ['customer', 'admin', 'staff'],
      default: 'customer',
    },
    image: { type: String },
    phone: { type: String, trim: true },
    emailVerified: { type: Boolean, default: false },
    firebaseUid: { type: String, unique: true, sparse: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 });
UserSchema.index({ firebaseUid: 1 });

export const User = mongoose.models.User || mongoose.model<UserDocument>('User', UserSchema);
