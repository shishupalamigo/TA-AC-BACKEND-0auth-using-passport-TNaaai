var express = require('express');
var passport = require('passport');


var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.user);
  res.render('index', { title: 'Express' });
});

// Github Authentication Routes

router.get('/auth/github', passport.authenticate('github'));

router.get('/auth/github/callback', passport.authenticate('github', 
  { failureRedirect: '/users/login' }), (req, res) => {
    res.redirect('/users/dashboard');
  });


 //Google Authentication Routes 

router.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

router.get('/auth/google/callback', passport.authenticate('google', 
    { failureRedirect: '/users/login' }), (req, res) => {
      // req.session.userId = user.id;
      // console.log(user.id);
      res.redirect('/users/dashboard');
    });
 

module.exports = router;
