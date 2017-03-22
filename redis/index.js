const redis = require("redis");
const config = require("config");
const debug = require('debug')('redis:client');
const client = redis.createClient(config.get('redis'));

client.on('error', function(err){
	debug(err);
});

client.on('ready', function(){
	debug('Redis is connected');
});

module.exports = client