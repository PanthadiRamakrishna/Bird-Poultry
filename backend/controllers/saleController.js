const Sale = require('../models/Sale');
const Stock = require('../models/Stock');

// Add a new sale and update stock
const addSale = async (req, res) => {
  try {
    const { date, customerName, address, mobileNumber, type, numberOfBirds, pricePerUnit, totalAmount, weight } = req.body;

    // Save sale to the database
    const newSale = new Sale({
      date,
      customerName,
      address,
      mobileNumber,
      type,
      numberOfBirds,
      pricePerUnit,
      totalAmount,
      weight,
    });

    await newSale.save();

    // Update stock based on type
    const stock = await Stock.findOne();
    if (type === 'Broiler') {
      stock.broiler.birds -= numberOfBirds;
      stock.broiler.weight -= weight;
    } else if (type === 'Layer') {
      stock.layer.birds -= numberOfBirds;
    }

    await stock.save();

    res.status(201).json(newSale);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add sale' });
  }
};

// Get all sales
const getSales = async (req, res) => {
  try {
    const sales = await Sale.find();
    res.status(200).json(sales);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch sales' });
  }
};

module.exports = { addSale, getSales };
