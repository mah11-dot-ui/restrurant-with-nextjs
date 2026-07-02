import { BaseEntity } from './index';

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export type PaymentMethod = 'stripe' | 'sslcommerz' | 'cash';

export interface IOrder extends BaseEntity {
  user: string;
  items: OrderItem[];
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  deliveryAddress?: string;
  notes?: string;
  transactionId?: string;
}

export interface OrderItem {
  menuItem: unknown;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}

export interface IReservation extends BaseEntity {
  user: string;
  name: string;
  email: string;
  phone: string;
  date: Date;
  time: string;
  guests: number;
  tableNumber?: number;
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
}

export interface IWishlist extends BaseEntity {
  user: string;
  menuItems: string[];
}
