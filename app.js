const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passportLib = require('./passport');
// const session = require('express-session');
// const RedisStore = require('connect-redis')(session);
const redis = require('./redis');
const config = require('config');

const user = require('./routes/user');
const users = require('./routes/users');
const streams = require('./routes/streams');

const app = express();

const passportRouter = passportLib.router;
const passport = passportLib.passport;

// const cookieSecret = config.get('cookie.secret');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser(cookieSecret));
app.use(express.static(path.join(__dirname, 'public')));
// app.use(session({
//     store: new RedisStore({client: redis}),
//     // secret: cookieSecret,
//     resave: false,
//     saveUninitialized: false
// }));

app.use(passport.initialize());
// app.use(passport.session());

// make ping simulation, all requests should wait some random milliseconds before response
app.use(function(req, res, next){
	let wait = Math.trunc(Math.random()*200) + 300;
	setTimeout(next, wait);
});

app.use('/', passportRouter);
app.use('/api/streams', streams);
app.use('/api/user', user);
app.use('/api/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	let err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
	let status = err.status || 500;
	let body = req.app.get('env') === 'production' ? 'Something wrong' : err.message;

	res.status(status);
	res.json({'status': status, body: body})
});

module.exports = app;
