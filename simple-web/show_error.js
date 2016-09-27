// available http header error message
var common_http_errors = {
	'403': 'Forbidden',
	'404': 'Not Found',
	'500': 'Internal Server Error',
	'503': 'Bad Gateway'
};

module.exports = function(req, res, intcode) {
	var intcode = Number(intcode);
	var strcode = intcode.toString();
	res.writeHead(intcode, {
		'Content-Type': 'text/plain'
	});
	if (typeof  common_http_errors[strcode] === 'undefined') {
		res.write('Error: Opps! Something Went Wrong.\n');
	} else {
		res.write('Error: ' + strcode + ' - ' + common_http_errors[strcode] + '\n');
	}
	res.write('Route: ' + req.url + '\n');
	res.end();
}