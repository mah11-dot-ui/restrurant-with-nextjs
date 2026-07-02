import mongoose, { Schema, Document } from 'mongoose';

export interface ReservationDocument extends Document {
  user?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  date: Date;
  time: string;
  guests: number;
  tableNumber?: number;
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

const ReservationSchema = new Schema<ReservationDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    guests: { type: Number, required: true, min: 1 },
    tableNumber: { type: Number },
    specialRequests: { type: String, trim: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

ReservationSchema.index({ date: 1, time: 1 });
ReservationSchema.index({ user: 1 });
ReservationSchema.index({ email: 1 });

export const Reservation =
  mongoose.models.Reservation ||
  mongoose.model<ReservationDocument>('Reservation', ReservationSchema);
