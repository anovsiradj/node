var bp = require('./blogger-auth-config'),
	googleapis = require('googleapis'),
	blogger = googleapis.blogger('v3'),
	oauth2Client = new googleapis.auth.OAuth2(bp.CLIENT_ID, bp.CLIENT_SECRET, bp.REDIRECT_URL);

var var_gb = new Gooblog();
function fn_google_auth() {
	var_gb.init();
}

function Gooblog() {
	this.authwin = null;
	this.server = null;
}

Gooblog.prototype.init = function() {
	var that = this;
	this.server = require('http').createServer(function(req, res) {
		console.log(req.url);
		if (/^\/callback/.test(req.url)) {
			console.log('svr.cb.auth');

			var param_auth_code = req.url.split('code=')[1];

			oauth2Client.getToken(param_auth_code, function(err, auth_token) {
				that.authwin.close(true);

				if (err) {
					alert(err);
					return;
				}

				oauth2Client.setCredentials(auth_token);
				googleapis.options({
					auth: oauth2Client
				});
			});
		}
	});

	this.server.listen(bp.PORT_URL, function() {
		console.log("svr.start port:", bp.PORT_URL);
		that.open_win();
	});
};

Gooblog.prototype.open_win = function() {
	var that = this;
	nw.Window.open(this.get_auth_url(), {}, function(win) {
		win.on('closed', function() {
			setTimeout(that.close_win, 0);
		});
		that.authwin = win;
	});
};

Gooblog.prototype.close_win = function() {
	console.log('authwin.close');
	this.authwin = null;
	this.server = null;
	if (this.server) this.server.close();
};

Gooblog.prototype.get_auth_url = function() {
	return oauth2Client.generateAuthUrl({ access_type: 'offline', scope: bp.AUTH_SCOPE });
};

Gooblog.prototype.test_blogger = function() {
	blogger.posts.insert({
		key: bp.KEY,
		blogId: bp.BLOG.KURIRNEWS,
		resource: {
			title: 'From node.js To blogger',
			content: 'Using Google APIS for node.js.',
			labels: ['lainnya']
		}, function() {
			console.log(arguments);
		}
	});
};

Gooblog.prototype.post_to_kurirnews = function(data) {
	blogger.posts.insert({
		key: bp.KEY,
		blogId: bp.BLOG.KURIRNEWS,
		resource: data,
		function() {
			console.log(arguments);
		}
	});
};
