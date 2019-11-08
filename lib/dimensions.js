"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var outerWidth = exports.outerWidth = function outerWidth(el) {
	var width = el.offsetWidth;
	var style = getComputedStyle(el);

	width += parseInt(style.marginLeft) + parseInt(style.marginRight);
	return width;
};