var express = require('express');
var passport = require('passport');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/success', (req, res) => {
  res.render('success');
});

router.get('/failure', (req, res) => {
  res.render('failure');
});

// Github Authentication Routes

router.get('/auth/github', passport.authenticate('github'));

router.get('/auth/github/callback', passport.authenticate('github', 
  { failureRedirect: '/failure' }), (req, res) => {
    res.redirect('/success');
  });


 //Google Authentication Routes 

router.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

router.get('/auth/google/callback', passport.authenticate('google', 
    { failureRedirect: '/failure' }), (req, res) => {
      res.redirect('/success');
    });
  
//Local authentication Routes 

router.get('/login', (req, res) => {
  var error = req.flash('error')[0];
  res.render('login');
});

router.post('/login',
  passport.authenticate('local', { successRedirect: '/success',
                                   failureRedirect: '/login',
                                   failureFlash: true })
);

// Logout
router.get('/success/logout', (req, res, next) => {
  console.log(req.session);
    req.session.destroy();
    res.clearCookie('connect.sid');
    res.redirect('/');
}); 


module.exports = router;
