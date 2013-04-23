module.exports = function(o) {
	for(var x in o) {
		return false;
	}
	return true;
}