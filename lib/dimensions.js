"use strict";

module.exports = {
	outerWidth: function outerWidth(el) {
		var width = el.offsetWidth;
		var style = getComputedStyle(el);

		width += parseInt(style.marginLeft) + parseInt(style.marginRight);
		return width;
	}
};