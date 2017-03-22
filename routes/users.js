const express = require('express'),
	  wl = require('../db').waterline,
	  passport = require('../passport'),
	  utils = require('../utils');

const router = express.Router();
const User = wl.collections.user;


router.get('/:id', function(req, res, next) {
	const id = parseInt(req.params.id);
	User.findOneById(id).then(function(user){
		if (!user){
			return next(utils.makeRequestError('User not found', 404));
		}

		res.json(user);
	}).catch(function(err){
		next(err);
	});
});

router.post('/', function(req, res, next) {
	res.json({body: 'users post not implemented'});
	// const id = parseInt(req.params.id);
	// User.findOneById(id).then(function(user){
	// 	if (!user){
	// 		return next(utils.makeRequestError('User not found', 404));
	// 	}

	// 	res.json(user);
	// }).catch(function(err){
	// 	next(err);
	// });
});

router.put('/:id', function(req, res, next) {
	res.json({body: 'users put not implemented' + req.params.id});
	// const id = parseInt(req.params.id);
	// User.findOneById(id).then(function(user){
	// 	if (!user){
	// 		return next(utils.makeRequestError('User not found', 404));
	// 	}

	// 	res.json(user);
	// }).catch(function(err){
	// 	next(err);
	// });
});


module.exports = router;
