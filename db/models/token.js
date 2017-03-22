const Waterline = require('waterline');

module.exports = Waterline.Collection.extend({
	identity: 'token',
	connection: 'default',
	attributes: {
		token: {
			type: 'string'
		},
		user: {
			model: 'user'
		}
	},
	
    toJSON: function() {
		var obj = this.toObject();
		// delete obj.password;
		return obj;
    },

	removeToken: function(token){
		const TokenModel = this.waterline.collections.token;

		return TokenModel.destroy({token: token});
	},

    findUserByToken: function(token){
		const TokenModel = this.waterline.collections.token;
		
		return TokenModel.findOne({token: token}).populate('user').then(function(token){
			if (!token){
				return null;
			}

			return token.user;
		});
    }
});