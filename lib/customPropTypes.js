"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unit = void 0;

var unit = function unit(props, propName, componentName) {
  if (!/(pt|px|em|rem|vw|vh|%)$/.test(props[propName])) {
    return new Error('Invalid prop `' + propName + '` supplied to' + ' `' + componentName + '`. Validation failed. It needs to be a size unit like pt, px, em, rem, vw, %');
  }
};

exports.unit = unit;