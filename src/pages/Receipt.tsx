import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { formatCurrency } from '../lib/utils';
import { Button } from '../components/ui/Button';

const Receipt: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const sale = location.state?.sale; // Retrieve sale data passed via navigation

  if (!sale) {
    return (
      <div className="text-center mt-10">
        <p className="text-xl text-red-500">No receipt data found!</p>
        <Button onClick={() => navigate('/sales')} className="mt-4">
          Go Back to Sales
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6 mt-10">
      <h1 className="text-2xl font-bold text-gray-900 text-center mb-4">Sale Receipt</h1>
      <div className="space-y-2 text-gray-700">
        <p>
          <strong>Date:</strong> {new Date(sale.date).toLocaleDateString()}
        </p>
        <p>
          <strong>Customer Name:</strong> {sale.customerName}
        </p>
        <p>
          <strong>Mobile Number:</strong> {sale.mobileNumber}
        </p>
        <p>
          <strong>Address:</strong> {sale.address}
        </p>
        <p>
          <strong>Type:</strong> {sale.type}
        </p>
        <p>
          <strong>Number of Birds:</strong> {sale.numberOfBirds}
        </p>
        {sale.type === 'Broiler' && (
          <p>
            <strong>Weight:</strong> {sale.weight} kg
          </p>
        )}
        <p>
          <strong>Price Per {sale.type === 'Broiler' ? 'Kg' : 'Bird'}:</strong>{' '}
          {formatCurrency(sale.pricePerUnit)}
        </p>
        <p>
          <strong>Total Amount:</strong> {formatCurrency(sale.totalAmount)}
        </p>
      </div>

      <div className="mt-6 flex justify-center">
        <Button
          onClick={() => window.print()}
          className="mr-4 bg-blue-600 text-white hover:bg-blue-700"
        >
          Print Receipt
        </Button>
        <Button onClick={() => navigate('/sales')} className="bg-gray-500 text-white hover:bg-gray-600">
          Back to Sales
        </Button>
      </div>
    </div>
  );
};

export default Receipt;
