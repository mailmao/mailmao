module.exports = function(dir, name, type, filecnt, next) {
		if(type == 'json') {
			filecnt = JSON.stringify(filecnt);
		}
		fs.writeFile(app.locals.root + dir + name + '.' + type, filecnt, function(err) {
			if(err) {
				console.log(err);
			} else {
				console.log(name + '.' + type + " This file was saved!");
				if(next) {
					next();
				}
			}
		});
	}