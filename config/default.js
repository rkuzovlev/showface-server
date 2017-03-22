let isError = false;
let error = function(){
	let arg = Array.prototype.slice.call(arguments, 0);
	console.error.apply(null, arg);
	isError = true;
}

let conf = {
	"kurento": {
		"service": {
			"host": process.env.KURENTO_SERVICE_HOST || error('env KURENTO_SERVICE_HOST is not found'),
			"port": process.env.KURENTO_SERVICE_PORT || error('env KURENTO_SERVICE_PORT is not found')
		}
	},
	// "cookie": {
	// 	"secret": "thisismystrongsecretstring"
	// },
	"redis": {
		"host": process.env.REDIS_HOST || error('env REDIS_HOST is not found'),
		"port": process.env.REDIS_PORT || error('env REDIS_PORT is not found')
	},
	"server": {
		"host": process.env.SERVER_HOST || error('env SERVER_HOST is not found'),
		"port": process.env.SERVER_PORT || error('env SERVER_PORT is not found')
	},
	"passport": {
		"server": {
			"host": process.env.PASSPORT_SERVER_HOST_URL || error('env PASSPORT_SERVER_HOST_URL is not found')
		},
		"facebook": {
			"clientID": process.env.FACEBOOK_CLIENT_ID || error('env FACEBOOK_CLIENT_ID is not found'),
			"clientSecret": process.env.FACEBOOK_CLIENT_SECRET || error('env FACEBOOK_CLIENT_SECRET is not found'),
			"callbackURL": "/api/login/facebook/callback",
			"loginURL": "/api/login/facebook",
			"scope": [
				"email", 
				"public_profile"
			],
			"profileFields": [
				"id", 
				"first_name", 
				"last_name", 
				"email"
			]
		}
	}
}

if (isError){
	process.exit(1);
}

module.exports = conf;