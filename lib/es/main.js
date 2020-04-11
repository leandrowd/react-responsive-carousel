import React from 'react';
import ReactDOM from 'react-dom';
import Carousel from './components/Carousel';

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
  return /*#__PURE__*/React.createElement(Carousel, {
    showArrows: true,
    infiniteLoop: true,
    autoPlay: true,
    emulateTouch: true,
    onClickItem: _onClickItem,
    onChange: _onChange,
    onClickThumb: _onClickThumb
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
    src: "assets/1.jpeg"
  }), /*#__PURE__*/React.createElement("p", {
    className: "legend"
  }, "Legend 1")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
    src: "assets/2.jpeg"
  }), /*#__PURE__*/React.createElement("p", {
    className: "legend"
  }, "Legend 2")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
    src: "assets/3.jpeg"
  }), /*#__PURE__*/React.createElement("p", {
    className: "legend"
  }, "Legend 3")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
    src: "assets/4.jpeg"
  }), /*#__PURE__*/React.createElement("p", {
    className: "legend"
  }, "Legend 4")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
    src: "assets/5.jpeg"
  }), /*#__PURE__*/React.createElement("p", {
    className: "legend"
  }, "Legend 5")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
    src: "assets/6.jpeg"
  }), /*#__PURE__*/React.createElement("p", {
    className: "legend"
  }, "Legend 6")));
};

ReactDOM.render( /*#__PURE__*/React.createElement(DemoCarousel, null), document.querySelector('.demo-carousel'));