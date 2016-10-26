// variable yg sudah tersedia:
// exports, require, module, __filename, __dirname

const port = 9000;

var server = require('http').createServer(require('./router'));

// start server
server.listen(port, () => {
	console.log("Server listening on port:", port);
});
