var md = require("markdown").markdown;

// Trello Cards markdown parser
module.exports = function(obj, html) {
	for(var i in obj) {
		for(var des in obj[i].cards) {
			var thisId = obj[i].cards[des];
			var DescHtml = md.toHTML(thisId.desc);
			thisId[html] = DescHtml;
		}
	}
	return obj;
}