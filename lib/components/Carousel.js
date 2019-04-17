'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _cssClasses = require('../cssClasses');

var _cssClasses2 = _interopRequireDefault(_cssClasses);

var _CSSTranslate = require('../CSSTranslate');

var _CSSTranslate2 = _interopRequireDefault(_CSSTranslate);

var _reactEasySwipe = require('react-easy-swipe');

var _reactEasySwipe2 = _interopRequireDefault(_reactEasySwipe);

var _Thumbs = require('./Thumbs');

var _Thumbs2 = _interopRequireDefault(_Thumbs);

var _customPropTypes = require('../customPropTypes');

var customPropTypes = _interopRequireWildcard(_customPropTypes);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var noop = function noop() {};

var defaultStatusFormatter = function defaultStatusFormatter(current, total) {
    return current + ' of ' + total;
};

var Carousel = function (_Component) {
    _inherits(Carousel, _Component);

    function Carousel(props) {
        _classCallCheck(this, Carousel);

        var _this = _possibleConstructorReturn(this, (Carousel.__proto__ || Object.getPrototypeOf(Carousel)).call(this, props));

        _initialiseProps.call(_this);

        _this.state = {
            initialized: false,
            selectedItem: props.selectedItem,
            hasMount: false,
            isMouseEntered: false,
            autoPlay: props.autoPlay
        };
        return _this;
    }

    _createClass(Carousel, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            if (!this.props.children) {
                return;
            }

            this.setupCarousel();
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            var _this2 = this;

            if (nextProps.selectedItem !== this.state.selectedItem) {
                this.updateSizes();
                this.moveTo(nextProps.selectedItem);
            }

            if (nextProps.autoPlay !== this.state.autoPlay) {
                this.setState({
                    autoPlay: nextProps.autoPlay
                }, function () {
                    if (_this2.state.autoPlay) {
                        _this2.setupAutoPlay();
                    } else {
                        _this2.destroyAutoPlay();
                    }
                });
            }
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate(prevProps, prevState) {
            if (!prevProps.children && this.props.children && !this.state.initialized) {
                this.setupCarousel();
            }
            if (prevState.swiping && !this.state.swiping) {
                // We stopped swiping, ensure we are heading to the new/current slide and not stuck
                this.resetPosition();
            }
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.destroyCarousel();
        }
    }, {
        key: 'setupCarousel',
        value: function setupCarousel() {
            this.bindEvents();

            if (this.state.autoPlay && _react.Children.count(this.props.children) > 1) {
                this.setupAutoPlay();
            }

            this.setState({
                initialized: true
            });

            var initialImage = this.getInitialImage();
            if (initialImage) {
                // if it's a carousel of images, we set the mount state after the first image is loaded
                initialImage.addEventListener('load', this.setMountState);
            } else {
                this.setMountState();
            }
        }
    }, {
        key: 'destroyCarousel',
        value: function destroyCarousel() {
            if (this.state.initialized) {
                this.unbindEvents();
                this.destroyAutoPlay();
            }
        }
    }, {
        key: 'setupAutoPlay',
        value: function setupAutoPlay() {
            this.autoPlay();
            var carouselWrapper = this.carouselWrapperRef;

            if (this.props.stopOnHover && carouselWrapper) {
                carouselWrapper.addEventListener('mouseenter', this.stopOnHover);
                carouselWrapper.addEventListener('mouseleave', this.startOnLeave);
            }
        }
    }, {
        key: 'destroyAutoPlay',
        value: function destroyAutoPlay() {
            this.clearAutoPlay();
            var carouselWrapper = this.carouselWrapperRef;

            if (this.props.stopOnHover && carouselWrapper) {
                carouselWrapper.removeEventListener('mouseenter', this.stopOnHover);
                carouselWrapper.removeEventListener('mouseleave', this.startOnLeave);
            }
        }
    }, {
        key: 'bindEvents',
        value: function bindEvents() {
            // as the widths are calculated, we need to resize
            // the carousel when the window is resized
            window.addEventListener("resize", this.updateSizes);
            // issue #2 - image loading smaller
            window.addEventListener("DOMContentLoaded", this.updateSizes);

            if (this.props.useKeyboardArrows) {
                document.addEventListener("keydown", this.navigateWithKeyboard);
            }
        }
    }, {
        key: 'unbindEvents',
        value: function unbindEvents() {
            // removing listeners
            window.removeEventListener("resize", this.updateSizes);
            window.removeEventListener("DOMContentLoaded", this.updateSizes);

            var initialImage = this.getInitialImage();
            if (initialImage) {
                initialImage.removeEventListener("load", this.setMountState);
            }

            if (this.props.useKeyboardArrows) {
                document.removeEventListener("keydown", this.navigateWithKeyboard);
            }
        }
    }, {
        key: 'getPosition',
        value: function getPosition(index) {
            if (this.props.infiniteLoop) {
                // index has to be added by 1 because of the first cloned slide
                ++index;
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
        key: 'renderItems',
        value: function renderItems(isClone) {
            var _this3 = this;

            return _react.Children.map(this.props.children, function (item, index) {
                var slideProps = {
                    ref: function ref(e) {
                        return _this3.setItemsRef(e, index);
                    },
                    key: 'itemKey' + index + (isClone ? 'clone' : ''),
                    className: _cssClasses2.default.ITEM(true, index === _this3.state.selectedItem),
                    onClick: _this3.handleClickItem.bind(_this3, index, item)
                };

                if (_this3.props.centerMode && _this3.props.axis === 'horizontal') {
                    slideProps.style = {
                        minWidth: _this3.props.centerSlidePercentage + '%'
                    };
                }

                return _react2.default.createElement(
                    'li',
                    slideProps,
                    item
                );
            });
        }
    }, {
        key: 'renderControls',
        value: function renderControls() {
            var _this4 = this;

            if (!this.props.showIndicators) {
                return null;
            }

            return _react2.default.createElement(
                'ul',
                { className: 'control-dots' },
                _react.Children.map(this.props.children, function (item, index) {
                    return _react2.default.createElement('li', { className: _cssClasses2.default.DOT(index === _this4.state.selectedItem), onClick: _this4.changeItem, onKeyDown: _this4.changeItem, value: index, key: index, role: 'button', tabIndex: 0 });
                })
            );
        }
    }, {
        key: 'renderStatus',
        value: function renderStatus() {
            if (!this.props.showStatus) {
                return null;
            }

            return _react2.default.createElement(
                'p',
                { className: 'carousel-status' },
                this.props.statusFormatter(this.state.selectedItem + 1, _react.Children.count(this.props.children))
            );
        }
    }, {
        key: 'renderThumbs',
        value: function renderThumbs() {
            if (!this.props.showThumbs || _react.Children.count(this.props.children) === 0) {
                return null;
            }

            return _react2.default.createElement(
                _Thumbs2.default,
                { ref: this.setThumbsRef, onSelectItem: this.handleClickThumb, selectedItem: this.state.selectedItem, transitionTime: this.props.transitionTime, thumbWidth: this.props.thumbWidth },
                this.props.children
            );
        }
    }, {
        key: 'render',
        value: function render() {
            if (!this.props.children || _react.Children.count(this.props.children) === 0) {
                return null;
            }

            var isHorizontal = this.props.axis === 'horizontal';

            var canShowArrows = this.props.showArrows && _react.Children.count(this.props.children) > 1;

            // show left arrow?
            var hasPrev = canShowArrows && (this.state.selectedItem > 0 || this.props.infiniteLoop);
            // show right arrow
            var hasNext = canShowArrows && (this.state.selectedItem < _react.Children.count(this.props.children) - 1 || this.props.infiniteLoop);
            // obj to hold the transformations and styles
            var itemListStyles = {};

            var currentPosition = this.getPosition(this.state.selectedItem);

            // if 3d is available, let's take advantage of the performance of transform
            var transformProp = (0, _CSSTranslate2.default)(currentPosition + '%', this.props.axis);

            var transitionTime = this.props.transitionTime + 'ms';

            itemListStyles = {
                'WebkitTransform': transformProp,
                'MozTransform': transformProp,
                'MsTransform': transformProp,
                'OTransform': transformProp,
                'transform': transformProp,
                'msTransform': transformProp
            };

            if (!this.state.swiping) {
                itemListStyles = _extends({}, itemListStyles, {
                    'WebkitTransitionDuration': transitionTime,
                    'MozTransitionDuration': transitionTime,
                    'MsTransitionDuration': transitionTime,
                    'OTransitionDuration': transitionTime,
                    'transitionDuration': transitionTime,
                    'msTransitionDuration': transitionTime
                });
            }

            var itemsClone = this.renderItems(true);
            var firstClone = itemsClone.shift();
            var lastClone = itemsClone.pop();

            var swiperProps = {
                selectedItem: this.state.selectedItem,
                className: _cssClasses2.default.SLIDER(true, this.state.swiping),
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
                    var itemHeight = this.getVariableImageHeight(this.state.selectedItem);
                    swiperProps.style.height = itemHeight || 'auto';
                    containerStyles.height = itemHeight || 'auto';
                }
            } else {
                swiperProps.onSwipeUp = this.props.verticalSwipe === 'natural' ? this.onSwipeBackwards : this.onSwipeForward;
                swiperProps.onSwipeDown = this.props.verticalSwipe === 'natural' ? this.onSwipeForward : this.onSwipeBackwards;
                swiperProps.style.height = this.state.itemSize;
                containerStyles.height = this.state.itemSize;
            }
            return _react2.default.createElement(
                'div',
                { className: this.props.className, ref: this.setCarouselWrapperRef },
                _react2.default.createElement(
                    'div',
                    { className: _cssClasses2.default.CAROUSEL(true), style: { width: this.props.width } },
                    _react2.default.createElement('button', { type: 'button', className: _cssClasses2.default.ARROW_PREV(!hasPrev), onClick: this.onClickPrev }),
                    _react2.default.createElement(
                        'div',
                        { className: _cssClasses2.default.WRAPPER(true, this.props.axis), style: containerStyles, ref: this.setItemsWrapperRef },
                        this.props.swipeable ? _react2.default.createElement(
                            _reactEasySwipe2.default,
                            _extends({
                                tagName: 'ul',
                                ref: this.setListRef
                            }, swiperProps, {
                                allowMouseEvents: this.props.emulateTouch }),
                            this.props.infiniteLoop && lastClone,
                            this.renderItems(),
                            this.props.infiniteLoop && firstClone
                        ) : _react2.default.createElement(
                            'ul',
                            {
                                className: _cssClasses2.default.SLIDER(true, this.state.swiping),
                                ref: this.setListRef,
                                style: itemListStyles },
                            this.props.infiniteLoop && lastClone,
                            this.renderItems(),
                            this.props.infiniteLoop && firstClone
                        )
                    ),
                    _react2.default.createElement('button', { type: 'button', className: _cssClasses2.default.ARROW_NEXT(!hasNext), onClick: this.onClickNext }),
                    this.renderControls(),
                    this.renderStatus()
                ),
                this.renderThumbs()
            );
        }
    }]);

    return Carousel;
}(_react.Component);

Carousel.displayName = 'Carousel';
Carousel.propTypes = {
    className: _propTypes2.default.string,
    children: _propTypes2.default.node,
    showArrows: _propTypes2.default.bool,
    showStatus: _propTypes2.default.bool,
    showIndicators: _propTypes2.default.bool,
    infiniteLoop: _propTypes2.default.bool,
    showThumbs: _propTypes2.default.bool,
    thumbWidth: _propTypes2.default.number,
    selectedItem: _propTypes2.default.number,
    onClickItem: _propTypes2.default.func.isRequired,
    onClickThumb: _propTypes2.default.func.isRequired,
    onChange: _propTypes2.default.func.isRequired,
    axis: _propTypes2.default.oneOf(['horizontal', 'vertical']),
    verticalSwipe: _propTypes2.default.oneOf(['natural', 'standard']),
    width: customPropTypes.unit,
    useKeyboardArrows: _propTypes2.default.bool,
    autoPlay: _propTypes2.default.bool,
    stopOnHover: _propTypes2.default.bool,
    interval: _propTypes2.default.number,
    transitionTime: _propTypes2.default.number,
    swipeScrollTolerance: _propTypes2.default.number,
    swipeable: _propTypes2.default.bool,
    dynamicHeight: _propTypes2.default.bool,
    emulateTouch: _propTypes2.default.bool,
    statusFormatter: _propTypes2.default.func.isRequired,
    centerMode: _propTypes2.default.bool,
    centerSlidePercentage: _propTypes2.default.number
};
Carousel.defaultProps = {
    showIndicators: true,
    showArrows: true,
    showStatus: true,
    showThumbs: true,
    infiniteLoop: false,
    selectedItem: 0,
    axis: 'horizontal',
    verticalSwipe: 'standard',
    width: '100%',
    useKeyboardArrows: false,
    autoPlay: false,
    stopOnHover: true,
    interval: 3000,
    transitionTime: 350,
    swipeScrollTolerance: 5,
    swipeable: true,
    dynamicHeight: false,
    emulateTouch: false,
    onClickItem: noop,
    onClickThumb: noop,
    onChange: noop,
    statusFormatter: defaultStatusFormatter,
    centerMode: false,
    centerSlidePercentage: 80
};

var _initialiseProps = function _initialiseProps() {
    var _this5 = this;

    this.setThumbsRef = function (node) {
        _this5.thumbsRef = node;
    };

    this.setCarouselWrapperRef = function (node) {
        _this5.carouselWrapperRef = node;
    };

    this.setListRef = function (node) {
        _this5.listRef = node;
    };

    this.setItemsWrapperRef = function (node) {
        _this5.itemsWrapperRef = node;
    };

    this.setItemsRef = function (node, index) {
        if (!_this5.itemsRef) {
            _this5.itemsRef = [];
        }
        _this5.itemsRef[index] = node;
    };

    this.autoPlay = function () {
        if (!_this5.state.autoPlay || _react.Children.count(_this5.props.children) <= 1) {
            return;
        }

        clearTimeout(_this5.timer);
        _this5.timer = setTimeout(function () {
            _this5.increment();
        }, _this5.props.interval);
    };

    this.clearAutoPlay = function () {
        if (!_this5.state.autoPlay) {
            return;
        }

        clearTimeout(_this5.timer);
    };

    this.resetAutoPlay = function () {
        _this5.clearAutoPlay();
        _this5.autoPlay();
    };

    this.stopOnHover = function () {
        _this5.setState({ isMouseEntered: true });
        _this5.clearAutoPlay();
    };

    this.startOnLeave = function () {
        _this5.setState({ isMouseEntered: false });
        _this5.autoPlay();
    };

    this.navigateWithKeyboard = function (e) {
        var axis = _this5.props.axis;

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
            _this5.increment();
        } else if (prevKey === e.keyCode) {
            _this5.decrement();
        }
    };

    this.updateSizes = function () {
        if (!_this5.state.initialized) {
            return;
        }

        var isHorizontal = _this5.props.axis === 'horizontal';
        var firstItem = _this5.itemsRef[0];
        var itemSize = isHorizontal ? firstItem.clientWidth : firstItem.clientHeight;

        _this5.setState(function (_state, props) {
            return {
                itemSize: itemSize,
                wrapperSize: isHorizontal ? itemSize * _react.Children.count(props.children) : itemSize
            };
        });

        if (_this5.thumbsRef) {
            _this5.thumbsRef.updateSizes();
        }
    };

    this.setMountState = function () {
        _this5.setState({ hasMount: true });
        _this5.updateSizes();
    };

    this.handleClickItem = function (index, item) {
        if (_react.Children.count(_this5.props.children) == 0) {
            return;
        }

        if (_this5.state.cancelClick) {
            _this5.setState({
                cancelClick: false
            });

            return;
        }

        _this5.props.onClickItem(index, item);

        if (index !== _this5.state.selectedItem) {
            _this5.setState({
                selectedItem: index
            });
        }
    };

    this.handleOnChange = function (index, item) {
        if (_react.Children.count(_this5.props.children) <= 1) {
            return;
        }

        _this5.props.onChange(index, item);
    };

    this.handleClickThumb = function (index, item) {
        _this5.props.onClickThumb(index, item);

        _this5.selectItem({
            selectedItem: index
        });
    };

    this.onSwipeStart = function () {
        _this5.setState({
            swiping: true
        });
        _this5.clearAutoPlay();
    };

    this.onSwipeEnd = function () {
        _this5.setState({
            swiping: false
        });
        _this5.autoPlay();
    };

    this.onSwipeMove = function (delta) {
        var isHorizontal = _this5.props.axis === 'horizontal';
        var childrenLength = _react.Children.count(_this5.props.children);

        var initialBoundry = 0;

        var currentPosition = _this5.getPosition(_this5.state.selectedItem);
        var finalBoundry = _this5.props.infiniteLoop ? _this5.getPosition(childrenLength - 1) - 100 : _this5.getPosition(childrenLength - 1);

        var axisDelta = isHorizontal ? delta.x : delta.y;
        var handledDelta = axisDelta;

        // prevent user from swiping left out of boundaries
        if (currentPosition === initialBoundry && axisDelta > 0) {
            handledDelta = 0;
        }

        // prevent user from swiping right out of boundaries
        if (currentPosition === finalBoundry && axisDelta < 0) {
            handledDelta = 0;
        }

        var position = currentPosition + 100 / (_this5.state.itemSize / handledDelta);
        if (_this5.props.infiniteLoop) {
            // When allowing infinite loop, if we slide left from position 0 we reveal the cloned last slide that appears before it
            // if we slide even further we need to jump to other side so it can continue - and vice versa for the last slide
            if (_this5.state.selectedItem === 0 && position > -100) {
                position -= childrenLength * 100;
            } else if (_this5.state.selectedItem === childrenLength - 1 && position < -childrenLength * 100) {
                position += childrenLength * 100;
            }
        }
        position += '%';
        _this5.setPosition(position);

        // allows scroll if the swipe was within the tolerance
        var hasMoved = Math.abs(axisDelta) > _this5.props.swipeScrollTolerance;

        if (hasMoved && !_this5.state.cancelClick) {
            _this5.setState({
                cancelClick: true
            });
        }

        return hasMoved;
    };

    this.setPosition = function (position, forceReflow) {
        var list = _reactDom2.default.findDOMNode(_this5.listRef);
        ['WebkitTransform', 'MozTransform', 'MsTransform', 'OTransform', 'transform', 'msTransform'].forEach(function (prop) {
            list.style[prop] = (0, _CSSTranslate2.default)(position, _this5.props.axis);
        });
        if (forceReflow) {
            list.offsetLeft;
        }
    };

    this.resetPosition = function () {
        var currentPosition = _this5.getPosition(_this5.state.selectedItem) + '%';
        _this5.setPosition(currentPosition);
    };

    this.decrement = function () {
        var positions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
        var fromSwipe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        _this5.moveTo(_this5.state.selectedItem - (typeof positions === 'number' ? positions : 1), fromSwipe);
    };

    this.increment = function () {
        var positions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
        var fromSwipe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        _this5.moveTo(_this5.state.selectedItem + (typeof positions === 'number' ? positions : 1), fromSwipe);
    };

    this.moveTo = function (position, fromSwipe) {
        var lastPosition = _react.Children.count(_this5.props.children) - 1;
        var needClonedSlide = _this5.props.infiniteLoop && !fromSwipe && (position < 0 || position > lastPosition);
        var oldPosition = position;

        if (position < 0) {
            position = _this5.props.infiniteLoop ? lastPosition : 0;
        }

        if (position > lastPosition) {
            position = _this5.props.infiniteLoop ? 0 : lastPosition;
        }

        if (needClonedSlide) {
            // set swiping true would disable transition time, then we set slider to cloned position and force a reflow
            // this is only needed for non-swiping situation
            _this5.setState({
                swiping: true
            }, function () {
                if (oldPosition < 0) {
                    if (_this5.props.centerMode && _this5.props.axis === 'horizontal') {
                        _this5.setPosition('-' + ((lastPosition + 2) * _this5.props.centerSlidePercentage - (100 - _this5.props.centerSlidePercentage) / 2) + '%', true);
                    } else {
                        _this5.setPosition('-' + (lastPosition + 2) * 100 + '%', true);
                    }
                } else if (oldPosition > lastPosition) {
                    _this5.setPosition(0, true);
                }

                _this5.selectItem({
                    selectedItem: position,
                    swiping: false
                });
            });
        } else {
            _this5.selectItem({
                // if it's not a slider, we don't need to set position here
                selectedItem: position
            });
        }

        // don't reset auto play when stop on hover is enabled, doing so will trigger a call to auto play more than once
        // and will result in the interval function not being cleared correctly.
        if (_this5.state.autoPlay && _this5.state.isMouseEntered === false) {
            _this5.resetAutoPlay();
        }
    };

    this.onClickNext = function () {
        _this5.increment(1, false);
    };

    this.onClickPrev = function () {
        _this5.decrement(1, false);
    };

    this.onSwipeForward = function () {
        _this5.increment(1, true);
    };

    this.onSwipeBackwards = function () {
        _this5.decrement(1, true);
    };

    this.changeItem = function (e) {
        if (!e.key || e.key === 'Enter') {
            var newIndex = e.target.value;

            _this5.selectItem({
                selectedItem: newIndex
            });
        }
    };

    this.selectItem = function (state, cb) {
        _this5.setState(state, cb);
        _this5.handleOnChange(state.selectedItem, _react.Children.toArray(_this5.props.children)[state.selectedItem]);
    };

    this.getInitialImage = function () {
        var selectedItem = _this5.props.selectedItem;
        var item = _this5.itemsRef && _this5.itemsRef[selectedItem];
        var images = item && item.getElementsByTagName('img');
        return images && images[selectedItem];
    };

    this.getVariableImageHeight = function (position) {
        var item = _this5.itemsRef && _this5.itemsRef[position];
        var images = item && item.getElementsByTagName('img');
        if (_this5.state.hasMount && images.length > 0) {
            var image = images[0];

            if (!image.complete) {
                // if the image is still loading, the size won't be available so we trigger a new render after it's done
                var onImageLoad = function onImageLoad() {
                    _this5.forceUpdate();
                    image.removeEventListener('load', onImageLoad);
                };

                image.addEventListener('load', onImageLoad);
            }

            var height = image.clientHeight;
            return height > 0 ? height : null;
        }

        return null;
    };
};

exports.default = Carousel;