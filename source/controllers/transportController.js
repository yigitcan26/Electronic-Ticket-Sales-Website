const transportModel = require('../models/transportModel');

const getTransportTickets = async (req, res) => {
  try {
    const tickets = await transportModel.getTransportTickets();
    res.json(tickets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getTransportTickets
};