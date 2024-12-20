import axios from 'axios';
import { Purchase, Sale, Stock } from '../types';

// Set up a base URL for Axios
const api = axios.create({
  baseURL: '/api',
});

// Fetch all purchases
export const fetchPurchases = async (): Promise<Purchase[]> => {
  try {
    const response = await api.get('/purchases');
    return response.data;
  } catch (error) {
    console.error('Error fetching purchases:', error);
    throw error;
  }
};

// Add a new purchase
export const addPurchase = async (purchase: Purchase): Promise<Purchase> => {
  try {
    const response = await api.post('/purchases', purchase);
    return response.data;
  } catch (error) {
    console.error('Error adding purchase:', error);
    throw error;
  }
};

// Fetch all sales
export const fetchSales = async (): Promise<Sale[]> => {
  try {
    const response = await api.get('/sales');
    return response.data;
  } catch (error) {
    console.error('Error fetching sales:', error);
    throw error;
  }
};

// Add a new sale
export const addSale = async (sale: Sale): Promise<Sale> => {
  try {
    const response = await api.post('/sales', sale);
    return response.data;
  } catch (error) {
    console.error('Error adding sale:', error);
    throw error;
  }
};

// Delete a sale by ID
export const deleteSale = async (saleId: string): Promise<void> => {
  try {
    await api.delete(`/sales/${saleId}`);
  } catch (error) {
    console.error('Error deleting sale:', error);
    throw new Error('Failed to delete sale');
  }
};

// Fetch current stock
export const fetchStock = async (): Promise<Stock> => {
  try {
    const response = await api.get('/stock');
    return response.data;
  } catch (error) {
    console.error('Error fetching stock:', error);
    throw error;
  }
};

// Save updated stock
export const saveStock = async (stock: Stock): Promise<void> => {
  try {
    await api.post('/stock', stock); // Assuming this endpoint updates stock
  } catch (error) {
    console.error('Error saving stock:', error);
    throw error;
  }
};

export default {
  fetchPurchases,
  addPurchase,
  fetchSales,
  addSale,
  deleteSale,
  fetchStock,
  saveStock,
};
