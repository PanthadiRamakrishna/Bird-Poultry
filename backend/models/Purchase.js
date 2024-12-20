const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  type: { 
    type: String, 
    required: true, 
    enum: ['Broiler', 'Layer'], 
  },
  numberOfBirds: { type: Number, required: true },
  weight: { 
    type: Number, 
    required: function () {
      return this.type === 'Broiler'; // Weight required only for Broiler
    },
  },
  pricePerUnit: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  date: { type: Date, required: true },
});

const Purchase = mongoose.model('Purchase', purchaseSchema);

module.exports = Purchase;
