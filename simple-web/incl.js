var fs = require('fs');

module.exports = (req, res, filepath) => {
	fs.readFile(filepath, (err, data) => {
		if (err === null) {
			res.write(data);
			res.end();
		}
	});
}