var util = require('util');
var request = require('request');
var bp = require('./blogger-auth-config');
var google = require('googleapis');

var OAuth2 = google.auth.OAuth2;
var oauth2Client = new OAuth2( bp.CLIENT_ID, bp.CLIENT_SECRET, bp.REDIRECT_URL);
var auth_url = oauth2Client.generateAuthUrl({
	access_type: 'offline',
	scope: 'https://www.googleapis.com/auth/blogger'
});

// request(auth_url, function(err, res, ctn) {
// 	console.log(ctn);
// });

/*oauth2Client.getToken(code, function(err, tokens) {
	if (err) {
		console.log(err);
		return;
	}
	oauth2Client.setCredentials({
	  access_token: tokens
	});
	test_blogger();
});*/


var blogger = google.blogger('v3');
// test_blogger();

function test_blogger() {
	blogger.posts.insert({
		key: bp.KEY,
		blogId: bp.BLOG.KURIRNEWS,
		resource: {
			title: 'From node.js To blogger',
			content: 'Using Google APIS for node.js.',
			labels: ['lainnya']
		}, function() {
			console.log(util.inspect(arguments));
		}
	});
}


/*
blogger.blogs.get({
	key: bp.KEY,
	blogId: bp.BLOG.KURIRNEWS
}, function (err, result) {
	if (err) {
		console.error(err);
	}
	if (result) {
		console.log(util.inspect(result));
	}
});
*/


