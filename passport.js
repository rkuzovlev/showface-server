const passport = require('passport'),
	  passportFB = require('passport-facebook'),
	  TokenStrategy = require('passport-accesstoken').Strategy,
	  express = require('express'),
	  utils = require('./utils'),
	  wl = require('./db').waterline,
	  config = require('config');


const FBStrategy = passportFB.Strategy;

const User = wl.collections.user;
const Social = wl.collections.social;
const Token = wl.collections.token;


const passportconf = config.get('passport')

const fbconf = passportconf.facebook
const fbStrategyConf = {
	"clientID": fbconf.clientID,
	"clientSecret": fbconf.clientSecret,
	"callbackURL": passportconf.server.host + fbconf.callbackURL,
	"profileFields": fbconf.profileFields
}


let loginOrCreate = function (socialType, socialID, name, email, socialData){
	return Social.loginOrCreateUser(socialType, socialID, name, email, socialData);
}

/*
profile._json = { id: '***************',
				  first_name: 'ivan',
				  last_name: 'ivanov',
				  email: 'email@example.com' }
*/
passport.use(new FBStrategy(fbStrategyConf, function(accessToken, refreshToken, profile, cb) {
	let u = profile._json
	let name = u.first_name + " " + u.last_name;
	
	loginOrCreate('facebook', u.id, name, u.email, u).then(function(token){
		if (!token){
			throw new Error("Can't login with facebook");
		}

		cb(null, token);
	}).catch(function(error){
		console.error(error);
		cb(error, null);
	});
}));



passport.use(new TokenStrategy(
	function(token, done) {
		Token.findUserByToken(token).then(function (user) {
			if (!user) { 
				return done(null, false);
			}

			return done(null, user);
		}).catch(function(){
			return done(err)
		});
	}
));

let passportAuthToken = function (req, res, next) {
    return passport.authenticate('token', function (err, user, info) {
		if (err) {
            return next(err);
        }

        if (user) {
        	req.user = user;
        }

        next();
    })(req, res, next);
};
module.exports.passportAuthToken = passportAuthToken;

let passportAuthTokenStrict = function (req, res, next) {
    return passport.authenticate('token', function (err, user, info) {
		if (err) {
            return next(err);
        }

        if (!user) {
            return next(utils.makeRequestError('Unauthorized', 401));
        }

    	req.user = user;
        next();
    })(req, res, next);
};
module.exports.passportAuthTokenStrict = passportAuthTokenStrict;


const router = express.Router();

router.get('/api/logout', 
	passportAuthTokenStrict,
	function(req, res, next){
		Token.removeToken(req.get('x-token')).then(function(){
			res.sendStatus(200);
		}).catch(function(err){
			return next(utils.makeRequestError('Unauthorized', 401));
		})
	}
);

router.get('/api/login/token', function(req, res, next){
	res.sendStatus(200);
});

router.get(fbconf.loginURL, passport.authenticate('facebook', { scope: fbconf.scope }));
router.get(fbconf.callbackURL, function(req, res, next){
	passport.authenticate('facebook', function(err, token, info){
		if (err) { 
			return next(err);
		}

		if (!token) {
			return next(utils.makeRequestError('Unauthorized', 401));
		}

		// req.logIn(token, function(err) {
		// 	if (err) {
		// 		return next(err);
		// 	}
		// 	return res.json(token);
		// });
		// res.json(token);

		res.redirect(302, '/api/login/token?token=' + token);
	})(req, res, next);
});


module.exports.passport = passport;
module.exports.router = router;