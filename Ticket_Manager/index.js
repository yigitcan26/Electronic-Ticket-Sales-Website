const express = require('express');
const bodyParser = require('body-parser');
const { Route } = require('express');
const session = require('express-session');
const { v4: uuidv4 } = require('uuid');
const secretKey = uuidv4();


const authRoutes = require('./routes/authRoutes');
const transportRoutes = require('./routes/transportRoutes');
const entertainmentRoutes = require('./routes/entertainmentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const otherPageRoutes = require('./routes/otherPageRoutes');
const eventRoutes = require('./routes/eventRoutes');

// const getConnection = require('./models/db');

const app = express();
const PORT = process.env.PORT || 3000;

// app.use(async (req, res, next) => {
//   const [routeID] = await getConnection.execute('SELECT routeID FROM route');
//   res.locals.allRoutes = routeID;
//   next();
// });
app.set('view engine', 'ejs');

// To serve static files
app.use(express.static('public'));
app.use(session({
  secret: secretKey,
  resave: false,
  saveUninitialized: false
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.locals.currentUser = req.session.user;
  next();
});

app.use(authRoutes);
app.use(otherPageRoutes);
app.use('/transport', transportRoutes);
app.use('/entertainment', entertainmentRoutes);
app.use('/admin',adminRoutes);
app.use('/event',eventRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});