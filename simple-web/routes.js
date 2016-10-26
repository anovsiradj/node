var incl = require('./incl');
var show_error = require('./show_error');

var route = {};
route['/'] = route['/home'] = (req, res) => {
	incl(req, res, './templat/home.html');
}
route['/about'] = (req, res) => {
	incl(req, res, './templat/me.html');
}

// other error
route['/admin'] = (req, res) => {
	show_error(req, res, 403);
}
route['/err'] = (req, res) => {
	show_error(req, res, 500);
}

// special route.
route['/404'] = (req, res) => { show_error(req, res, 404); }

module.exports = route;