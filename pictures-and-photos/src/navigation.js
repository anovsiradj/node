(function() {
	var submenu1 = new nw.Menu();
	submenu1.append(new nw.MenuItem({
		label: 'Open Folder...',
		key: 'O',
		modifiers: 'ctrl',
		click: () => {
			// trigger, open
			vm_gallery.$data.is_add_dir = false;
			elm_input_dir.click();
		}
	}));
	submenu1.append(new nw.MenuItem({
		label: 'Add Folder...',
		key: 'P',
		modifiers: 'ctrl',
		click: () => {
			// trigger, add
			vm_gallery.$data.is_add_dir = true;
			elm_input_dir.click();
		}
	}));

	var submenu2 = new nw.Menu();
	if (MYAPP.ENV === 'dev') {
		submenu2.append(new nw.MenuItem({
			label: 'Reload',
			key: 'R',
			modifiers: 'ctrl',
			click: () => {
				fn_rm_cache();
				nwwin.reload();
			}
		}));
	}
	submenu2.append(new nw.MenuItem({
		label: 'Help',
		key: 'F1',
		click: () => {
			alert(MYAPP.HELP.join('\n'));
		}
	}));
	submenu2.append(new nw.MenuItem({
		label: 'About',
		click: () => {
			alert(
				MYAPP.INFO.NAME +
				' (' + MYAPP.INFO.VERSION + ')\n' +
				MYAPP.ABOUT.join('\n')
			);
		}
	}));
	submenu2.append(new nw.MenuItem({
		label: 'Exit',
		click: fn_app_close
	}));

	var submenu3 = new nw.Menu();
	submenu3.append(new nw.MenuItem({
		label: 'FullScreen',
		key: 'F11',
		click: () => {
			nwwin.toggleFullscreen();
		}
	}));
	submenu3.append(new nw.MenuItem({
		label: 'Zoom In',
		key: 'Up',
		modifiers: 'ctrl',
		click: () => {
			vm_gallery.zoomin();
		}
	}));
	submenu3.append(new nw.MenuItem({
		label: 'Zoom Out',
		key: 'Down',
		modifiers: 'ctrl',
		click: () => {
			vm_gallery.zoomout();
		}
	}));

	var menubar = new nw.Menu({ type: 'menubar' });
	menubar.append(new nw.MenuItem({
		label: 'File',
		submenu: submenu1
	}));
	menubar.append(new nw.MenuItem({
		label: 'View',
		submenu: submenu3
	}));
	menubar.append(new nw.MenuItem({
		label: 'App',
		submenu: submenu2
	}));

	nwwin.menu = menubar;
})();
