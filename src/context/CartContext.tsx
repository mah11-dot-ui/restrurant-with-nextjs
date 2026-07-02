'use client';

import { createContext, useState, useCallback, ReactNode } from 'react';
import { CartItem, IMenuItem } from '@/types/menu';

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  addItem: (menuItem: IMenuItem, quantity?: number, notes?: string) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: (menuItemId: string) => number;
}

export const CartCtx = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);

  const addItem = useCallback((menuItem: IMenuItem, quantity = 1, notes?: string) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.menuItem._id === menuItem._id);
      if (existing) {
        return prev.map((i) =>
          i.menuItem._id === menuItem._id
            ? { ...i, quantity: i.quantity + quantity, notes: notes || i.notes }
            : i
        );
      }
      return [...prev, { menuItem, quantity, notes }];
    });
  }, []);

  const removeItem = useCallback((menuItemId: string) => {
    setItems((prev) => prev.filter((i) => i.menuItem._id !== menuItemId));
  }, []);

  const updateQuantity = useCallback((menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.menuItem._id !== menuItemId));
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.menuItem._id === menuItemId ? { ...i, quantity } : i))
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const itemCount = useCallback(
    (menuItemId: string) => items.find((i) => i.menuItem._id === menuItemId)?.quantity || 0,
    [items]
  );

  return (
    <CartCtx.Provider
      value={{ items, totalItems, subtotal, addItem, removeItem, updateQuantity, clearCart, itemCount }}
    >
      {children}
    </CartCtx.Provider>
  );
}
