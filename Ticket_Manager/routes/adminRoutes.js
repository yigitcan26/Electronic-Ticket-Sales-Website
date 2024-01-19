const express = require('express');
const adminController = require('../controllers/adminController');
const authController = require('../controllers/authController');
const router = express.Router();
const getConnection = require('../models/db');


// Middleware to fetch routeIDs and attach it to res.locals
const fetchIDs = async (req, res, next) => {
  try {
    const [route] = await getConnection.execute('SELECT * FROM route');
    const [vehicle] = await getConnection.execute('SELECT * FROM vehicle');
    res.locals.routes = route;
    res.locals.vehicles = vehicle;
    next();
  } catch (error) {
    console.error('Error fetching IDs:', error);
    res.locals.routes = []; 
    res.locals.vehicles = [];// Default to an empty array in case of an error
    next();
  }
};

// Use the middleware for all routes under /admin
router.use(fetchIDs);

const createRoute = (path, controllerMethod) => {
  router.post(path, controllerMethod, (req, res) => {
    res.redirect('/');
  });
};

createRoute('/addEvent', adminController.addEvent);
createRoute('/addRoute', adminController.addRoute);
createRoute('/deleteEvent', adminController.deleteEvent);
createRoute('/addtoRoute', adminController.addtoRoute);
createRoute('/addVehicleToRoute', adminController.addVehicleToRoute);
createRoute('/addVehicle', adminController.addVehicle);
createRoute('/addVenue', adminController.addVenue);
createRoute('/addVenue/addSeat', adminController.addSeat);
createRoute('/addSeat', adminController.addSeat);
createRoute('/addTicket', adminController.addTicket);
createRoute('/addVehicle/addSeat', adminController.addVehicleSeat);

router.get('/', authController.requireLogin, adminController.adminChecking, async (req, res) => { // return ejs model to html,
  res.render('adminView');
});


module.exports = router;