const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');

// Route for getting all purchases
router.get('/', purchaseController.getAllPurchases);  // Make sure the handler is defined in the controller

// Route for creating a purchase
router.post('/', purchaseController.addPurchase);

module.exports = router;
