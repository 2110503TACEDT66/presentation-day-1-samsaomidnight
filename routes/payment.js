const express = require('express');
const {recordExpense} = require('../controllers/payment');
 
const {protect } = require('../middleware/auth');
const router = express.Router();


// Apply 'protect' middleware to ensure only authenticated users can create payment intents
router.route('/:id').post(protect, recordExpense);

module.exports = router;
