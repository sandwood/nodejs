var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('connect-flash');
var messages = require('express-messages');
var mongoose = require('mongoose');

var app = express();
var promise = mongoose.connect('mongodb://guests:1234@ds161443.mlab.com:61443/sandwood01', {
    useMongoClient: true,
});

var homeRouter = require('./routes/home');
var flashRouter = require('./routes/flash');
var authRouter = require('./routes/auth')

promise.then(function(db) {
    console.log('db ok');
})

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// 1. static files - css, js(client) files, font, imgs
app.use('/static/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({
    secret: 'sandwood',
    resave: true,
    saveUninitialized: true
}));
app.use(flash());
app.use(function(req, res, next){
    res.locals.messages = messages(req, res);
    next();
});

app.use(function(req, res, next){
    res.locals.user = req.session.user;
    next();
})


// 2. router
app.use('/', homeRouter);
app.use('/flash', flashRouter);
app.use('/', authRouter);  //signup, login

app.listen(3000, function(){
    console.log("server is running!");
})