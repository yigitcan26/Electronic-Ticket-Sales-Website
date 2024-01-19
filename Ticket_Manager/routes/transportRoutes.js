const express = require('express');
const transportController = require('../controllers/transportController');

const router = express.Router();

router.get('/tickets', transportController.getTransportTickets);

module.exports = router;