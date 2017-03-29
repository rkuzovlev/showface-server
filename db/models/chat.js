const Waterline = require('waterline');
const utils = require('../../utils');
const _ = require('lodash');
const wsmsg = require('../../ws-messenger');

module.exports = Waterline.Collection.extend({
	identity: 'chat',
	connection: 'default',
	attributes: {
		message: {
			type: 'string'
		},
		deleted: {
			type: 'boolean',
			defaultsTo: false
		},
        user: {
			model: 'user'
		},
		stream: {
			model: 'stream'
		}
	},

    createMessage(streamId, user, message){
        const StreamModel = this.waterline.collections.stream;
        const ChatModel = this.waterline.collections.chat;

        return StreamModel.findNonClosedStreams(streamId).then(function(stream){
			if (!stream){
				throw utils.makeRequestError('Stream not found', 404);
			}
            
            if (stream.closed){
				throw utils.makeRequestError('Forbidden', 403);
			}

			return ChatModel.create({message, user: user.id, stream: streamId}).then(function(msg){
				wsmsg.streamChatAddMessage(streamId, user, msg);
				return msg;
			});
		});
    },

    toJSON() {
		var obj = this.toObject();
		// delete obj.password;
		return obj;
    }
});