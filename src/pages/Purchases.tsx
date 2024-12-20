import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { generateId } from '../lib/utils';
import type { PoultryType, Purchase } from '../types';
import { formatCurrency } from '../lib/utils';

export const Purchases = () => {
  const { addPurchase, updateStock, purchases } = useStore();
  const [type, setType] = useState<PoultryType>('Broiler');
  const [numberOfBirds, setNumberOfBirds] = useState<number>(0);
  const [weight, setWeight] = useState<number>(0); // Initialize as a number
  const [pricePerUnit, setPricePerUnit] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch purchases on initial load
  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await fetch('/api/purchases');
        if (!response.ok) {
          throw new Error('Failed to fetch purchases');
        }
        const data = await response.json();

        data.forEach((purchase: Purchase) => {
          if (!purchases.some((p) => p._id === purchase._id)) {
            addPurchase(purchase);
          }
        });
      } catch (error) {
        console.error('Error fetching purchases:', error);
      }
    };

    fetchPurchases();
  }, []); // Empty dependency array ensures this runs only once

  // Reset form fields after purchase is added
  const resetForm = () => {
    setNumberOfBirds(0);
    setWeight(0);
    setPricePerUnit(0);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (pricePerUnit <= 0 || numberOfBirds <= 0 || (type === 'Broiler' && weight <= 0)) {
      alert('Please ensure all values are greater than zero.');
      return;
    }

    const parsedWeight = type === 'Broiler' ? parseFloat(weight.toString()) : 0;

    const purchase: Purchase = {
      _id: generateId(),
      date: new Date(),
      type,
      numberOfBirds,
      pricePerUnit,
      totalPrice:
        type === 'Broiler'
          ? parsedWeight * pricePerUnit
          : numberOfBirds * pricePerUnit,
      ...(type === 'Broiler' ? { weight: parsedWeight } : {}),
    };

    try {
      setLoading(true);

      const response = await fetch('http://localhost:5000/api/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(purchase),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error('Failed to add purchase');
      }

      // Update stock after purchase
      updateStock('purchase', purchase);

      // Immediately update purchase history in the frontend
      addPurchase(purchase); // This ensures the new purchase is added to the frontend state

      // Reset form fields after submission
      alert('Successfully added purchase');
      resetForm();
    } catch (error) {
      console.error('Error adding purchase:', error);
      alert('Error adding purchase. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Helper to handle and sanitize input
  const handleInputChange = (setter: (value: number) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const sanitizedValue = value.replace(/^0+(?=\d)/, ''); // Remove leading zeros
    setter(sanitizedValue === '' ? 0 : parseFloat(sanitizedValue));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">New Purchase</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as PoultryType)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="Broiler">Broiler</option>
            <option value="Layer">Layer</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Number of Birds</label>
          <Input
            type="number"
            value={numberOfBirds === 0 ? '' : numberOfBirds}
            onChange={handleInputChange(setNumberOfBirds)}
            required
            min="1"
          />
        </div>

        {type === 'Broiler' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
            <Input
              type="number"
              value={weight === 0 ? '' : weight}
              onChange={handleInputChange(setWeight)}
              required
              min="0.1"
              step="0.1"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {type === 'Broiler' ? 'Price per kg' : 'Price per Bird'}
          </label>
          <Input
            type="number"
            value={pricePerUnit === 0 ? '' : pricePerUnit}
            onChange={handleInputChange(setPricePerUnit)}
            required
            min="0.01"
            step="0.01"
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Adding Purchase...' : 'Add Purchase'}
        </Button>
      </form>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-700">Purchase History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Birds</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Price</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {purchases.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-3 text-center text-sm text-gray-500">No purchases found</td>
                </tr>
              ) : (
                purchases.map((purchase) => (
                  <tr key={purchase._id}>
                    <td className="px-6 py-3 text-sm font-medium text-gray-500">{new Date(purchase.date).toLocaleDateString()}</td>
                    <td className="px-6 py-3 text-sm font-medium text-gray-500">{purchase.type}</td>
                    <td className="px-6 py-3 text-sm font-medium text-gray-500">{purchase.numberOfBirds}</td>
                    <td className="px-6 py-3 text-sm font-medium text-gray-500">
                      {purchase.type === 'Broiler' ? `${purchase.weight} kg` : '-'}
                    </td>
                    <td className="px-6 py-3 text-sm font-medium text-gray-500">{formatCurrency(purchase.totalPrice)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
