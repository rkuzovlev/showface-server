const Waterline = require('waterline');
const crypto = require('crypto');

module.exports = Waterline.Collection.extend({
	identity: 'social',
	connection: 'default',
	attributes: {
		type: {
			type: 'string',
			enum: ['facebook', 'google', 'vk', 'twitter'],
			required: true
		},

		social_id: {
			type: 'string',
			required: true
		},

		data: {
			type: 'string',
			required: true
		},

		user: {
			model: 'user'
		}
	},

	loginOrCreateUser: function(socialType, socialID, name, email, socialData){
		const where = { 
			social_id: socialID,
			type: socialType
		};

		let generateToken = new Promise(function(resolve, reject){
			crypto.randomBytes(48, function(err, buffer) {
				if(err){
					reject(err);
				}

				resolve(buffer.toString('hex'));
			});
		});

		const User = this.waterline.collections.user;
		const Social = this.waterline.collections.social;
		const Token = this.waterline.collections.token;

		return Social.findOne({ where: where }).populate('user').then(function(social){
			return Promise.all([Promise.resolve(social), generateToken]);
		}).spread(function(social, token){
			if (social){
				return Token.create({token: token, user: social.user.id}).then(token => token.token);
			}

			return User.create({ name: name, email: email }).then(function(user){
				let createSocial = Social.create({type: socialType, social_id: socialID, data: JSON.stringify(socialData), user: user.id});
				let createToken = Token.create({token: token, user: user.id});

				return Promise.all([createToken, createSocial])
			}).spread(function(token, user){
				if (!token || !user){
					return null;
				}

				return token.token;
			});
		});
	},
	
	toJSON: function() {
		var obj = this.toObject();
		// delete obj.password;
		return obj;
	}
});