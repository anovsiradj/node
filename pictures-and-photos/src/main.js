const MYAPP = {
	ENV: 'prod',
	INFO: {
		NAME: 'pictures-and-photos',
		VERSION: '1.0'
	},
	USE_SHORTCUT: true, // left/right override all WindowsOS
	ABOUT: [
		'My second experiment for another-image-viewer',
		'\nCreated By: anovsiradj (Mayendra Costanov)',
		'<anov.siradj(22@(gmail|live).com|@gin.co.id)>',
		'\nIn 2016 at Kerja3.'
	],
	HELP: [
		'Shortcut:',
		'Prev image: Left Arrow',
		'Next image: Right Arrow',
		'For other shortcut, you can see in menubar.',
		'\nBug report / Feature request:',
		'Visit: http://github.com/anovsiradj/node/',
		'with title: "imageviewer2 YOUR_ISSUE"',
		'\n Thanks.'
	]
};

var nwwin = nw.Window.get();
var elm_input_dir = document.getElementById('input_dir');
var elm_imgelm = document.getElementById('imgelm');
var elm_mainbar_inner = document.getElementById('mainbar-inner');
if (MYAPP.ENV === 'dev') {
	nwwin.showDevTools();
}

function fn_app_close() {
	if (MYAPP.ENV === 'dev') fn_rm_cache();
	nwwin.close(true);
}

function fn_rm_cache() {
	for(module in global.require.cache) {
		if(global.require.cache.hasOwnProperty(module)) {
			delete global.require.cache[module];
		}
	}
}
