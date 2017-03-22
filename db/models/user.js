const Waterline = require('waterline');

module.exports = Waterline.Collection.extend({
	identity: 'user',
	connection: 'default',
	attributes: {
		name: {
			type: 'string'
		},
		status: {
			type: 'string'
		},
		email: {
			type: 'email'
		},
		avatar: {
			type: 'string'
		},
		moderator: {
			type: 'boolean',
			defaultsTo: false
		},
		socials: {
			collection: 'social',
			via: 'user'
		},
		tokens: {
			collection: 'token',
			via: 'user'
		},
		streams: {
			collection: 'stream',
			via: 'streamers'
		},
		moderStreams: {
			collection: 'stream',
			via: 'moderators'
		}
	},
	
    toJSON: function() {
		var obj = this.toObject();
		// delete obj.password;
		return obj;
    }
});