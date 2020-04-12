"use strict";

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _Carousel = _interopRequireDefault(require("./components/Carousel"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _onChange() {
  console.log('onChange', arguments);
}

function _onClickItem() {
  console.log('onClickItem', arguments);
}

function _onClickThumb() {
  console.log('onClickThumb', arguments);
} // Begin DemoSliderControls


var DemoCarousel = function DemoCarousel() {
  return /*#__PURE__*/_react.default.createElement(_Carousel.default, {
    showArrows: true,
    infiniteLoop: true,
    autoPlay: true,
    emulateTouch: true,
    onClickItem: _onClickItem,
    onChange: _onChange,
    onClickThumb: _onClickThumb
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