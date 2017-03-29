const _ = require('lodash');

class Messenger {
    constructor(){
        this.scServer = null
    }
    
    setScServer(scServer){
        this.scServer = scServer;
    }

    _send(event, data){
        this.scServer.exchange.publish(event, data);
    }

    streamUpdate(streamId, stream){
        this._send("stream." + streamId, stream);
    }

    streamChatAddMessage(streamId, user, message){
        let data = {
            event: 'add',
            data: {
                id: message.id,
                message: message.message,
                createdAt: message.createdAt,
                user: _.pick(user, ['id', 'name', 'moderator'])
            }
        };
        this._send("stream." + streamId + ".chat", data);
    }

    streamChatRemoveMessage(streamId, messageId){
        let data = {
            event: 'remove',
            data: messageId
        };
        this._send("stream." + streamId + ".chat", data);
    }
}

module.exports = new Messenger();