module.exports.makeRequestError = function(message, status){
	var e = new Error(message);
	e.status = status;
	return e;
}