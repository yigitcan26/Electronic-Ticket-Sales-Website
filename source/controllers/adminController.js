const getConnection = require('../models/db');


async function addEvent(req, res) {


  if (!req.body.eventname || !req.body.eventStartDate || !req.body.eventEndDate || !req.body.venueID || !req.body.cost) {
    res.locals.errorMessage = 'Event name, venueID, cost, start and end date are required';
    return res.render('adminView');
  }

  
  try {

   
    console.log(req.body.eventname);
  

    if(req.body.venueID)
    {
      const result = await getConnection.execute('INSERT INTO event (eventName, eventType, eventStartDate,eventEndDate,eventDuration,venueID, cost, eventDescription) VALUES (?,?, ?, ?, ?,?,?,?)', [req.body.eventname, req.body.eventtype, req.body.eventStartDate, req.body.eventEndDate, req.body.eventEndDate, req.body.venueID,  req.body.cost, req.body.eventDescription]);

      const [eventID] = await getConnection.execute('SELECT MAX(eventID) AS maxEventID FROM event ');
      const [seats] = await getConnection.execute('SELECT * FROM seat where venueID = ?',[req.body.venueID]);
    

      for(var i = 0; i < seats.length; i++ )
      {

        const result = await getConnection.execute('INSERT INTO ticket (price,eventID,seatID,status) VALUES (?, ?, ?, ?)', [req.body.cost, eventID[0].maxEventID, seats[i].seatID, 0]);
      }
    }
    else
    {
      const result = await getConnection.execute('INSERT INTO event (eventName, eventType, eventStartDate,eventEndDate,eventDuration,vehicleID, cost, eventDescription) VALUES (?,?, ?, ?, ?,?,?,?)', [req.body.eventname, req.body.eventtype, req.body.eventStartDate, req.body.eventEndDate, req.body.eventEndDate, req.body.vehicleID,  req.body.cost, req.body.eventDescription]);

      const [eventID] = await getConnection.execute('SELECT MAX(eventID) AS maxEventID FROM event ');

      const [seats] = await getConnection.execute('SELECT * FROM seat where vehicleID = ?',[req.body.vehicleID]);
    
      for(var i = 0; i < seats.length; i++ )
      {


        const result = await getConnection.execute('INSERT INTO ticket (price,eventID,seatID,status) VALUES (?, ?, ?, ?)', [req.body.cost, eventID[0].maxEventID, seats[i].seatID, 0]);
      }
    }
    res.locals.successMessage = 'Event added';
    return res.render('adminView');
    
  } catch (error) {

    if (error.code === 'ER_DUP_ENTRY') {
      console.error('Bu event zaten var');
      res.redirect('/admin'); // redirect to admin page
      return res.status(400).json({ error: 'bu event zaten var.' });
    } else {
      console.error('Error during user registration:', error);
      res.redirect('/admin'); // redirect to admin page
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
async function deleteEvent(req, res) {
  const eventName = req.body.eventname; // Assuming eventName is part of the route parameters

  if (!eventName) {
    res.status(400).json({ error: 'Event name is required for deletion' });
    return;
  }

  try {
    // Check if the event exists
    const checkEventQuery = 'SELECT * FROM event WHERE eventName = ?';
    const [existingEvent] = await getConnection.execute(checkEventQuery, [eventName]);

    if (existingEvent.length === 0) {
      res.locals.successMessage = 'Event not found';
      return res.render('adminView');
      return;
    }

    // If the event exists, proceed with deletion
    const deleteEventQuery = 'DELETE FROM event WHERE eventName = ?';
    await getConnection.execute(deleteEventQuery, [eventName]);
    res.locals.successMessage = 'Event deleted';
    return res.render('adminView');

    //res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error during event deletion:', error);
    res.status(500).json({ error: 'Internal Server Error' });
    res.redirect('/admin');
  }
  
}



async function addRoute(req, res) {


  if (!req.body.place || !req.body.duration || !req.body.breakDuration ) {
    res.locals.errorMessage = 'Location, duration, break time are required';
    return res.render('adminView');
  }
  try {
    const [resultRouteID] = await getConnection.execute('SELECT MAX(routeID) AS maxRouteID FROM route');
    const maxRouteID = resultRouteID[0].maxRouteID;

    const newRouteID = maxRouteID + 1;

    console.log(maxRouteID + " " + newRouteID);
    console.log(req.body.place);
      
    const result = await getConnection.execute('INSERT INTO route (routeID, place,duration,breakDuration) VALUES (?,?, ?, ?)', [newRouteID,req.body.place, req.body.duration, req.body.breakDuration]);


    res.locals.successMessage = 'Route added';
    return res.render('adminView');
    //res.redirect('/');
  } catch (error) {

    if (error.code === 'ER_DUP_ENTRY') {
      console.error('This route is already available');
      res.redirect('/admin'); // redirect to signup page
      return res.status(400).json({ error: 'This route already available.' });
    } else {
      console.error('Error during user registration:', error);
      res.redirect('/admin'); // redirect to signup page
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

async function deleteRoute(req, res) {
  try {
    if (!req.params.routeID) {
      res.locals.errorMessage = 'Route ID is required for deletion';
      return res.render('adminView');
    }

    const result = await getConnection.execute('DELETE FROM route WHERE routeID = ?', [req.params.routeID]);

    if (result.affectedRows > 0) {
      res.locals.successMessage = 'Route deleted';
    } else {
      res.locals.errorMessage = 'Route not found';
    }

    return res.render('adminView');
  } catch (error) {
    console.error('Error during route deletion:', error);
    res.redirect('/admin'); // redirect to admin page
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}


async function addtoRoute(req, res) {
  const routeID = req.body.routeID;

  const [maxStationOrderResult] = await getConnection.execute(
    'SELECT MAX(stationOrder) AS maxStationOrder FROM route WHERE routeID = ?',
    [routeID]
  );

  const maxStationOrder = maxStationOrderResult[0]?.maxStationOrder || 0;

  const newStationOrder = maxStationOrder + 1;


  console.log(routeID + " " + newStationOrder + " " + maxStationOrder)

  if (!req.body.routeID || !req.body.place || !req.body.duration || !req.body.breakDuration) {
    res.locals.errorMessage = 'Route id, place, duration, break time are required';
    return res.render('adminView');
  }

  try {
    const result = await getConnection.execute('INSERT INTO route (routeID, place,duration,breakDuration,stationOrder) VALUES (?, ?, ?, ?, ?)', [req.body.routeID, req.body.place, req.body.duration, req.body.breakDuration, newStationOrder]);

    res.locals.successMessage = 'Added to route';
    return res.render('adminView');
  } catch (error) {

    if (error.code === 'ER_DUP_ENTRY') {
      console.error('This route is already available');
      res.redirect('/admin'); // redirect to signup page
      return res.status(400).json({ error: 'This route already available.' });
    } else {
      console.error('Error during user registration:', error);
      res.redirect('/admin'); // redirect to signup page
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

async function addVehicle(req, res) {

  try {
   
    const result = await getConnection.execute('INSERT INTO vehicle (vehicleType,rowCount,columnCount) VALUES (?,?,?)', [req.body.vehicleType,req.body.vehRowCount,req.body.vehColumnCount]);
    const [resultVehicleID] = await getConnection.execute('SELECT MAX(vehicleID) AS maxVehicleID FROM vehicle');
    const maxVehicleID = resultVehicleID[0].maxVehicleID;

    res.locals.successMessage = `Vehicle added: ID is ${maxVehicleID}`;
   // return res.render('adminView');
    //res.redirect('/');
  } catch (error) {

    if (error.code === 'ER_DUP_ENTRY') {
      console.error('This vehicle is already available');
      res.redirect('/admin'); // redirect to admin page
      return res.status(400).json({ error: 'This vehicle is already available' });
    } else {
      console.error('Error during user registration:', error);
      res.redirect('/admin'); // redirect to admin page
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

async function addVehicleSeat(req, res) {

 

  try {

    
   // SELECT LAST_INSERT_ID(colid) From tablename;
   const [resultVehicleID] = await getConnection.execute('SELECT MAX(vehicleID) AS maxVehicleID FROM vehicle');
   const maxVehicleID = resultVehicleID[0].maxVehicleID;
    const buttonClickData = req.body;
    const rowArray = buttonClickData.map(entry => [entry.row]);
    const columnArray = buttonClickData.map(entry => [entry.column]);
    
    for(var i = 0; i < rowArray.length ; i++)
    {
      
      var rowch =Array.from(rowArray[i]);
      var columnch = Array.from(columnArray[i]);

      const result = await getConnection.execute('INSERT INTO seat (vehicleID,rowNo,columnNo) VALUES (?,?,?)', [maxVehicleID, rowch[0], columnch[0]]);
      
    }

    res.locals.successMessage = `Vehicle added: ID is ${maxVehicleID}`;
    
    return res.render('adminView');
    
  } catch (error) {


    if (error.code === 'ER_DUP_ENTRY') {
      console.error('This seat is already available');
      res.redirect('/admin'); // redirect to admin page
      return res.status(400).json({ error: 'This seat is already available' });
    } else {
      console.error('Error during user registration:', error);
      res.redirect('/admin'); // redirect to admin page
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

async function addVehicleToRoute(req, res) {
  const vehicleID = req.body.vehicleID;
  try {

    const [existingVehicle] = await getConnection.execute('SELECT * FROM vehicle WHERE vehicleID = ?', [vehicleID]);
    

    await getConnection.execute('UPDATE vehicle SET routeID = ? WHERE vehicleID = ?', [req.body.routeID, vehicleID]);
   
    // const result = await getConnection.execute('INSERT INTO vehicle (routeID) VALUES (?)', [req.body.routeID]);


    res.locals.successMessage = `Vehicle added`;
    return res.render('adminView');
    //res.redirect('/');
  } catch (error) {

    if (error.code === 'ER_DUP_ENTRY') {
      console.error('This vehicle is already available');
      res.redirect('/admin'); // redirect to admin page
      return res.status(400).json({ error: 'This vehicle is already available' });
    } else {
      console.error('Error during user registration:', error);
      res.redirect('/admin'); // redirect to admin page
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

//Add venue
async function addVenue(req, res) {


  if (!req.body.city || !req.body.address) {
    res.locals.errorMessage = 'City and address required';
    return res.render('adminView');
  }


  try {
    
   
    
    const result = await getConnection.execute('INSERT INTO venue (city, address,rowCount,columnCount) VALUES (?,?,?,?)', [req.body.city, req.body.address,req.body.rowCount,req.body.columnCount]);

   // const generatedID = results.insertId;
    res.locals.successMessage = 'Venue added';
    //return res.render('adminView');
  } catch (error) {

    if (error.code === 'ER_DUP_ENTRY') {
      console.error('This vehicle is already available');
      res.redirect('/admin'); // redirect to admin page
      return res.status(400).json({ error: 'This venue is already available' });
    } else {
      console.error('Error during user registration:', error);
      res.redirect('/admin'); // redirect to admin page
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

async function addSeat(req, res) {


  try {

    
   // SELECT LAST_INSERT_ID(colid) From tablename;
    const [existingVenues] = await getConnection.execute('SELECT venueID FROM venue');
    const venueID = existingVenues[existingVenues.length - 1].venueID;
    const buttonClickData = req.body;
    const rowArray = buttonClickData.map(entry => [entry.row]);
    const columnArray = buttonClickData.map(entry => [entry.column]);
    
    for(var i = 0; i < rowArray.length ; i++)
    {
      
      var rowch =Array.from(rowArray[i]);
      var columnch = Array.from(columnArray[i]);

      const result = await getConnection.execute('INSERT INTO seat (venueID,rowNo,columnNo) VALUES (?,?,?)', [venueID, rowch[0], columnch[0]]);
      
    }
    
    return res.render('adminView');
    
  } catch (error) {


    if (error.code === 'ER_DUP_ENTRY') {
      console.error('This seat is already available');
      res.redirect('/admin'); // redirect to admin page
      return res.status(400).json({ error: 'This seat is already available' });
    } else {
      console.error('Error during user registration:', error);
      res.redirect('/admin'); // redirect to admin page
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

async function addTicket(req, res) {


  if (!req.body.price || !req.body.eventID || !req.body.seatID || !req.body.status) {
    res.locals.errorMessage = 'Price, event id, seat id, status required';
    return res.render('adminView');
  }

  try {

        
    const result = await getConnection.execute('INSERT INTO ticket (price,eventID,seatID,status) VALUES (?, ?, ?, ?)', [req.body.price, req.body.eventID, req.body.seatID, req.body.status]);

    res.locals.successMessage = 'Ticket added';
    return res.render('adminView');
  } catch (error) {

    if (error.code === 'ER_DUP_ENTRY') {
      console.error('This route is already available');
      res.redirect('/admin'); // redirect to admin page
      return res.status(400).json({ error: 'This route already available.' });
    } else {
      console.error('Error during user registration:', error);
      res.redirect('/admin'); // redirect to admin page
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}


function adminChecking(req, res, next){
  if(req.session.user){
    if(req.session.user[0].userID == "1" || req.session.user[0].userID == "2"){
      return next();
    }
  }
  res.redirect('/')
  
}

module.exports = {
  adminChecking,
  addEvent,
  deleteEvent,
  addRoute,
  deleteRoute,
  addtoRoute,
  addVehicleToRoute,
  addVehicle,
  addVenue,
  addSeat,
  addTicket,
  addVehicleSeat
};