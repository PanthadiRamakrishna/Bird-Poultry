import { create } from 'zustand';
import axios from 'axios';
import { Purchase, Sale, Stock, User } from '../types';

interface State {
  currentUser: User | null;
  purchases: Purchase[];
  sales: Sale[];
  stock: Stock | null;
  isLoading: boolean;
  setSales: (sales: Sale[]) => void;
  setCurrentUser: (user: User | null) => void;
  addPurchase: (purchase: Purchase) => void;
  addSale: (sale: Sale) => void;
  updateStock: (type: 'purchase' | 'sale', data: Purchase | Sale) => void;
  setStock: (stock: Stock) => void; // New method to set stock
  fetchPurchases: () => Promise<void>;
  fetchSales: () => Promise<void>;
  fetchStock: () => Promise<void>;
  saveStock: (stock: Stock) => Promise<void>; // New method to save stock
}

export const useStore = create<State>((set) => ({
  currentUser: null,
  purchases: [],
  sales: [],
  setSales: (sales) => set({ sales }),
  stock: null,
  isLoading: false,

  setCurrentUser: (user) => set({ currentUser: user }),

  addPurchase: (purchase) => {
    try {
      set((state) => ({ purchases: [...state.purchases, purchase] }));
    } catch (error) {
      console.error('Error adding purchase:', error);
    }
  },

  addSale: (sale) => {
    try {
      set((state) => ({ sales: [...state.sales, sale] }));
    } catch (error) {
      console.error('Error adding sale:', error);
    }
  },

  updateStock: (type, data) => {
    try {
      set((state) => {
        const newStock = state.stock ?? { broiler: { birds: 0, weight: 0 }, layer: { birds: 0 } };

        if (type === 'purchase' && data) {
          if (data.type === 'Broiler') {
            newStock.broiler.birds += data.numberOfBirds;
            newStock.broiler.weight += data.weight || 0;
          } else if (data.type === 'Layer') {
            newStock.layer.birds += data.numberOfBirds;
          }
        } else if (type === 'sale' && data) {
          if (data.type === 'Broiler') {
            newStock.broiler.birds -= data.numberOfBirds;
            newStock.broiler.weight -= data.weight || 0;
          } else if (data.type === 'Layer') {
            newStock.layer.birds -= data.numberOfBirds;
          }
        }

        return { stock: newStock };
      });
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  },

  setStock: (stock) => set({ stock }),

  fetchPurchases: async () => {
    try {
      const response = await axios.get('/api/purchases');
      set({ purchases: response.data });
    } catch (error) {
      console.error('Error fetching purchases:', error);
    }
  },

  fetchSales: async () => {
    try {
      const response = await axios.get('/api/sales');
      set({ sales: response.data });
    } catch (error) {
      console.error('Error fetching sales:', error);
    }
  },

  fetchStock: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get('/api/stock');
      set({ stock: response.data });
    } catch (error) {
      console.error('Error fetching stock:', error);
      set({
        stock: {
          broiler: { birds: 0, weight: 0 },
          layer: { birds: 0 },
        },
      });
    } finally {
      set({ isLoading: false });
    }
  },

  saveStock: async (stock) => {
    try {
      await axios.post('/api/stock', stock);
      set({ stock });
    } catch (error) {
      console.error('Error saving stock:', error);
    }
  },
}));
