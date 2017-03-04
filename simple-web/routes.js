var incl = require('./incl');
var show_error = require('./show_error');

var route = {};
route['/'] = route['/home'] = (req, res) => {
	incl(req, res, './templat/home.html');
}
route['/about'] = (req, res) => {
	incl(req, res, './templat/me.html');
}

route['/service'] = (req, res) => {
	var mysql = require('./test-mysql');
	mysql.query("SELECT * FROM links", function(err, sql_res, field) {
		if (err) throw err;
		// console.log(res);

		var data = [];
		for (var i = 0; i < sql_res.length; i++) {
			var item = {
				id: sql_res[i].id,
				link: sql_res[i].detail
			};
			// console.log(res[i]);
			data.push(sql_res[i]);
		}
		res.write(JSON.stringify(data));
		res.end();
	});
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