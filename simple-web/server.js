// variable yg sudah tersedia:
// exports, require, module, __filename, __dirname

const port = 9000;

var http = require('http');

var router = require('./router');
var server = http.createServer(router.handler);

// start server
server.listen(port, () => {
	console.log("Server listening on port:", port);
});
