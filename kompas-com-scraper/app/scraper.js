var node_request = require('request');
var node_htmlclean = require('htmlclean');
var node_blogger = require('googleapis').blogger('v3');
const node_util = require('util');

function form_submit(form) {
	kompas_validate_url(form.elements.web_target.value);
}

function kompas_validate_url(url) {
	if (spiderweb.stop) return;

	if (url.indexOf('kompas.com/read/') !== -1) {
		kompas_scrape(url);
	}

	if (spiderweb.count > 999) spiderweb.stop = false;
}














