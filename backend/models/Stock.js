const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  broiler: {
    birds: { type: Number, required: true },
    weight: { type: Number, required: true },
  },
  layer: {
    birds: { type: Number, required: true },
  },
});

module.exports = mongoose.model('Stock', stockSchema);
