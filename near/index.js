var myapp = {
	target: 'http://ne-a-r.blogspot.com/'
};

function app_load(ev) {
	// alert(1);
	// console.log(ev);
}

myapp.win = nw.Window.open(myapp.target, {}, function(win) {
	win.showDevTools();
	win.maximize();
	console.log(win.window);
});
