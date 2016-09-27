var route = require('./routes');

exports.handler = (req, res) => {
	if (typeof route[req.url] === 'undefined') {
		route['/404'](req, res);
	} else {
		route[req.url](req, res);
	}
}
