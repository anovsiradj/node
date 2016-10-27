var native_fs = require('fs');
const RX_ALLOWED_EXT = /\.(bmp|jpe?g|png|gifv?|svg)$/;

var vm_gallery = new Vue({
	el: '#content',
	data: {
		zoom_percent: 80,
		is_add_dir: false,
		selected_dir: null,
		opened_img: null,
		opened_index: null,
		opened_dir: [],
		image_list: [],
		msg_error: null
	},
	computed: {
		dyn_img_ready: function() {
			if (this.$data.image_list.length > 1) return true;
			return false;
		},
		dyn_zoom: function() {
			if (this.$data.zoom_percent > 100) this.$data.zoom_percent = 100;
			if (this.$data.zoom_percent < 0) this.$data.zoom_percent = 0;
			return this.$data.zoom_percent;
		}
	},
	methods: {
		act_select_dir: function(val) {
			var dir = this.$data.selected_dir = val;
			if (!dir && dir === '') return; // open dialog-dir then cancel it, will return empty
			// console.log(dir)
			if (this.$data.opened_dir.indexOf(dir) === -1) { // ok, dir belum pernah dipilih
				if (this.$data.is_add_dir) { // jika tambah-dir
					this.$data.opened_dir.push(dir);
				} else { // jika buka-dir
					this.$data.opened_dir = [dir];
				}
				this.act_read_dir();
			}
		},
		act_read_dir: function() {
			var dir = this.$data.selected_dir;
			var that = this;

			native_fs.readdir(dir, (err, files) => { // err = null => success
				if (err) {
					that.act_error(err);
					return; // stop
				}
				var len = 0;
				files.forEach((file, idx) => { // 3rd param: array itself
					if (RX_ALLOWED_EXT.test(file.toLowerCase())) {
						var fullpath = dir + '/' + file;
						len++;
						that.$data.image_list.push({
							'file': file,
							'dir': dir,
							'path': fullpath
						});
					}
				});

				if (len < 1) { // dir kosong
					that.act_error('No Image in folder: ' + dir); // kasih tahu user
					that.$data.opened_dir.$remove(dir); // hapus dari daftar dir-yg-dibuka
				}
			});
		},
		act_error: function(msg) {
			this.$data.msg_error = msg;
		},
		act_viewimg: function(img) {
			this.$data.opened_img = img;
		},
		zoomin: function(numb) {
			numb = numb || 10;
			this.$data.zoom_percent += numb;
		},
		zoomout: function(numb) {
			numb = numb || 10;
			this.$data.zoom_percent -= numb;
		},
		act_prev_img: function() {
			if (this.dyn_img_ready) {
				var idx;
				if (this.$data.opened_img) {
					idx = this.$data.image_list.indexOf(this.$data.opened_img)-1;
					if (idx < 0) idx = this.$data.image_list.length-1;
				} else {
					idx = this.$data.image_list.length-1;
				}
				this.$data.opened_index = idx;
				this.$data.opened_img = this.$data.image_list[idx];
			}
		},
		act_next_img: function() {
			if (this.dyn_img_ready) {
				var idx;
				if (this.$data.opened_img) {
					idx = this.$data.image_list.indexOf(this.$data.opened_img)+1;
					if (idx > (this.$data.image_list.length-1)) idx = 0;
				} else {
					idx = 0;
				}
				this.$data.opened_index = idx;
				this.$data.opened_img = this.$data.image_list[idx];
			}
		}
	}
});

// console.log(vm_gallery)