;(function() {
	return;
	var last_elm_width,
		elm = document.getElementById('slider'),
		tgt = document.getElementById('sidebar');

	elm.draggable = true;

	elm.addEventListener('dragstart', function() {
		elm.draggable = false;
	});

	elm.addEventListener('drag', (ev) => {
		// elm.draggable = false;
		// ev.preventDefault();
		// console.log(ev)
		last_elm_width = tgt.clientWidth;
		tgt.style.width = (last_elm_width - ev.offsetX) + 'px';
		// return false;
	});
	// because on ev:drag, last ofstx, return the drop-elm-target width
	elm.addEventListener('dragend', (ev) => {
		// console.log(ev)
		// ev.preventDefault();
		tgt.style.width = last_elm_width + 'px';
		// tgt.style.width = (tgt.clientWidth - ev.offsetX) + 'px';
		// return false;
		elm.draggable = true;
	});

})();

// 201610101138
/*
refference:
https://developer.mozilla.org/en/docs/Web/API/Element/insertAdjacentHTML
*/
/*
var css;
css = '<style>';
css += '#slider {';
	css += 'width: 8px; background-color: #565656;';
	css += 'cursor: col-resize;';
css += '}';
css += '#slider:active {background-color:red;}'; // on-drag/selection state
css += '</style>';
document.head.insertAdjacentHTML('afterbegin', css);
*/
