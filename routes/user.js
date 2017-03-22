const express = require('express');
	  wl = require('../db').waterline,
	  utils = require('../utils'),
	  passport = require('../passport');

const router = express.Router();
const User = wl.collections.user;

router.get('/', 
	passport.passportAuthToken,

	function(req, res, next) {
		if (req.user){
			res.json(req.user);
		} else {
			return next(utils.makeRequestError('Unauthorized', 401));
		}
	}
);

module.exports = router;
