var fs = require('fs');
var path = require('path');
var app = require('./app');
var db = require('./db');
const wsmsg = require('./ws-messenger');
const debug = require('debug')('server:worker');
// var healthChecker = require('sc-framework-health-check');

module.exports.run = function (worker) {
	console.log('	 >> Worker PID:', process.pid);
	var environment = worker.options.environment;

	var httpServer = worker.httpServer;
	var scServer = worker.scServer;

    wsmsg.setScServer(scServer);

    db.connect.catch((err) => {
        console.error(err);
        process.exit(1);
    });

	// Add GET /health-check express route
	// healthChecker.attach(worker, app);

	httpServer.on('request', app);

	var count = 0;

	scServer.on('connection', function (socket) {
        debug("ws client is connected");

		socket.on('sampleClientEvent', function (data) {
			count++;
			console.log('Handled sampleClientEvent', data);
			scServer.exchange.publish('sample', count);
		});

		socket.on('disconnect', function () {
            debug("ws client is disconnected");
		});
	});
};
