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

    streamUpdate(id, stream){
        this._send("stream." + id, stream);
    }

    streamChatAddMessage(id, user, message){
        let data = {
            event: 'add',
            data: {
                user, message
            }
        };
        this._send("stream." + id + ".chat", data);
    }

    streamChatAddMessage(id, messageId){
        let data = {
            event: 'remove',
            data: messageId
        };
        this._send("stream." + id + ".chat", data);
    }
}

module.exports = new Messenger();