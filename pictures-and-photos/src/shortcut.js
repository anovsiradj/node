(function() {

	if (!MYAPP.USE_SHORTCUT) return;

	var show_next = new nw.Shortcut({
		key: "Left",
		active: () => {
			vm_gallery.act_prev_img();
		}
	});
	nw.App.registerGlobalHotKey(show_next);

	var show_prev = new nw.Shortcut({
		key: "Right",
		active: () => {
			vm_gallery.act_next_img();
		}
	});
	nw.App.registerGlobalHotKey(show_prev);

})();
