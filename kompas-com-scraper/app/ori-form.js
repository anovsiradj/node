var webframe = document.getElementById('webframe');
var node_request = require('request');

function begin_scraping(url_tgt) {

	console.log(url_tgt);

	node_request(url_tgt, function (err, res, body) {
		if (err) {
			alert(err);
			return;
		}
		if (res.statusCode == 200) {
			console.log(body);
		}
	});

}