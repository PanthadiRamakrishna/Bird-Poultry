const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    address: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    type: { type: String, enum: ['Broiler', 'Layer'], required: true },
    numberOfBirds: { type: Number, required: true },
    weight: { type: Number }, // Optional for 'Broiler' only
    pricePerUnit: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Sale = mongoose.model('Sale', saleSchema);

module.exports = Sale;
