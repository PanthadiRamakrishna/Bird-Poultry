const Purchase = require('../models/Purchase');
const Stock = require('../models/Stock');

// Controller method to get all purchases
const getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find();
    res.json(purchases);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Controller method to add a purchase
const addPurchase = async (req, res) => {
  const { type, numberOfBirds, weight, pricePerUnit, totalPrice, date } = req.body;

  const purchase = new Purchase({
    type,
    numberOfBirds,
    weight,
    pricePerUnit,
    totalPrice,
    date
  });

  try {
    // Save the new purchase to the database
    const newPurchase = await purchase.save();

    // Update stock after purchase
    const stock = await Stock.findOne(); // Assuming only one stock document exists
    if (stock) {
      if (type === 'Broiler') {
        stock.broiler.birds += numberOfBirds;
        stock.broiler.weight += weight;
      } else if (type === 'Layer') {
        stock.layer.birds += numberOfBirds;
        stock.layer.weight += weight;
      }

      // Save the updated stock back to the database
      await stock.save();
    } else {
      // If no stock exists, create a new stock record (optional depending on your use case)
      const newStock = new Stock({
        broiler: { birds: numberOfBirds, weight: weight },
        layer: { birds: 0, weight: 0 }
      });
      await newStock.save();
    }

    // Respond with the newly created purchase
    res.status(201).json(newPurchase);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { getAllPurchases, addPurchase };
