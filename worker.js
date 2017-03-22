var fs = require('fs');
var path = require('path');
var app = require('./app');
var db = require('./db');
const debug = require('debug')('server:worker');
// var healthChecker = require('sc-framework-health-check');

module.exports.run = function (worker) {
	console.log('	 >> Worker PID:', process.pid);
	var environment = worker.options.environment;

	var httpServer = worker.httpServer;
	var scServer = worker.scServer;

    db.connect.catch((err) => {
        console.error(err);
        process.exit(1);
    });

	// Add GET /health-check express route
	// healthChecker.attach(worker, app);

	httpServer.on('request', app);

	var count = 0;

	/*
		In here we handle our incoming realtime connections and listen for events.
	*/
	scServer.on('connection', function (socket) {

		// Some sample logic to show how to handle client events,
		// replace this with your own logic

		socket.on('sampleClientEvent', function (data) {
			count++;
			console.log('Handled sampleClientEvent', data);
			scServer.exchange.publish('sample', count);
		});

		var interval = setInterval(function () {
			socket.emit('rand', {
				rand: Math.floor(Math.random() * 5)
			});
		}, 1000);

		socket.on('disconnect', function () {
			clearInterval(interval);
		});
	});
};
