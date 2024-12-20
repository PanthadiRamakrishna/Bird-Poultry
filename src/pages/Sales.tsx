import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Sale } from '../types';
import { addSale as addSaleApi } from '../lib/api';
import { formatCurrency } from '../lib/utils';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

const Sales: React.FC = () => {
  const navigate = useNavigate();
  const { sales, setSales, fetchSales, stock, updateStock } = useStore();

  // State for form inputs
  const [customerName, setCustomerName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [address, setAddress] = useState('');
  const [type, setType] = useState<'Broiler' | 'Layer'>('Broiler');
  const [numberOfBirds, setNumberOfBirds] = useState('');
  const [weight, setWeight] = useState('');
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [isLoading, setIsLoading] = useState(false); // State for spinner

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  const handleAddSale = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName || !numberOfBirds || !pricePerUnit) {
      alert('Please fill in all required fields.');
      return;
    }

    // Parse numeric inputs to prevent issues
    const parsedNumberOfBirds = parseInt(numberOfBirds, 10);
    const parsedWeight = parseFloat(weight);
    const parsedPricePerUnit = parseFloat(pricePerUnit);

    // Validate stock availability
    if (type === 'Broiler') {
      if (
        parsedNumberOfBirds > (stock?.broiler?.birds || 0) ||
        parsedWeight > (stock?.broiler?.weight || 0)
      ) {
        alert('Not enough stock available for Broiler.');
        return;
      }
    } else {
      if (parsedNumberOfBirds > (stock?.layer?.birds || 0)) {
        alert('Not enough stock available for Layer.');
        return;
      }
    }

    const totalAmount =
      type === 'Broiler' ? parsedWeight * parsedPricePerUnit : parsedNumberOfBirds * parsedPricePerUnit;
    const newSale: Sale = {
      date: new Date(),
      customerName,
      address,
      mobileNumber,
      type,
      numberOfBirds: parsedNumberOfBirds,
      weight: parsedWeight,
      pricePerUnit: parsedPricePerUnit,
      totalAmount,
      _id: '', // The backend will generate the ID
    };

    try {
      setIsLoading(true); // Show spinner
      const response = await addSaleApi(newSale);
      const savedSale = { ...newSale, _id: response._id };

      setSales([savedSale, ...sales]);
      updateStock('sale', savedSale);

      // Reset form fields
      setCustomerName('');
      setMobileNumber('');
      setAddress('');
      setType('Broiler');
      setNumberOfBirds('');
      setWeight('');
      setPricePerUnit('');

      setTimeout(() => {
        setIsLoading(false); // Hide spinner after success
        navigate('/receipt', { state: { sale: savedSale } });
      }, 1000); // Add a slight delay for a better user experience
    } catch (error) {
      console.error('Error adding sale:', error);
      alert('Failed to add sale. Please try again.');
      setIsLoading(false);
    }
  };

  // Helper function to clean leading zeros
  const removeLeadingZeros = (value: string) => {
    return value.replace(/^0+(?!\.)/, '');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">New Sale</h1>

      {isLoading ? (
        // Loading spinner with message
        <div className="flex flex-col justify-center items-center h-32">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
          <p className="mt-4 text-blue-500 font-semibold">Loading...</p>
        </div>
      ) : (
        <form onSubmit={handleAddSale} className="bg-white rounded-lg shadow p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
              <Input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
              <Input
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <Input value={address} onChange={(e) => setAddress(e.target.value)} required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as 'Broiler' | 'Layer')}
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
              value={numberOfBirds}
              onChange={(e) => setNumberOfBirds(removeLeadingZeros(e.target.value))}
              required
              min="1"
              max={type === 'Broiler' ? stock?.broiler?.birds || 0 : stock?.layer?.birds || 0}
            />
          </div>

          {type === 'Broiler' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
              <Input
                type="number"
                value={weight}
                onChange={(e) => setWeight(removeLeadingZeros(e.target.value))}
                required
                min="0.1"
                step="0.1"
                max={stock?.broiler?.weight || 0}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {type === 'Broiler' ? 'Price per kg' : 'Price per Bird'}
            </label>
            <Input
              type="number"
              value={pricePerUnit}
              onChange={(e) => setPricePerUnit(removeLeadingZeros(e.target.value))}
              required
              min="0.01"
              step="0.01"
            />
          </div>

          <Button type="submit" className="w-full">
            Complete Sale & Print Receipt
          </Button>
        </form>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-700">Sales History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Birds
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sales.map((sale) => (
                <tr key={sale._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(sale.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.customerName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.numberOfBirds}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(sale.totalAmount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Sales;
