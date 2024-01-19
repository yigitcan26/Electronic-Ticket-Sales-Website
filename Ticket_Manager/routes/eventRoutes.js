const express = require('express');
const adminController = require('../controllers/adminController');
const authController = require('../controllers/authController');
const router = express.Router();
const getConnection = require('../models/db');

router.get('/:eventID', authController.requireLogin, async (req, res) => {
    try {
        const eventId = req.params.eventID;
        const sql = 'SELECT * FROM event WHERE eventID = ?';

        const [foundEvent] = await getConnection.execute(sql, [eventId]);
        const [foundVenue] = await getConnection.execute('SELECT * FROM venue WHERE venueID = ?',[foundEvent[0].venueID]);
        const [foundSeats] = await getConnection.execute('SELECT * FROM seat WHERE venueID = ?',[foundEvent[0].venueID]);
        const [event] = await getConnection.execute('SELECT * FROM event');
        const [route] = await getConnection.execute('SELECT * FROM route');
        const [venue] = await getConnection.execute('SELECT * FROM venue');
        const [vehicle] = await getConnection.execute('SELECT * FROM vehicle');
        const [ticket] = await getConnection.execute(' SELECT * FROM ticket');


        if (foundEvent.length > 0) {
            res.render('event', { foundEvent: foundEvent[0], foundVenue:venue, events:event, routes:route, vehicles:vehicle, foundSeats: foundSeats, tickets: ticket });
        } else {
            console.log('Event not found');
            res.redirect('/error');
        }
    } catch (error) {
        console.log('--------ERROR-EVENT-------');
        console.error(error);
        res.redirect('/error');
    }
});


module.exports = router;