"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.outerWidth = void 0;

var outerWidth = function outerWidth(el) {
  var width = el.offsetWidth;
  var style = getComputedStyle(el);
  width += parseInt(style.marginLeft) + parseInt(style.marginRight);
  return width;
};

exports.outerWidth = outerWidth;