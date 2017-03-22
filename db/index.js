var Waterline = require('waterline');
var sailsMysqlAdapter = require('sails-mysql');
var debug = require('debug')('server:waterline');

var waterline = new Waterline();

waterline.loadCollection(require('./models/user'));
waterline.loadCollection(require('./models/social'));
waterline.loadCollection(require('./models/stream'));
waterline.loadCollection(require('./models/token'));

// Set up the storage configuration for waterline.
var config = {
	adapters: {
		'mysql': sailsMysqlAdapter
	},

	connections: {
		default: {
			adapter: 'mysql',
			host: 'localhost',
			user: 'show_face',
			password: 'show_face',
			database: 'show_face',
			dateStrings: true
		}
	}
};

module.exports.connect = new Promise(function(resolve, reject){
	debug('Initialize');
	waterline.initialize(config, function (err, ontology) {
		if (err) {
			return reject(err);
		}
		
		debug('Initialization complete');
		resolve();
	});
});

module.exports.waterline = waterline
