const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Book a seat
router.post('/:movieId/:id/book', bookingController.bookSeat);

module.exports = router;
