// authRoutes.js

const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

// Giriş sayfasına yönlendirme
router.get('/login', (req, res) => {
  res.render('login'); // This submits an HTML page using the login.ejs template
});

// Redirect when pressing the login button
router.post('/login', authController.login, (req, res) => {
  // Redirect to home page in case of successful login
  res.redirect('/');
});

// Redirect to registration page
router.get('/signup', (req, res) => {
  res.render('signup'); // This submits an HTML page using the signup.ejs template
});


router.post('/signup', authController.signup, (req, res) => {
  // Redirect to home page in case of successful signup
  res.redirect('/');
});

router.get('/logout', authController.logout);

/*
router.get('/entertainmentView', authController.entertainmentView, (req,res) => {
  res.render('entertainmentView'); // Bu, entertainmentView.ejs şablonunu kullanarak bir HTML sayfasını gönderir
});

router.get('/transportView', authController.transportView, (req,res) => {
  res.render('transportView'); // Bu, transportView.ejs şablonunu kullanarak bir HTML sayfasını gönderir
});
*/

module.exports = router;
