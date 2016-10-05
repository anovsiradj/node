/*
	route(r) -> handle request

	di r, validasi url.
	mulai dari file biasa, sampai rewrite url.
	file biasa (suffix *.html -> di __app, dan bower)
*/
var fs = require('fs');
var mime = require('mime');

var fileindex = 'index.html';

module.exports = (_req, _res) => {
	// di node, url-param (contoh: ?a=b&c=d) termasuk dalam request url
	// jadi harus dipisah dengan url-path-nya
	// dengan cara dipisah berdasarkan '?'
	var reqpath = _req.url.split('?')[0];

	// default
	if (reqpath === '/') reqpath += fileindex;
	reqpath = './app' + reqpath;

	// cek filenya dulu (sekaligus, dapatkan info-nya)
	fs.stat(reqpath, (err, stats) => {
		// jika gagal (bisa jadi file tidak ada)
		if (err) return res_404(_res, reqpath);
		// hanya baca file saja. bukan direktory, dsb
		if(!stats.isFile()) return res_403(_res, reqpath);

		// pertama, langsung cek modifikasi file req-header
		var fmodif = _req.headers["if-modified-since"] || null; // formatnya: gmt

		if (fmodif === null) { // oh, ini request pertama.
			res_200(_res, stats, reqpath);
		} else { // oh, ini request ke-n
			if (fmodif === stats.mtime.toGMTString()) { // apakah file tidak berubah?
				res_304(_res, stats);
			} else { // filenya berubah. perbarui
				res_200(_res, stats, reqpath);
			}
		}
	});

};
// ---
function res_200(_res, _stats, _filepath) {
	// file-nya sudah pasti ada (karena sudah di stat), jadi tinggal di-load
	var data = fs.readFileSync(_filepath);
	_res.writeHead(200, {
		'Content-Type': mime.lookup(_filepath),
		"Last-Modified": _stats.mtime.toUTCString(),
		"Content-Length": _stats.size
		// 'Cache-Control': 'public, max-age=1800' // 0.5 jam
	});
	_res.write(data);
	_res.end();
}
// berdasarkan referensi so:22201490 dibawah,
// 304 artinya file tidak berubah.
// jadi tidak perlu respond data.
// cukup 304 saja, nanti browser akan load dari cache.
function res_304(_res, _stats) {
	_res.writeHead(304);
	_res.end();
}
function res_403(_res, _filepath) {
	console.log('403: ' + _filepath);
	_res.writeHead(403, {
		'Content-Type': 'text/plain'
	});
	_res.write('403 - Forbidden');
	_res.end();
}
function res_404(_res, _filepath) {
	console.log('404: ' + _filepath);
	_res.writeHead(404, {
		'Content-Type': 'text/plain'
	});
	_res.write('404 - Not Found');
	_res.end();
}

/*
refference:
http://stackoverflow.com/questions/22201490/node-js-browser-image-caching-with-correct-headers
*/
