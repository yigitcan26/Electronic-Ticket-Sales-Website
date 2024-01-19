const express = require('express');
const entertainmentController = require('../controllers/entertainmentController.js');

const router = express.Router();

router.get('/tickets', entertainmentController.getEntertainmentTickets);

module.exports = router;