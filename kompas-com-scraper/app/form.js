var node_request = require('request');
var node_htmlclean = require('htmlclean');
var node_blogger = require('googleapis').blogger('v3');
const node_util = require('util');

// semua links (a) dari hasil scraping
var data_links_scraped = [];
var spider_count = 0;
var spider_stop = false;

function form_submit(form) {
	validate_target(form.elements.web_target.value);
}

function validate_target(url) {
	if (spider_stop) return;

	if (url.indexOf('kompas.com/') !== -1) {
		load_kompas(url);
	};

	if (spider_count > 999) spider_stop = false;
	return;
}

function load_kompas(url) {
	if (spider_stop) {
		save_link();
		return;
	};
	// kalau sudah di scrape, batal
	if (data_links_scraped.indexOf() !== -1) return;
	data_links_scraped.push(url);

	node_request(url, function (err, res, ctn) {
		if (err) { alert(err); return; }

		if (res.statusCode == 200) {
			var iframe = make_iframe();
			write_iframe(iframe, ctn);

			// return;
			(function fn_sync() {
				if (iframe.contentDocument.readyState === 'complete') { // http://stackoverflow.com/a/6184661/3036312

					// just get url
					$(iframe.contentDocument.links).each(function() {
						validate_target(this.href);
					});

					if (url.indexOf('kompas.com/read/') !== -1) {
						spider_count++;
						console.log('Scraping:', url);
						// scrape, parse, filter
						setTimeout(function() {
							kompas_extract(iframe, url);
						}, 1000);
					}
				} else setTimeout(fn_sync, 0);
			})();
		}

	});
}

function get_links(iframe) {
	$(iframe.contentDocument.links).each(function() {
		var href = this.href;

		if (data_links.indexOf(href) === -1) {
			data_links.push(href);
		} else {
			this.remove();
		}
	});
}

function kompas_extract(iframe, url) {
	var data = { content: '', meta: {}, labels: ['kompas.com'] };
	var ctn = iframe.contentDocument.getElementById('leftside');
	var $ctn_top = $('.kcm-read-top:first', ctn);
	var $ctn_body = $('.kcm-read-body:first', ctn);

	// META
	$('meta', iframe.contentDocument.head).each(function() {
		var attr, val = $(this).prop('content').trim();

		if ($(this).attr('name')) attr = $(this).attr('name');
		if ($(this).attr('property')) attr = $(this).attr('property');

		if (attr && /^(content|og|article)/.test(attr) && val) {
			data.meta[attr] = val;
		}
	});

	// PUBLISHED
	data.published = (new Date(data.meta.content_PublishedDate)).toISOString();

	// TITLE
	data.title = (function(ttl) {
		return ttl.substring(0, ttl.lastIndexOf(' - ')).trim();
	})(iframe.contentDocument.title);

	// LABELS
	$ctn_top.find('[class*=breadcrumb]:first').each(function() {
		// != LI > A
		$(this).find('li a').each(function() {
			data.labels.push($(this).text());
		});
	});

	// CONTENT: IMAGE
	$ctn_top.find('[class*=photo]:first').each(function() {
		rem_basic_dom(this);
		$(this).find('img').each(function() {
			$(this).addClass('scrape-content-img img-thumbnail img-fluid').wrap('<div></div>');
		});
		data.content += node_htmlclean($(this).html()) + '<br/>';
	});

	// CONTENT: CLEAN-TABLE
	$ctn_body.find('table:last').each(function() {
		$(this).find('tr').each(function() {
			var t = $(this).text().trim();
			if (t === '' || t.charAt(t.length - 1) === ':') this.remove(); // http://stackoverflow.com/a/3884656/3036312
		});

		if ($(this).text().trim() === '') this.remove();
	});
	$ctn_body.find('[class*=span]:last [class*=read]:first').each(function() {
		rem_basic_dom(this);
		data.content += node_htmlclean($(this).html());
	});

	// console.log(data);
	kompas_finishing(data, iframe, url);
}

function kompas_finishing(data, iframe, url) {
	iframe.remove();

	if (!data.content && !data.title) {
		console.log('Canceled. Data Missing For:', url);
		return;
	}

	// kasih tahu kalau dari kompas, tapi jangan mencolok
	data.content += '<br/><div class="scrape-content-foot text-muted">Via: KurirNews, Oleh: <a href="' + url + '" target="_blank">KOMPAS.COM</a></div>';

	// console.log(data);
	// make_textarea().value = data.content;
	// write_iframe(make_iframe(), data.content);
	if (data.meta) delete data.meta;

	post_to_kurirnews(data);
}

function rem_basic_dom(elm) {
	$(elm).find('script, style, link').remove();
	$(elm).find('*').each(function() {
		// hapus empty div,span
		if (/(div|span)/.test(this.tagName.toLowerCase()) && $(this).text().trim() === '') {
			this.remove();
		} else if (/(share|ads)/.test(this.className)) {
			this.remove();
		}
	}).removeAttr('class');
}

// genrate iframe, untuk per-scrape
function make_iframe() {
	var iframe = document.createElement('iframe');
	iframe.sandbox = "allow-same-origin";
	iframe.className = 'w-100p resize-height';
	document.body.appendChild(iframe);
	return iframe;
}
function write_iframe(iframe, ctn) {
	iframe.contentDocument.open();
	iframe.contentDocument.write(ctn);
	iframe.contentDocument.close();
	// reff: http://stackoverflow.com/a/10433550/3036312
}
function make_textarea() {
	var ta = document.createElement('textarea');
	ta.className = 'w-100p resize-height';
	document.body.appendChild(ta);
	return ta;
}

function save_link() {
	var name = './' + (new Date()).getTime() + '.txt';
	node_fs.writeFile(name, data_links_scraped.join('\n'));
}
