var fs = require('fs');

module.exports = (_res, _path) => {
	_path = '.' + _path;
	fs.readFile(_path, (_err, _data) => {
		if (_err === null) {
			res.write(_data);
		} else {
			res.writeHead(404);
			res.write('Asset Not Found.');
		}
	});
};