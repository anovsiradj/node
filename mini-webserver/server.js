// variable yg sudah tersedia:
// exports, require, module, __filename, __dirname

const port = 9000;

var http = require('http');
var server = http.createServer(require('./router'));

// log when server ready
server.listen(port, () => {
	console.log("Server listening on port:", port);
});
