// authController.js

const bcrypt = require('bcrypt');
const getConnection = require('../models/db');


//const users = []
//router.use(express.urlencoded({extended: false})) // router is from authRoutes.js

async function login(req, res, next) {
  //const { username, password, mail } = req.body;

  try {
    // Get user from database
    const [user] = await getConnection.execute('SELECT * FROM user WHERE userName = ?', [req.body.username]);
    const [email] = await getConnection.execute('SELECT * FROM user WHERE email = ?', [req.body.email]);

    // If there is not exist such user.
    if (!user || user.length === 0) {
      res.locals.errorMessage = 'Username is incorrect';
      return res.render('login');
      // return res.status(401).json({ error: 'Username is incorrect.' });
    }
    if (!email || email.length === 0) {
      res.locals.errorMessage = 'Email is incorrect';
      return res.render('login');
    }

    // Check password
    const passwordMatch = req.body.password ? await bcrypt.compare(req.body.password, user[0].password) : false;

    // If password does not match, return error
    if (!passwordMatch) {
      res.locals.errorMessage = 'Password is incorrect';
      return res.render('login');
    }


    // Connected successfully
    console.log('In database, user is:', user);
    req.session.user = user;
    res.redirect('/');

  } catch (error) {
    console.error('Error during login:', error);
    res.locals.errorMessage = 'Internal Server Error';
    return res.render('login');
  }
}

async function signup(req, res) {

  const [user] = await getConnection.execute('SELECT * FROM user WHERE userName = ?', [req.body.username]);
  const [email] = await getConnection.execute('SELECT * FROM user WHERE email = ?', [req.body.email]);
  const [phone] = await getConnection.execute('SELECT * FROM user WHERE phone = ?', [req.body.phone]);

  if (user && user.length > 0) {
    res.locals.errorMessage = 'Username already taken';
    return res.render('signup');
  }
  if (email && email.length > 0) {
    res.locals.errorMessage = 'Email already taken';
    return res.render('signup');
  }
  if (phone && phone.length > 0) {
    res.locals.errorMessage = 'Phone already taken';
    return res.render('signup');
  }

  // Username, password, email and phone number must be mandatory
  if (!req.body.username || !req.body.password || !req.body.email || !req.body.phone) {
    res.locals.errorMessage = 'Username, password, e-mail and phone number are mandatory';
    return res.render('signup');
  }

  if (req.body.password.length <= 4) {
    res.locals.errorMessage = 'Please enter a password longer than 4 characters';
    return res.render('signup');
  }

  if (req.body.username.includes(' ') || req.body.password.includes(' ') || req.body.email.includes(' ') || req.body.phone.includes(' ')) {
    res.locals.errorMessage = 'Username, password, e-mail and phone must not contain spaces';
    return res.render('signup');
  }

  try {
    // Hashed password with bcrypt
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    console.log(req.body.username);
    // Check if there is user with same username email password and phone
    const result = await getConnection.execute('INSERT INTO user (userName, email, password, phone) VALUES (?, ?, ?, ?)', [req.body.username, req.body.email, hashedPassword, req.body.phone]);



    res.redirect('/');
  } catch (error) {

    if (error.code === 'ER_DUP_ENTRY') {
      console.error('This user is already exist.');
      res.redirect('/signup'); // redirect to signup page
      return res.status(400).json({ error: 'This user is already exist.' });
    } else {
      console.error('Error during user registration:', error);
      res.redirect('/signup'); // redirect to signup page
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

async function logout(req, res, next) {
  try {
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      res.redirect('/');
    });
  } catch (error) {
    next(error);
  }
}

function requireLogin(req, res, next){
  if (req.session && req.session.user) {
      return next();
  } else {
      return res.redirect('/login');
  }
}


module.exports = {
  login,
  signup,
  logout,
  requireLogin,
  //initialize
};