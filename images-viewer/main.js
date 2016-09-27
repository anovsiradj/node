'use strict';

// native
var win = nw.Window.get();
var fs = require('fs'); // https://nodejs.org/api/fs.html
const path = require('path'); // https://nodejs.org/api/path.html

// debug
// win.showDevTools();
// console.log('Loaded.');

// definition
const rx_allowed_ext = /\.(bmp|jpe?g|png|gifv?|svg)$/;

var menu1 = new nw.Menu({ type: 'menubar' });
var submenu1 = new nw.Menu();
submenu1.append(new nw.MenuItem({
	label: 'Open Folder...',
	click: () => {
		$($inpdir.$el).find('input:first').get(0).click();
	}
}));
submenu1.append(new nw.MenuItem({
	label: 'Add Folder...',
	click: () => {
		$($inpdir.$el).find('input:last').get(0).click();
	}
}));
menu1.append(new nw.MenuItem({
	label: 'File',
	submenu: submenu1
}));
menu1.append(new nw.MenuItem({
	label: 'Fullscreen',
	click: () => {
		win.toggleFullscreen();
	}
}));
menu1.append(new nw.MenuItem({
	label: 'Exit',
	click: () => {
		win.close(true);
	}
}));
win.menu = menu1;

// --------------------------------------------------------

// jquery/twbs/vue
var $inpdir = new Vue({
	el: '#inp-dir',
	data: {
		currpath: []
	},
	methods: {
		slc_dir: function(ev, append) {
			append = append || false;
			var dirpath = ev.target.value;
			if (this.currpath.indexOf(dirpath) === -1) {
				this.currpath.push(dirpath);
				if (append) {
					// what todo?
				} else {
					this.$set('currpath', []);
					$gallery.$set('images', []);
				}
				get_images(dirpath);
			}
		}
	}
});
var $gallery = new Vue({
	el: '#gallery',
	data: {
		images: [],
	},
	computed: {
		total: function() {
			return this.$data.images.length;
		}
	},
	methods: {
		view: function(idx) {
			$($mymodal.$el).modal('show');
			$mymodal.$data.idx = idx;
			$mymodal.$data.src = this.images[idx];
		}
	}
});
var $mymodal = new Vue({
	el: '#modal',
	data: {
		src: null,
		idx: null,
		modalsize: null
	}
});
$($mymodal.$el).modal({
	show: false,
	backdrop: 'static',
	keyboard: false
}).on('shown.bs.modal', function() {
	this.style.paddingLeft = 0;
	this.style.paddingRight = 0;
	document.addEventListener('keydown', image_prevnext);
	dox_blur();
	this.focus();
}).on('hidden.bs.modal', function() {
	$mymodal.$set('src', null);
	document.removeEventListener('keydown', image_prevnext);
	dox_blur();
});

// vanilla
function get_images(dirpath) {
	fs.readdir(dirpath, (err, files) => { // err = null, success
		files.forEach((filename, idx) => { // 3rd param: array itself
			if (rx_allowed_ext.test(filename.toLowerCase())) {
				var filepath = path.resolve(dirpath, filename); // get absfilepath
				$gallery.$data.images.push(filepath);
			}
		});
	});
}

function dox_blur() {
	// http://stackoverflow.com/a/21551843
	if (document.activeElement !== document.body) document.activeElement.blur();
}

function image_prevnext(ev) {
	var kc = ev.keyCode;
	if (/(37|39)/.test(kc)) {
		ev.preventDefault();
		var len = $gallery.$data.total - 1;
		var idx = $mymodal.$data.idx + (kc - 38);
		if (idx < 0) idx = len;
		if (idx > len) idx = 0;
		$gallery.view(idx);
	}
}
