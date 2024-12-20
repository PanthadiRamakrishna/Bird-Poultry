const express = require('express');
const router = express.Router();
const { getStock, saveStock, updateStock } = require('../controllers/stockController');

// Get stock data
router.get('/', getStock);

// Save stock data (create or update if stock already exists)
router.post('/', saveStock);

// Update stock data
router.put('/', updateStock);

module.exports = router;
