var nwwin = nw.Window.get();
var node_fs = require('fs');

nwwin.maximize(); // nwwin.enterFullscreen();
nwwin.showDevTools();

function fn_appexit() {
	fn_rmcache();
	nwwin.close(true);
}
function fn_appreload() {
	fn_rmcache();
	nwwin.reload();
}
function fn_rmcache() {
	for(module in global.require.cache) {
		if(global.require.cache.hasOwnProperty(module)) {
			delete global.require.cache[module];
		}
	}
}
