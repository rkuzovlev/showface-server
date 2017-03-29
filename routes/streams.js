const express = require('express'),
	  wl = require('../db').waterline,
	  utils = require('../utils'),
	  _ = require('lodash'),
	  passport = require('../passport');

const router = express.Router();
const User = wl.collections.user;
const StreamModel = wl.collections.stream;
const ChatModel = wl.collections.chat;

router.get('/browse', function(req, res, next) {
	StreamModel.findNonClosedStreams().then(function(streams){
		res.json(streams);
	}).catch(function(err){
		next(err);
	});
});

router.get('/:id',
	passport.passportAuthToken,
 	
 	function(req, res, next) {
		StreamModel.findStream(+req.params.id).then(function(stream){
			if (!stream){
				throw utils.makeRequestError('Stream not found', 404);
			}

			if (stream.closed && (!req.user || !req.user.moderator)){
				throw utils.makeRequestError('Forbidden', 403);
			}

			res.json(stream);
		}).catch(function(err){
			next(err);
		});
	}
);

router.put('/:id',
	passport.passportAuthTokenStrict,
 	
 	function(req, res, next) {
 		var streamId = +req.params.id;
		StreamModel.findStreamWithModeratorsAndStreamers(streamId).then(function(stream){
			if (!stream){
				throw utils.makeRequestError('Stream not found', 404);
			}

			if (stream.closed && !req.user.moderator){
				throw utils.makeRequestError('Forbidden', 403);
			}

			if (req.user.moderator){
				return StreamModel.updateStream(streamId, req.body);
			}

			var userId = +req.user.id;
			var isModerator = _.some(stream.moderators, ['id', userId]);
			var isStreamer = _.some(stream.streamers, ['id', userId]);
			
			if (!isModerator && !isStreamer){
				throw utils.makeRequestError('Forbidden', 403);
			}

			return StreamModel.updateStream(streamId, req.body);
		}).then(function(stream){
			res.json(stream);
		}).catch(function(err){
			next(err);
		});
	}
);


router.post('/:id/open',
	passport.passportAuthTokenStrict,
 	
 	function(req, res, next) {
 		if (!req.user.moderator){
			return next(utils.makeRequestError('Forbidden', 403));
		}
 		
 		var streamId = +req.params.id;
		
		StreamModel.findStream(streamId).then(function(stream){
			if (!stream){
				throw utils.makeRequestError('Stream not found', 404);
			}
			
			stream.closed = false;

			stream.save((err) => {
				if (err){
					next(err);
				}

				res.sendStatus(200);
			});
		}).catch(function(err){
			next(err);
		});
	}
);

router.post('/:id/close',
	passport.passportAuthTokenStrict,
 	
 	function(req, res, next) {
 		if (!req.user.moderator){
			return next(utils.makeRequestError('Forbidden', 403));
		}
 		
 		var streamId = +req.params.id;
		
		StreamModel.findStream(streamId).then(function(stream){
			if (!stream){
				throw utils.makeRequestError('Stream not found', 404);
			}
			
			stream.closed = true;

			stream.save((err) => {
				if (err){
					next(err);
				}
				
				res.sendStatus(200);
			});
		}).catch(function(err){
			next(err);
		});
	}
);

router.post('/:id/chat/message',
	passport.passportAuthTokenStrict,
 	
 	function(req, res, next) {
 		var streamId = +req.params.id;

		ChatModel.createMessage(streamId, req.user, req.body.message).then(function(message){
			res.json(message);
		}).catch(function(err){
			next(err);
		});
	}
);

router.get('/:id/moderators',
	passport.passportAuthToken,
 	
 	function(req, res, next) {
		StreamModel.findStreamWithModerators(+req.params.id).then(function(stream){
			if (!stream){
				throw utils.makeRequestError('Stream not found', 404);
			}

			if (stream.closed && (!req.user || !req.user.moderator)){
				throw utils.makeRequestError('Forbidden', 403);
			}

			res.json(stream.moderators);
		}).catch(function(err){
			next(err);
		});
	}
);

router.get('/:id/streamers', 
	passport.passportAuthToken,
	
	function(req, res, next) {
		StreamModel.findStreamWithStreamers(+req.params.id).then(function(stream){
			if (!stream){
				throw utils.makeRequestError('Stream not found', 404);
			}

			if (stream.closed && (!req.user || !req.user.moderator)){
				throw utils.makeRequestError('Forbidden', 403);
			}

			res.json(stream.streamers);
		}).catch(function(err){
			next(err);
		});
	}
);

module.exports = router;
