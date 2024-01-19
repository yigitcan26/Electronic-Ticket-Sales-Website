const entertainmentModel = require('../models/entertainmentModel');

const getEntertainmentTickets = async (req, res) => {
  try {
    const tickets = await entertainmentModel.getEntertainmentTickets();
    res.json(tickets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getEntertainmentTickets
};