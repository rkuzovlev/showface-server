const config = require('config');
const debug = require('debug')('server:cluster');
const SocketCluster = require('socketcluster').SocketCluster;

var socketCluster = new SocketCluster({
    workers: 1,
    brokers: 1,
    port: config.get('server.port'),
    host: config.get('server.host'),
    appName: 'app',
    wsEngine: 'uws',
    workerController: __dirname + '/worker.js',
    brokerController: __dirname + '/broker.js',
    socketChannelLimit: 1000, // TODO: move to config
    rebootWorkerOnCrash: false
});

socketCluster.on('workerExit', function(worker){
    debug('workerExit', worker.id);
    socketCluster.killWorkers();
    socketCluster.killBrokers();
    process.exit(1);
})