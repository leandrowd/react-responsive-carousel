"use strict";

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

Promise.resolve().then(function () {
  return _interopRequireWildcard(require('./components/Carousel'));
}).then(function (_ref) {
  var Carousel = _ref.default;

  var DemoCarousel = function DemoCarousel() {
    return /*#__PURE__*/_react.default.createElement(Carousel, {
      showArrows: true,
      infiniteLoop: true,
      autoPlay: true,
      emulateTouch: true,
      onClickItem: function onClickItem() {
        var _console;

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return (_console = console).log.apply(_console, ['onClickItem'].concat(args));
      },
      onChange: function onChange() {
        var _console2;

        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        return (_console2 = console).log.apply(_console2, ['onChange'].concat(args));
      },
      onClickThumb: function onClickThumb() {
        var _console3;

        for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          args[_key3] = arguments[_key3];
        }

        return (_console3 = console).log.apply(_console3, ['onClickThumb'].concat(args));
      }
    }, /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("img", {
      src: "assets/1.jpeg"
    }), /*#__PURE__*/_react.default.createElement("p", {
      className: "legend"
    }, "Legend 1")), /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("img", {
      src: "assets/2.jpeg"
    }), /*#__PURE__*/_react.default.createElement("p", {
      className: "legend"
    }, "Legend 2")), /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("img", {
      src: "assets/3.jpeg"
    }), /*#__PURE__*/_react.default.createElement("p", {
      className: "legend"
    }, "Legend 3")), /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("img", {
      src: "assets/4.jpeg"
    }), /*#__PURE__*/_react.default.createElement("p", {
      className: "legend"
    }, "Legend 4")), /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("img", {
      src: "assets/5.jpeg"
    }), /*#__PURE__*/_react.default.createElement("p", {
      className: "legend"
    }, "Legend 5")), /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("img", {
      src: "assets/6.jpeg"
    }), /*#__PURE__*/_react.default.createElement("p", {
      className: "legend"
    }, "Legend 6")));
  };

  _reactDom.default.render( /*#__PURE__*/_react.default.createElement(DemoCarousel, null), document.querySelector('.demo-carousel'));
});