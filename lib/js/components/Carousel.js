"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _reactEasySwipe = _interopRequireDefault(require("react-easy-swipe"));

var _cssClasses = _interopRequireDefault(require("../cssClasses"));

var _CSSTranslate = _interopRequireDefault(require("../CSSTranslate"));

var _Thumbs = _interopRequireDefault(require("./Thumbs"));

var _document = _interopRequireDefault(require("../shims/document"));

var _window = _interopRequireDefault(require("../shims/window"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var noop = function noop() {};

var defaultStatusFormatter = function defaultStatusFormatter(current, total) {
  return "".concat(current, " of ").concat(total);
};

var isKeyboardEvent = function isKeyboardEvent(e) {
  return e ? e.hasOwnProperty('key') : false;
};

var Carousel = /*#__PURE__*/function (_React$Component) {
  _inherits(Carousel, _React$Component);

  var _super = _createSuper(Carousel);

  function Carousel(props) {
    var _this;

    _classCallCheck(this, Carousel);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "thumbsRef", void 0);

    _defineProperty(_assertThisInitialized(_this), "carouselWrapperRef", void 0);

    _defineProperty(_assertThisInitialized(_this), "listRef", void 0);

    _defineProperty(_assertThisInitialized(_this), "itemsRef", void 0);

    _defineProperty(_assertThisInitialized(_this), "timer", void 0);

    _defineProperty(_assertThisInitialized(_this), "setThumbsRef", function (node) {
      _this.thumbsRef = node;
    });

    _defineProperty(_assertThisInitialized(_this), "setCarouselWrapperRef", function (node) {
      _this.carouselWrapperRef = node;
    });

    _defineProperty(_assertThisInitialized(_this), "setListRef", function (node) {
      _this.listRef = node;
    });

    _defineProperty(_assertThisInitialized(_this), "setItemsRef", function (node, index) {
      if (!_this.itemsRef) {
        _this.itemsRef = [];
      }

      _this.itemsRef[index] = node;
    });

    _defineProperty(_assertThisInitialized(_this), "autoPlay", function () {
      if (!_this.state.autoPlay || _react.Children.count(_this.props.children) <= 1) {
        return;
      }

      if (_this.timer) clearTimeout(_this.timer);
      _this.timer = setTimeout(function () {
        _this.increment();
      }, _this.props.interval);
    });

    _defineProperty(_assertThisInitialized(_this), "clearAutoPlay", function () {
      if (!_this.state.autoPlay) {
        return;
      }

      if (_this.timer) clearTimeout(_this.timer);
    });

    _defineProperty(_assertThisInitialized(_this), "resetAutoPlay", function () {
      _this.clearAutoPlay();

      _this.autoPlay();
    });

    _defineProperty(_assertThisInitialized(_this), "stopOnHover", function () {
      _this.setState({
        isMouseEntered: true
      }, _this.clearAutoPlay);
    });

    _defineProperty(_assertThisInitialized(_this), "startOnLeave", function () {
      _this.setState({
        isMouseEntered: false
      }, _this.autoPlay);
    });

    _defineProperty(_assertThisInitialized(_this), "isFocusWithinTheCarousel", function () {
      if (!_this.carouselWrapperRef) {
        return false;
      }

      if ((0, _document.default)().activeElement === _this.carouselWrapperRef || _this.carouselWrapperRef.contains((0, _document.default)().activeElement)) {
        return true;
      }

      return false;
    });

    _defineProperty(_assertThisInitialized(_this), "navigateWithKeyboard", function (e) {
      if (!_this.isFocusWithinTheCarousel()) {
        return;
      }

      var axis = _this.props.axis;
      var isHorizontal = axis === 'horizontal';
      var keyNames = {
        ArrowUp: 38,
        ArrowRight: 39,
        ArrowDown: 40,
        ArrowLeft: 37
      };
      var nextKey = isHorizontal ? keyNames.ArrowRight : keyNames.ArrowDown;
      var prevKey = isHorizontal ? keyNames.ArrowLeft : keyNames.ArrowUp;

      if (nextKey === e.keyCode) {
        _this.increment();
      } else if (prevKey === e.keyCode) {
        _this.decrement();
      }
    });

    _defineProperty(_assertThisInitialized(_this), "updateSizes", function () {
      if (!_this.state.initialized || !_this.itemsRef || _this.itemsRef.length === 0) {
        return;
      }

      var isHorizontal = _this.props.axis === 'horizontal';
      var firstItem = _this.itemsRef[0];

      if (!firstItem) {
        return;
      }

      var itemSize = isHorizontal ? firstItem.clientWidth : firstItem.clientHeight;

      _this.setState({
        itemSize: itemSize
      });

      if (_this.thumbsRef) {
        _this.thumbsRef.updateSizes();
      }
    });

    _defineProperty(_assertThisInitialized(_this), "setMountState", function () {
      _this.setState({
        hasMount: true
      });

      _this.updateSizes();
    });

    _defineProperty(_assertThisInitialized(_this), "handleClickItem", function (index, item) {
      if (_react.Children.count(_this.props.children) === 0) {
        return;
      }

      if (_this.state.cancelClick) {
        _this.setState({
          cancelClick: false
        });

        return;
      }

      _this.props.onClickItem(index, item);

      if (index !== _this.state.selectedItem) {
        _this.setState({
          selectedItem: index
        });
      }
    });

    _defineProperty(_assertThisInitialized(_this), "handleOnChange", function (index, item) {
      if (_react.Children.count(_this.props.children) <= 1) {
        return;
      }

      _this.props.onChange(index, item);
    });

    _defineProperty(_assertThisInitialized(_this), "handleClickThumb", function (index, item) {
      _this.props.onClickThumb(index, item);

      _this.selectItem({
        selectedItem: index
      });
    });

    _defineProperty(_assertThisInitialized(_this), "onSwipeStart", function (event) {
      _this.setState({
        swiping: true
      });

      _this.props.onSwipeStart(event);

      _this.clearAutoPlay();
    });

    _defineProperty(_assertThisInitialized(_this), "onSwipeEnd", function (event) {
      _this.setState({
        swiping: false,
        cancelClick: false
      });

      _this.props.onSwipeEnd(event);

      _this.autoPlay();
    });

    _defineProperty(_assertThisInitialized(_this), "onSwipeMove", function (delta, event) {
      _this.props.onSwipeMove(event);

      var isHorizontal = _this.props.axis === 'horizontal';

      var childrenLength = _react.Children.count(_this.props.children);

      var initialBoundry = 0;

      var currentPosition = _this.getPosition(_this.state.selectedItem);

      var finalBoundry = _this.props.infiniteLoop ? _this.getPosition(childrenLength - 1) - 100 : _this.getPosition(childrenLength - 1);
      var axisDelta = isHorizontal ? delta.x : delta.y;
      var handledDelta = axisDelta; // prevent user from swiping left out of boundaries

      if (currentPosition === initialBoundry && axisDelta > 0) {
        handledDelta = 0;
      } // prevent user from swiping right out of boundaries


      if (currentPosition === finalBoundry && axisDelta < 0) {
        handledDelta = 0;
      }

      var position = currentPosition + 100 / (_this.state.itemSize / handledDelta);

      var hasMoved = Math.abs(axisDelta) > _this.props.swipeScrollTolerance;

      if (_this.props.infiniteLoop && hasMoved) {
        // When allowing infinite loop, if we slide left from position 0 we reveal the cloned last slide that appears before it
        // if we slide even further we need to jump to other side so it can continue - and vice versa for the last slide
        if (_this.state.selectedItem === 0 && position > -100) {
          position -= childrenLength * 100;
        } else if (_this.state.selectedItem === childrenLength - 1 && position < -childrenLength * 100) {
          position += childrenLength * 100;
        }
      }

      if (!_this.props.preventMovementUntilSwipeScrollTolerance || hasMoved) {
        _this.setPosition(position);
      } // allows scroll if the swipe was within the tolerance


      if (hasMoved && !_this.state.cancelClick) {
        _this.setState({
          cancelClick: true
        });
      }

      return hasMoved;
    });

    _defineProperty(_assertThisInitialized(_this), "setPosition", function (position, forceReflow) {
      var list = _reactDom.default.findDOMNode(_this.listRef);

      if (list instanceof HTMLElement) {
        ['WebkitTransform', 'MozTransform', 'MsTransform', 'OTransform', 'transform', 'msTransform'].forEach(function (prop) {
          list.style[prop] = (0, _CSSTranslate.default)(position, '%', _this.props.axis);
        });

        if (forceReflow) {
          list.offsetLeft;
        }
      }
    });

    _defineProperty(_assertThisInitialized(_this), "resetPosition", function () {
      var currentPosition = _this.getPosition(_this.state.selectedItem);

      _this.setPosition(currentPosition);
    });

    _defineProperty(_assertThisInitialized(_this), "decrement", function () {
      var positions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var fromSwipe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      _this.moveTo(_this.state.selectedItem - (typeof positions === 'number' ? positions : 1), fromSwipe);
    });

    _defineProperty(_assertThisInitialized(_this), "increment", function () {
      var positions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var fromSwipe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      _this.moveTo(_this.state.selectedItem + (typeof positions === 'number' ? positions : 1), fromSwipe);
    });

    _defineProperty(_assertThisInitialized(_this), "moveTo", function (position, fromSwipe) {
      if (typeof position !== 'number') {
        return;
      }

      var lastPosition = _react.Children.count(_this.props.children) - 1;
      var needClonedSlide = _this.props.infiniteLoop && !fromSwipe && (position < 0 || position > lastPosition);
      var oldPosition = position;

      if (position < 0) {
        position = _this.props.infiniteLoop ? lastPosition : 0;
      }

      if (position > lastPosition) {
        position = _this.props.infiniteLoop ? 0 : lastPosition;
      }

      if (needClonedSlide) {
        // set swiping true would disable transition time, then we set slider to cloned position and force a reflow
        // this is only needed for non-swiping situation
        _this.setState({
          swiping: true
        }, function () {
          if (oldPosition < 0) {
            if (_this.props.centerMode && _this.props.centerSlidePercentage && _this.props.axis === 'horizontal') {
              _this.setPosition(-(lastPosition + 2) * _this.props.centerSlidePercentage - (100 - _this.props.centerSlidePercentage) / 2, true);
            } else {
              _this.setPosition(-(lastPosition + 2) * 100, true);
            }
          } else if (oldPosition > lastPosition) {
            _this.setPosition(0, true);
          }

          _this.selectItem({
            selectedItem: position,
            swiping: false
          });
        });
      } else {
        _this.selectItem({
          // if it's not a slider, we don't need to set position here
          selectedItem: position
        });
      } // don't reset auto play when stop on hover is enabled, doing so will trigger a call to auto play more than once
      // and will result in the interval function not being cleared correctly.


      if (_this.state.autoPlay && _this.state.isMouseEntered === false) {
        _this.resetAutoPlay();
      }
    });

    _defineProperty(_assertThisInitialized(_this), "onClickNext", function () {
      _this.increment(1, false);
    });

    _defineProperty(_assertThisInitialized(_this), "onClickPrev", function () {
      _this.decrement(1, false);
    });

    _defineProperty(_assertThisInitialized(_this), "onSwipeForward", function () {
      _this.increment(1, true);
    });

    _defineProperty(_assertThisInitialized(_this), "onSwipeBackwards", function () {
      _this.decrement(1, true);
    });

    _defineProperty(_assertThisInitialized(_this), "changeItem", function (newIndex) {
      return function (e) {
        if (!isKeyboardEvent(e) || e.key === 'Enter') {
          _this.selectItem({
            selectedItem: newIndex
          });
        }
      };
    });

    _defineProperty(_assertThisInitialized(_this), "selectItem", function (state, cb) {
      _this.setState(state, cb);

      _this.handleOnChange(state.selectedItem, _react.Children.toArray(_this.props.children)[state.selectedItem]);
    });

    _defineProperty(_assertThisInitialized(_this), "getInitialImage", function () {
      var selectedItem = _this.props.selectedItem;
      var item = _this.itemsRef && _this.itemsRef[selectedItem];
      var images = item && item.getElementsByTagName('img') || [];
      return images[0];
    });

    _defineProperty(_assertThisInitialized(_this), "getVariableItemHeight", function (position) {
      var item = _this.itemsRef && _this.itemsRef[position];

      if (_this.state.hasMount && item && item.children.length) {
        var slideImages = item.children[0].getElementsByTagName('img') || [];

        if (slideImages.length > 0) {
          var image = slideImages[0];

          if (!image.complete) {
            // if the image is still loading, the size won't be available so we trigger a new render after it's done
            var onImageLoad = function onImageLoad() {
              _this.forceUpdate();

              image.removeEventListener('load', onImageLoad);
            };

            image.addEventListener('load', onImageLoad);
          }
        } // try to get img first, if img not there find first display tag


        var displayItem = slideImages[0] || item.children[0];
        var height = displayItem.clientHeight;
        return height > 0 ? height : null;
      }

      return null;
    });

    _this.state = {
      initialized: false,
      selectedItem: props.selectedItem,
      hasMount: false,
      isMouseEntered: false,
      autoPlay: props.autoPlay,
      swiping: false,
      cancelClick: false,
      itemSize: 1
    };
    return _this;
  }

  _createClass(Carousel, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (!this.props.children) {
        return;
      }

      this.setupCarousel();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      if (!prevProps.children && this.props.children && !this.state.initialized) {
        this.setupCarousel();
      }

      if (!prevProps.autoFocus && this.props.autoFocus) {
        this.forceFocus();
      }

      if (prevState.swiping && !this.state.swiping) {
        // We stopped swiping, ensure we are heading to the new/current slide and not stuck
        this.resetPosition();
      }

      if (prevProps.selectedItem !== this.props.selectedItem || prevProps.centerMode !== this.props.centerMode) {
        this.updateSizes();
        this.moveTo(this.props.selectedItem);
      }

      if (prevProps.autoPlay !== this.props.autoPlay) {
        if (this.props.autoPlay) {
          this.setupAutoPlay();
        } else {
          this.destroyAutoPlay();
        }

        this.setState({
          autoPlay: this.props.autoPlay
        });
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.destroyCarousel();
    }
  }, {
    key: "setupCarousel",
    value: function setupCarousel() {
      var _this2 = this;

      this.bindEvents();

      if (this.state.autoPlay && _react.Children.count(this.props.children) > 1) {
        this.setupAutoPlay();
      }

      if (this.props.autoFocus) {
        this.forceFocus();
      }

      this.setState({
        initialized: true
      }, function () {
        var initialImage = _this2.getInitialImage();

        if (initialImage && !initialImage.complete) {
          // if it's a carousel of images, we set the mount state after the first image is loaded
          initialImage.addEventListener('load', _this2.setMountState);
        } else {
          _this2.setMountState();
        }
      });
    }
  }, {
    key: "destroyCarousel",
    value: function destroyCarousel() {
      if (this.state.initialized) {
        this.unbindEvents();
        this.destroyAutoPlay();
      }
    }
  }, {
    key: "setupAutoPlay",
    value: function setupAutoPlay() {
      this.autoPlay();
      var carouselWrapper = this.carouselWrapperRef;

      if (this.props.stopOnHover && carouselWrapper) {
        carouselWrapper.addEventListener('mouseenter', this.stopOnHover);
        carouselWrapper.addEventListener('mouseleave', this.startOnLeave);
      }
    }
  }, {
    key: "destroyAutoPlay",
    value: function destroyAutoPlay() {
      this.clearAutoPlay();
      var carouselWrapper = this.carouselWrapperRef;

      if (this.props.stopOnHover && carouselWrapper) {
        carouselWrapper.removeEventListener('mouseenter', this.stopOnHover);
        carouselWrapper.removeEventListener('mouseleave', this.startOnLeave);
      }
    }
  }, {
    key: "bindEvents",
    value: function bindEvents() {
      // as the widths are calculated, we need to resize
      // the carousel when the window is resized
      (0, _window.default)().addEventListener('resize', this.updateSizes); // issue #2 - image loading smaller

      (0, _window.default)().addEventListener('DOMContentLoaded', this.updateSizes);

      if (this.props.useKeyboardArrows) {
        (0, _document.default)().addEventListener('keydown', this.navigateWithKeyboard);
      }
    }
  }, {
    key: "unbindEvents",
    value: function unbindEvents() {
      // removing listeners
      (0, _window.default)().removeEventListener('resize', this.updateSizes);
      (0, _window.default)().removeEventListener('DOMContentLoaded', this.updateSizes);
      var initialImage = this.getInitialImage();

      if (initialImage) {
        initialImage.removeEventListener('load', this.setMountState);
      }

      if (this.props.useKeyboardArrows) {
        (0, _document.default)().removeEventListener('keydown', this.navigateWithKeyboard);
      }
    }
  }, {
    key: "forceFocus",
    value: function forceFocus() {
      var _this$carouselWrapper;

      (_this$carouselWrapper = this.carouselWrapperRef) === null || _this$carouselWrapper === void 0 ? void 0 : _this$carouselWrapper.focus();
    }
  }, {
    key: "getPosition",
    value: function getPosition(index) {
      if (this.props.infiniteLoop) {
        // index has to be added by 1 because of the first cloned slide
        ++index;
      }

      if (index === 0) {
        return 0;
      }

      var childrenLength = _react.Children.count(this.props.children);

      if (this.props.centerMode && this.props.axis === 'horizontal') {
        var currentPosition = -index * this.props.centerSlidePercentage;
        var lastPosition = childrenLength - 1;

        if (index && (index !== lastPosition || this.props.infiniteLoop)) {
          currentPosition += (100 - this.props.centerSlidePercentage) / 2;
        } else if (index === lastPosition) {
          currentPosition += 100 - this.props.centerSlidePercentage;
        }

        return currentPosition;
      }

      return -index * 100;
    }
  }, {
    key: "renderItems",
    value: function renderItems(isClone) {
      var _this3 = this;

      if (!this.props.children) {
        return [];
      }

      return _react.Children.map(this.props.children, function (item, index) {
        var slideProps = {
          ref: function ref(e) {
            return _this3.setItemsRef(e, index);
          },
          key: 'itemKey' + index + (isClone ? 'clone' : ''),
          className: _cssClasses.default.ITEM(true, index === _this3.state.selectedItem),
          onClick: _this3.handleClickItem.bind(_this3, index, item)
        };
        var extraProps = {};

        if (_this3.props.centerMode && _this3.props.axis === 'horizontal') {
          extraProps.style = {
            minWidth: _this3.props.centerSlidePercentage + '%'
          };
        }

        return /*#__PURE__*/_react.default.createElement("li", _extends({}, slideProps, extraProps), _this3.props.renderItem(item, {
          isSelected: index === _this3.state.selectedItem
        }));
      });
    }
  }, {
    key: "renderControls",
    value: function renderControls() {
      var _this4 = this;

      var _this$props = this.props,
          showIndicators = _this$props.showIndicators,
          labels = _this$props.labels,
          renderIndicator = _this$props.renderIndicator,
          children = _this$props.children;

      if (!showIndicators) {
        return null;
      }

      return /*#__PURE__*/_react.default.createElement("ul", {
        className: "control-dots"
      }, _react.Children.map(children, function (_, index) {
        return renderIndicator && renderIndicator(_this4.changeItem(index), index === _this4.state.selectedItem, index, labels.item);
      }));
    }
  }, {
    key: "renderStatus",
    value: function renderStatus() {
      if (!this.props.showStatus) {
        return null;
      }

      return /*#__PURE__*/_react.default.createElement("p", {
        className: "carousel-status"
      }, this.props.statusFormatter(this.state.selectedItem + 1, _react.Children.count(this.props.children)));
    }
  }, {
    key: "renderThumbs",
    value: function renderThumbs() {
      if (!this.props.showThumbs || !this.props.children || _react.Children.count(this.props.children) === 0) {
        return null;
      }

      return /*#__PURE__*/_react.default.createElement(_Thumbs.default, {
        ref: this.setThumbsRef,
        onSelectItem: this.handleClickThumb,
        selectedItem: this.state.selectedItem,
        transitionTime: this.props.transitionTime,
        thumbWidth: this.props.thumbWidth,
        labels: this.props.labels
      }, this.props.renderThumbs(this.props.children));
    }
  }, {
    key: "render",
    value: function render() {
      var _this5 = this;

      if (!this.props.children || _react.Children.count(this.props.children) === 0) {
        return null;
      }

      var isHorizontal = this.props.axis === 'horizontal';
      var canShowArrows = this.props.showArrows && _react.Children.count(this.props.children) > 1; // show left arrow?

      var hasPrev = canShowArrows && (this.state.selectedItem > 0 || this.props.infiniteLoop) || false; // show right arrow

      var hasNext = canShowArrows && (this.state.selectedItem < _react.Children.count(this.props.children) - 1 || this.props.infiniteLoop) || false; // obj to hold the transformations and styles

      var itemListStyles = {};
      var currentPosition = this.getPosition(this.state.selectedItem); // if 3d is available, let's take advantage of the performance of transform

      var transformProp = (0, _CSSTranslate.default)(currentPosition, '%', this.props.axis);
      var transitionTime = this.props.transitionTime + 'ms';
      itemListStyles = {
        WebkitTransform: transformProp,
        MozTransform: transformProp,
        MsTransform: transformProp,
        OTransform: transformProp,
        transform: transformProp,
        msTransform: transformProp
      };

      if (!this.state.swiping) {
        itemListStyles = _objectSpread(_objectSpread({}, itemListStyles), {}, {
          WebkitTransitionDuration: transitionTime,
          MozTransitionDuration: transitionTime,
          MsTransitionDuration: transitionTime,
          OTransitionDuration: transitionTime,
          transitionDuration: transitionTime,
          msTransitionDuration: transitionTime
        });
      }

      var itemsClone = this.renderItems(true);
      var firstClone = itemsClone.shift();
      var lastClone = itemsClone.pop();
      var swiperProps = {
        className: _cssClasses.default.SLIDER(true, this.state.swiping),
        onSwipeMove: this.onSwipeMove,
        onSwipeStart: this.onSwipeStart,
        onSwipeEnd: this.onSwipeEnd,
        style: itemListStyles,
        tolerance: this.props.swipeScrollTolerance
      };
      var containerStyles = {};

      if (isHorizontal) {
        swiperProps.onSwipeLeft = this.onSwipeForward;
        swiperProps.onSwipeRight = this.onSwipeBackwards;

        if (this.props.dynamicHeight) {
          var itemHeight = this.getVariableItemHeight(this.state.selectedItem);
          swiperProps.style.height = itemHeight || 'auto';
          containerStyles.height = itemHeight || 'auto';
        }
      } else {
        swiperProps.onSwipeUp = this.props.verticalSwipe === 'natural' ? this.onSwipeBackwards : this.onSwipeForward;
        swiperProps.onSwipeDown = this.props.verticalSwipe === 'natural' ? this.onSwipeForward : this.onSwipeBackwards;
        swiperProps.style.height = this.state.itemSize;
        containerStyles.height = this.state.itemSize;
      }

      return /*#__PURE__*/_react.default.createElement("div", {
        className: _cssClasses.default.ROOT(this.props.className),
        ref: this.setCarouselWrapperRef,
        tabIndex: 0
      }, /*#__PURE__*/_react.default.createElement("div", {
        className: _cssClasses.default.CAROUSEL(true),
        style: {
          width: this.props.width
        }
      }, this.props.renderArrowPrev(this.onClickPrev, hasPrev, this.props.labels.leftArrow), /*#__PURE__*/_react.default.createElement("div", {
        className: _cssClasses.default.WRAPPER(true, this.props.axis),
        style: containerStyles
      }, this.props.swipeable ? /*#__PURE__*/_react.default.createElement(_reactEasySwipe.default, _extends({
        tagName: "ul",
        innerRef: this.setListRef
      }, swiperProps, {
        allowMouseEvents: this.props.emulateTouch
      }), this.props.infiniteLoop && lastClone, this.renderItems(), this.props.infiniteLoop && firstClone) : /*#__PURE__*/_react.default.createElement("ul", {
        className: _cssClasses.default.SLIDER(true, this.state.swiping),
        ref: function ref(node) {
          return _this5.setListRef(node);
        },
        style: itemListStyles
      }, this.props.infiniteLoop && lastClone, this.renderItems(), this.props.infiniteLoop && firstClone)), this.props.renderArrowNext(this.onClickNext, hasNext, this.props.labels.rightArrow), this.renderControls(), this.renderStatus()), this.renderThumbs());
    }
  }]);

  return Carousel;
}(_react.default.Component);

exports.default = Carousel;

_defineProperty(Carousel, "displayName", 'Carousel');

_defineProperty(Carousel, "defaultProps", {
  axis: 'horizontal',
  centerSlidePercentage: 80,
  interval: 3000,
  labels: {
    leftArrow: 'previous slide / item',
    rightArrow: 'next slide / item',
    item: 'slide item'
  },
  onClickItem: noop,
  onClickThumb: noop,
  onChange: noop,
  onSwipeStart: function onSwipeStart() {},
  onSwipeEnd: function onSwipeEnd() {},
  onSwipeMove: function onSwipeMove() {},
  preventMovementUntilSwipeScrollTolerance: false,
  renderArrowPrev: function renderArrowPrev(onClickHandler, hasPrev, label) {
    return /*#__PURE__*/_react.default.createElement("button", {
      type: "button",
      "aria-label": label,
      className: _cssClasses.default.ARROW_PREV(!hasPrev),
      onClick: onClickHandler
    });
  },
  renderArrowNext: function renderArrowNext(onClickHandler, hasNext, label) {
    return /*#__PURE__*/_react.default.createElement("button", {
      type: "button",
      "aria-label": label,
      className: _cssClasses.default.ARROW_NEXT(!hasNext),
      onClick: onClickHandler
    });
  },
  renderIndicator: function renderIndicator(onClickHandler, isSelected, index, label) {
    return /*#__PURE__*/_react.default.createElement("li", {
      className: _cssClasses.default.DOT(isSelected),
      onClick: onClickHandler,
      onKeyDown: onClickHandler,
      value: index,
      key: index,
      role: "button",
      tabIndex: 0,
      "aria-label": "".concat(label, " ").concat(index + 1)
    });
  },
  renderItem: function renderItem(item) {
    return item;
  },
  renderThumbs: function renderThumbs(children) {
    var images = _react.Children.map(children, function (item) {
      var img = item; // if the item is not an image, try to find the first image in the item's children.

      if (item.type !== 'img') {
        img = _react.Children.toArray(item.props.children).find(function (children) {
          return children.type === 'img';
        });
      }

      if (!img) {
        return undefined;
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
  },
  statusFormatter: defaultStatusFormatter,
  selectedItem: 0,
  showArrows: true,
  showIndicators: true,
  showStatus: true,
  showThumbs: true,
  stopOnHover: true,
  swipeScrollTolerance: 5,
  swipeable: true,
  transitionTime: 350,
  verticalSwipe: 'standard',
  width: '100%'
});