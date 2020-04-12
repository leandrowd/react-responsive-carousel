"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = function _default(position, axis) {
  var positionCss = axis === 'horizontal' ? [position, 0, 0] : [0, position, 0];
  var transitionProp = 'translate3d';
  var translatedPosition = '(' + positionCss.join(',') + ')';
  return transitionProp + translatedPosition;
};

exports.default = _default;