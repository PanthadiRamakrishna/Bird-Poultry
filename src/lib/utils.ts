import { type ClassValue, clsx } from 'clsx'; // Import types and functions
import { twMerge } from 'tailwind-merge'; // Import tailwind-merge to handle class name merging

// Utility function to merge class names, combining clsx and tailwind-merge
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs)); // Merges the class names and resolves conflicts
}

// Utility function to format numbers as INR currency
export function formatCurrency(amount: number | null | undefined): string {
  if (amount == null) return '₹0.00'; // Handle null or undefined
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount); // Formats number in INR style (e.g., ₹1,234.56)
}

// Utility function to generate a unique ID based on random values and current timestamp
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36); // Generates a random unique string
}
