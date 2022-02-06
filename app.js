const express = require("express");
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require("passport");


const app = express();

//passport config
require('./config/passport')(passport);

//DB config
var mongoDB = 'mongodb+srv://kSapi:spdC-6*nmzuW-cd@cluster0.revcx.mongodb.net/auth_app?retryWrites=true&w=majority';
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//BodyParser
app.use(express.urlencoded({extended: false}));

//Express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    //cookie: { secure: true }
  }))

//Connect flash
app.use(flash());

//passport middleware
app.use(passport.initialize());
app.use(passport.session());


//global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
})

//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

const PORT = process.env.PORT || 5001;

app.listen(PORT, console.log(`server started on port ${PORT}`));