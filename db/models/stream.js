const Waterline = require('waterline');
const utils = require('../../utils');
const _ = require('lodash');
const wsmsg = require('../../ws-messenger');

module.exports = Waterline.Collection.extend({
	identity: 'stream',
	connection: 'default',
	attributes: {
		title: {
			type: 'string'
		},
		image: {
			type: 'string'
		},
		description: {
			type: 'text'
		},
		closed: {
			type: 'boolean',
			defaultsTo: false
		},
		streamers: {
			collection: 'user',
			via: 'streams',
			dominant: true
		},
		moderators: {
			collection: 'user',
			via: 'moderStreams',
			dominant: true
		}
	},

	updateStream: function(id, data){
		const StreamModel = this.waterline.collections.stream;
		data = _.pick(data, ['title', 'description', 'image']);	
		return StreamModel.update({id: id}, data).then((streams) => {
			if (!streams[0]){
				throw new Error(`stream with id ${id} is not found`);
			}
			wsmsg.streamUpdate(id, streams[0]);
			return streams[0];
		});
	},

	findStream: function(id){
		const StreamModel = this.waterline.collections.stream;
		return StreamModel.findOne({where: {id: +id}});
	},

	findNonClosedStreams: function(){
		const StreamModel = this.waterline.collections.stream;
		return StreamModel.find({where: {closed: false}});
	},

	findNonClosedStream: function(id){
		const StreamModel = this.waterline.collections.stream;
		return StreamModel.findOne({where: {id: +id, closed: false}});
	},

	findStreamWithModerators: function(id){
		const UserModel = this.waterline.collections.user;
		return this.findStream(id).populate('moderators');
	},

	findStreamWithModeratorsAndStreamers: function(id){
		const UserModel = this.waterline.collections.user;
		return this.findStream(id).populate('moderators').populate('streamers');
	},

	findStreamWithStreamers: function(id){
		const UserModel = this.waterline.collections.user;
		return this.findStream(id).populate('streamers');
	},
	
    toJSON: function() {
		var obj = this.toObject();
		// delete obj.password;
		return obj;
    }
});