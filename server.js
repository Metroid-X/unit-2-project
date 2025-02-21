const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');
const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');

const authController = require('./controllers/auth.js');
const topicsController = require('./controllers/topics.js');

const port = process.env.PORT ? process.env.PORT : '3001';

const path = require('path');

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// MIDDLEWARE vvvv || DEPENDENCIES ^^^^


// find the css folder
app.use(express.static(path.join(__dirname, 'public')));
// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: false }));
// Middleware for using HTTP verbs such as PUT or DELETE
app.use(methodOverride("_method"));
// app.use(morgan('dev'));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passUserToView); // use new passUserToView middleware here

// ROUTES

// app.get('/', (req, res) => {
//     res.redirect('/guest/forums');
// });


// // The user does not need to be redirected when on the
// // index page, as all changes are handled on the index
// // page itself.
app.get('/', (req, res) => {
    // check if we're signed in
    if(req.session.user){
        res.redirect(`/${req.session.user.displayname}/forums`);
    } else {
        res.render('index.ejs', {
        });
    }
});
  
  
  
  

  app.use('/auth', authController);
  app.use(isSignedIn);
  app.use(`/:userName/forums`, topicsController);
  
  app.listen(port, () => {
    console.log(`The express app is ready on port ${port}!`);
  });
    