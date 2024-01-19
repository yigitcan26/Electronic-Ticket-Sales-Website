const express = require('express');
const router = express.Router();

const getConnection = require('../models/db');


router.get('/', async (req, res) => { 
  const [event] = await getConnection.execute('SELECT * FROM event');
  const [venue] = await getConnection.execute('SELECT * FROM venue');
  res.locals.events = event;
  res.locals.venues = venue;
  res.render('home');
});

module.exports = router;