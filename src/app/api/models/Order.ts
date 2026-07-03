import mongoose, { Schema, Document } from 'mongoose';

export interface OrderDocument extends Document {
  user: string;
  items: Array<{
    menuItem: mongoose.Types.ObjectId;
    name: string;
    price: number;
    quantity: number;
    notes?: string;
  }>;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  deliveryAddress?: string;
  notes?: string;
  transactionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema(
  {
    menuItem: { type: Schema.Types.ObjectId, ref: 'MenuItem', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    notes: { type: String },
  },
  { _id: false }
);

const OrderSchema = new Schema<OrderDocument>(
  {
    user: { type: String, required: true, index: true },
    items: [OrderItemSchema],
    totalAmount: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    finalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['stripe', 'sslcommerz', 'cash'],
      required: true,
    },
    deliveryAddress: { type: String },
    notes: { type: String },
    transactionId: { type: String },
  },
  { timestamps: true }
);

OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ transactionId: 1 });

export const Order =
  mongoose.models.Order || mongoose.model<OrderDocument>('Order', OrderSchema);
