import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ServiceOrder } from '../types';
import { saveOrder, getAllOrders, clearAllOrders } from '../utils/db';

interface OrderState {
  currentOrder: ServiceOrder | null;
  orderHistory: ServiceOrder[];
  setCurrentOrder: (order: ServiceOrder | null) => void;
  addToHistory: (order: ServiceOrder) => void;
  loadOrders: () => Promise<void>;
  clearHistory: () => Promise<void>;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      currentOrder: null,
      orderHistory: [],
      setCurrentOrder: (order) => set({ currentOrder: order }),
      addToHistory: async (order) => {
        await saveOrder(order);
        const orders = await getAllOrders();
        set({ orderHistory: orders });
      },
      loadOrders: async () => {
        const orders = await getAllOrders();
        set({ orderHistory: orders });
      },
      clearHistory: async () => {
        await clearAllOrders();
        set({ orderHistory: [], currentOrder: null });
      }
    }),
    {
      name: 'service-order-storage'
    }
  )
);