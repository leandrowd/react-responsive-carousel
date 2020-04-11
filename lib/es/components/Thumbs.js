function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import klass from '../cssClasses';
import { outerWidth } from '../dimensions';
import CSSTranslate from '../CSSTranslate';
import Swipe from 'react-easy-swipe';

var Thumbs = /*#__PURE__*/function (_Component) {
  _inherits(Thumbs, _Component);

  var _super = _createSuper(Thumbs);

  function Thumbs(_props) {
    var _this;

    _classCallCheck(this, Thumbs);

    _this = _super.call(this, _props);

    _defineProperty(_assertThisInitialized(_this), "setItemsWrapperRef", function (node) {
      _this.itemsWrapperRef = node;
    });

    _defineProperty(_assertThisInitialized(_this), "setItemsListRef", function (node) {
      _this.itemsListRef = node;
    });

    _defineProperty(_assertThisInitialized(_this), "setThumbsRef", function (node, index) {
      if (!_this.thumbsRef) {
        _this.thumbsRef = [];
      }

      _this.thumbsRef[index] = node;
    });

    _defineProperty(_assertThisInitialized(_this), "updateSizes", function () {
      if (!_this.props.children || !_this.itemsWrapperRef || _this.state.images.length === 0) {
        return;
      }

      var total = _this.props.children.length;
      var wrapperSize = _this.itemsWrapperRef.clientWidth;
      var itemSize = _this.props.thumbWidth ? _this.props.thumbWidth : outerWidth(_this.thumbsRef[0]);
      var visibleItems = Math.floor(wrapperSize / itemSize);
      var lastPosition = total - visibleItems;
      var showArrows = visibleItems < total;

      _this.setState(function (_state, props) {
        return {
          itemSize,
          visibleItems,
          firstItem: showArrows ? _this.getFirstItem(props.selectedItem) : 0,
          lastPosition,
          showArrows
        };
      });
    });

    _defineProperty(_assertThisInitialized(_this), "setMountState", function () {
      _this.setState({
        hasMount: true
      });

      _this.updateSizes();
    });

    _defineProperty(_assertThisInitialized(_this), "handleClickItem", function (index, item, e) {
      if (!e.keyCode || e.key === 'Enter') {
        var handler = _this.props.onSelectItem;

        if (typeof handler === 'function') {
          handler(index, item);
        }
      }
    });

    _defineProperty(_assertThisInitialized(_this), "onSwipeStart", function () {
      _this.setState({
        swiping: true
      });
    });

    _defineProperty(_assertThisInitialized(_this), "onSwipeEnd", function () {
      _this.setState({
        swiping: false
      });
    });

    _defineProperty(_assertThisInitialized(_this), "onSwipeMove", function (deltaX) {
      var leftBoundary = 0;
      var currentPosition = -_this.state.firstItem * _this.state.itemSize;
      var lastLeftBoundary = -_this.state.visibleItems * _this.state.itemSize; // prevent user from swiping left out of boundaries

      if (currentPosition === leftBoundary && deltaX > 0) {
        deltaX = 0;
      } // prevent user from swiping right out of boundaries


      if (currentPosition === lastLeftBoundary && deltaX < 0) {
        deltaX = 0;
      }

      var wrapperSize = _this.itemsWrapperRef.clientWidth;
      var position = currentPosition + 100 / (wrapperSize / deltaX) + '%'; // if 3d isn't available we will use left to move

      if (_this.itemsListRef) {
        ['WebkitTransform', 'MozTransform', 'MsTransform', 'OTransform', 'transform', 'msTransform'].forEach(function (prop) {
          _this.itemsListRef.style[prop] = CSSTranslate(position, _this.props.axis);
        });
      }
    });

    _defineProperty(_assertThisInitialized(_this), "slideRight", function (positions) {
      _this.moveTo(_this.state.firstItem - (typeof positions === 'number' ? positions : 1));
    });

    _defineProperty(_assertThisInitialized(_this), "slideLeft", function (positions) {
      _this.moveTo(_this.state.firstItem + (typeof positions === 'number' ? positions : 1));
    });

    _defineProperty(_assertThisInitialized(_this), "moveTo", function (position) {
      // position can't be lower than 0
      position = position < 0 ? 0 : position; // position can't be higher than last postion

      position = position >= _this.lastPosition ? _this.lastPosition : position;

      _this.setState({
        firstItem: position
      });
    });

    _this.state = {
      selectedItem: _props.selectedItem,
      hasMount: false,
      firstItem: 0,
      itemSize: null,
      visibleItems: 0,
      lastPosition: 0,
      showArrows: false,
      images: _this.getImages()
    };
    return _this;
  }

  _createClass(Thumbs, [{
    key: "componentDidMount",
    value: function componentDidMount(nextProps) {
      this.setupThumbs();
    }
  }, {
    key: "UNSAFE_componentWillReceiveProps",
    value: function UNSAFE_componentWillReceiveProps(props, state) {
      if (props.selectedItem !== this.state.selectedItem) {
        this.setState({
          selectedItem: props.selectedItem,
          firstItem: this.getFirstItem(props.selectedItem)
        });
      }

      if (props.children !== this.props.children) {
        this.setState({
          images: this.getImages()
        });
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (this.props.children === prevProps.children) {
        return;
      } // This will capture any size changes for arrow adjustments etc.
      // usually in the same render cycle so we don't see any flickers


      this.updateSizes();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.destroyThumbs();
    }
  }, {
    key: "setupThumbs",
    value: function setupThumbs() {
      // as the widths are calculated, we need to resize
      // the carousel when the window is resized
      window.addEventListener('resize', this.updateSizes); // issue #2 - image loading smaller

      window.addEventListener('DOMContentLoaded', this.updateSizes); // when the component is rendered we need to calculate
      // the container size to adjust the responsive behaviour

      this.updateSizes();
    }
  }, {
    key: "destroyThumbs",
    value: function destroyThumbs() {
      // removing listeners
      window.removeEventListener('resize', this.updateSizes);
      window.removeEventListener('DOMContentLoaded', this.updateSizes);
    }
  }, {
    key: "getImages",
    value: function getImages() {
      var images = Children.map(this.props.children, function (item, index) {
        var img = item; // if the item is not an image, try to find the first image in the item's children.

        if (item.type !== 'img') {
          img = Children.toArray(item.props.children).filter(function (children) {
            return children.type === 'img';
          })[0];
        }

        if (!img || img.length === 0) {
          return null;
        }

        return img;
      });

      if (images.filter(function (image) {
        return image;
      }).length === 0) {
        console.warn("No images found! Can't build the thumb list without images. If you don't need thumbs, set showThumbs={false} in the Carousel. Note that it's not possible to get images rendered inside custom components. More info at https://github.com/leandrowd/react-responsive-carousel/blob/master/TROUBLESHOOTING.md");
        return [];
      }

      return images;
    }
  }, {
    key: "getFirstItem",
    value: function getFirstItem(selectedItem) {
      var firstItem = selectedItem;

      if (selectedItem >= this.state.lastPosition) {
        firstItem = this.state.lastPosition;
      }

      if (selectedItem < this.state.firstItem + this.state.visibleItems) {
        firstItem = this.state.firstItem;
      }

      if (selectedItem < this.state.firstItem) {
        firstItem = selectedItem;
      }

      return firstItem;
    }
  }, {
    key: "renderItems",
    value: function renderItems() {
      var _this2 = this;

      return this.state.images.map(function (img, index) {
        var itemClass = klass.ITEM(false, index === _this2.state.selectedItem && _this2.state.hasMount);
        var thumbProps = {
          key: index,
          ref: function ref(e) {
            return _this2.setThumbsRef(e, index);
          },
          className: itemClass,
          onClick: _this2.handleClickItem.bind(_this2, index, _this2.props.children[index]),
          onKeyDown: _this2.handleClickItem.bind(_this2, index, _this2.props.children[index]),
          'aria-label': "".concat(_this2.props.labels.item, " ").concat(index + 1)
        };

        if (index === 0) {
          img = React.cloneElement(img, {
            onLoad: _this2.setMountState
          });
        }

        return /*#__PURE__*/React.createElement("li", _extends({}, thumbProps, {
          role: "button",
          tabIndex: 0
        }), img);
      });
    }
  }, {
    key: "render",
    value: function render() {
      if (!this.props.children) {
        return null;
      } // show left arrow?


      var hasPrev = this.state.showArrows && this.state.firstItem > 0; // show right arrow

      var hasNext = this.state.showArrows && this.state.firstItem < this.state.lastPosition; // obj to hold the transformations and styles

      var itemListStyles = {};
      var currentPosition = -this.state.firstItem * this.state.itemSize + 'px';
      var transformProp = CSSTranslate(currentPosition, this.props.axis);
      var transitionTime = this.props.transitionTime + 'ms';
      itemListStyles = {
        WebkitTransform: transformProp,
        MozTransform: transformProp,
        MsTransform: transformProp,
        OTransform: transformProp,
        transform: transformProp,
        msTransform: transformProp,
        WebkitTransitionDuration: transitionTime,
        MozTransitionDuration: transitionTime,
        MsTransitionDuration: transitionTime,
        OTransitionDuration: transitionTime,
        transitionDuration: transitionTime,
        msTransitionDuration: transitionTime
      };
      return /*#__PURE__*/React.createElement("div", {
        className: klass.CAROUSEL(false)
      }, /*#__PURE__*/React.createElement("div", {
        className: klass.WRAPPER(false),
        ref: this.setItemsWrapperRef
      }, /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: klass.ARROW_PREV(!hasPrev),
        onClick: this.slideRight,
        "aria-label": this.props.labels.leftArrow
      }), /*#__PURE__*/React.createElement(Swipe, {
        tagName: "ul",
        className: klass.SLIDER(false, this.state.swiping),
        onSwipeLeft: this.slideLeft,
        onSwipeRight: this.slideRight,
        onSwipeMove: this.onSwipeMove,
        onSwipeStart: this.onSwipeStart,
        onSwipeEnd: this.onSwipeEnd,
        style: itemListStyles,
        innerRef: this.setItemsListRef
      }, this.renderItems()), /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: klass.ARROW_NEXT(!hasNext),
        onClick: this.slideLeft,
        "aria-label": this.props.labels.rightArrow
      })));
    }
  }]);

  return Thumbs;
}(Component);

_defineProperty(Thumbs, "displayName", 'Thumbs');

_defineProperty(Thumbs, "propsTypes", {
  children: PropTypes.element.isRequired,
  transitionTime: PropTypes.number,
  selectedItem: PropTypes.number,
  thumbWidth: PropTypes.number,
  labels: PropTypes.shape({
    leftArrow: PropTypes.string,
    rightArrow: PropTypes.string,
    item: PropTypes.string
  })
});

_defineProperty(Thumbs, "defaultProps", {
  selectedItem: 0,
  transitionTime: 350,
  axis: 'horizontal'
});

export default Thumbs;