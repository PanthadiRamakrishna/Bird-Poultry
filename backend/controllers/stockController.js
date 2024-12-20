const Stock = require('../models/Stock');

// Get stock data
const getStock = async (req, res) => {
  try {
    const stock = await Stock.findOne();
    res.status(200).json(stock);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stock data', error: error.message });
  }
};

// Save stock data (create or update if stock already exists)
const saveStock = async (req, res) => {
  try {
    const { broiler, layer } = req.body;

    // Check if stock already exists
    let stock = await Stock.findOne();

    // If stock doesn't exist, create a new one
    if (!stock) {
      stock = new Stock({
        broiler,
        layer,
      });
    } else {
      // If stock exists, update it
      stock.broiler = broiler;
      stock.layer = layer;
    }

    // Save the stock data to the database
    await stock.save();
    res.status(200).json({ message: 'Stock data saved', stock });
  } catch (error) {
    res.status(500).json({ message: 'Error saving stock data', error: error.message });
  }
};

// Update stock data (this function will handle stock updates)
const updateStock = async (req, res) => {
  try {
    const { broiler, layer } = req.body;

    // Find stock data
    let stock = await Stock.findOne();

    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' });
    }

    // Update stock data
    stock.broiler = broiler;
    stock.layer = layer;

    // Save the updated stock data to the database
    await stock.save();
    res.status(200).json({ message: 'Stock updated', stock });
  } catch (error) {
    res.status(500).json({ message: 'Error updating stock data', error: error.message });
  }
};

module.exports = { getStock, saveStock, updateStock };
