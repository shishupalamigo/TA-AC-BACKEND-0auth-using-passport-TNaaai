var express = require('express');
var User = require('../models/user');
var multer = require('multer');
var path = require('path');

var router = express.Router();


var uploadPath = path.join(__dirname, '../', 'public/uploads');
// Strorage for Uploaded Files

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null,  Date.now() + '-' + file.originalname );
  }
})
 
var upload = multer({ storage: storage })


/* GET users listing. */
router.get('/', (req, res, next) => {
  User.find({}, (err, users) => {
    if(err) return next(err);
    res.render('users', { users });
    });
});
router.get('/dashboard', (req, res, next) => {
  let userId = req.session.userId || req.session.passport.user;
  User.findOne({_id: userId }, (err, user) => {
    if(err) return next(err);
    res.render('dashboard', { user });
  });
})

router.get('/register', function(req, res, next) {
    var error = req.flash('error')[0];
    res.render('registration', { error });
});

router.post('/register', upload.single('profilePic') ,(req, res, next) => {
  req.body.profilePic = req.file.filename;
  User.create(req.body, (err, user) => {
    if(err) {
      if(err.name === 'MongoError') {
        req.flash('error', 'This email is already in use');
        return res.redirect('/users/register');
      }
      if(err.name === 'ValidationError') {
        req.flash('error', err.message);
        return res.redirect('/users/register');
      }
    }
    res.redirect('/users/login');
  });
});

// Login
router.get('/login', (req,res, next) =>  {
  var error = req.flash('error')[0];
  res.render('login', { error });
});

router.post('/login', (req, res, next) => {
  var { email, password } = req.body;
  if(!email || !password) {
    req.flash('error', 'Email/Password required!');
    return res.redirect('/users/login');
  }
  User.findOne({ email }, (err, user) => {
  if(err) return next(err);
    if(!user) {
      req.flash('error', 'This email is not registered');
      return res.redirect('/users/login');
    }
    user.verifyPassword(password, (err, result) => {
      if(err) return next(err);
      if(!result) {
        req.flash('error', 'Incorrect password! Try Again!');
        return res.redirect('/users/login');
      }
      req.session.userId = user.id;
      console.log(typeof(user.id), typeof(user._id) )
      res.redirect(req.session.returnTo || '/users/dashboard');
      delete req.session.returnTo;
      // res.redirect('/users/dashboard');
    });
  });
});

// Logout
router.get('/logout', (req, res, next) => {
  console.log(req.session);
  if(!req.session) {
    req.flash('error', 'You must login first');
    res.redirect('/users/login');  
  }
  else {
    req.session.destroy();
    res.clearCookie('connect.sid');
    res.redirect('/users/login');
  }
}); 

module.exports = router;

