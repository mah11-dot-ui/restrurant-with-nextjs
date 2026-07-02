'use client';

import { useContext } from 'react';
import { CartCtx } from '@/context/CartContext';

export function useCart() {
  const context = useContext(CartCtx);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
