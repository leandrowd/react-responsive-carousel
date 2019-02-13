'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _cssClasses = require('../cssClasses');

var _cssClasses2 = _interopRequireDefault(_cssClasses);

var _dimensions = require('../dimensions');

var _CSSTranslate = require('../CSSTranslate');

var _CSSTranslate2 = _interopRequireDefault(_CSSTranslate);

var _reactEasySwipe = require('react-easy-swipe');

var _reactEasySwipe2 = _interopRequireDefault(_reactEasySwipe);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Thumbs = function (_Component) {
    _inherits(Thumbs, _Component);

    function Thumbs(props) {
        _classCallCheck(this, Thumbs);

        var _this = _possibleConstructorReturn(this, (Thumbs.__proto__ || Object.getPrototypeOf(Thumbs)).call(this, props));

        _initialiseProps.call(_this);

        _this.state = {
            selectedItem: props.selectedItem,
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
        key: 'componentDidMount',
        value: function componentDidMount(nextProps) {
            this.setupThumbs();
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(props, state) {
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
        key: 'componentDidUpdate',
        value: function componentDidUpdate(prevProps) {
            if (this.props.children === prevProps.children) {
                return;
            }

            // This will capture any size changes for arrow adjustments etc.
            // usually in the same render cycle so we don't see any flickers
            this.updateSizes();
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.destroyThumbs();
        }
    }, {
        key: 'setupThumbs',
        value: function setupThumbs() {
            // as the widths are calculated, we need to resize
            // the carousel when the window is resized
            window.addEventListener("resize", this.updateSizes);
            // issue #2 - image loading smaller
            window.addEventListener("DOMContentLoaded", this.updateSizes);

            // when the component is rendered we need to calculate
            // the container size to adjust the responsive behaviour
            this.updateSizes();
        }
    }, {
        key: 'destroyThumbs',
        value: function destroyThumbs() {
            // removing listeners
            window.removeEventListener("resize", this.updateSizes);
            window.removeEventListener("DOMContentLoaded", this.updateSizes);
        }
    }, {
        key: 'getImages',
        value: function getImages() {
            var images = _react.Children.map(this.props.children, function (item, index) {
                var img = item;

                // if the item is not an image, try to find the first image in the item's children.
                if (item.type !== "img") {
                    img = _react.Children.toArray(item.props.children).filter(function (children) {
                        return children.type === "img";
                    })[0];
                }

                if (!img || img.length === 0) {
                    return null;
                }

                return img;
            });

            if (images.filter(function (image) {
                return image !== null;
            }).length === 0) {
                console.warn('No images found! Can\'t build the thumb list without images. If you don\'t need thumbs, set showThumbs={false} in the Carousel. Note that it\'s not possible to get images rendered inside custom components. More info at https://github.com/leandrowd/react-responsive-carousel/blob/master/TROUBLESHOOTING.md');

                return null;
            }

            return images;
        }
    }, {
        key: 'getFirstItem',
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
        key: 'renderItems',
        value: function renderItems() {
            var _this2 = this;

            return this.state.images.map(function (img, index) {
                var itemClass = _cssClasses2.default.ITEM(false, index === _this2.state.selectedItem && _this2.state.hasMount);

                var thumbProps = {
                    key: index,
                    ref: function ref(e) {
                        return _this2.setThumbsRef(e, index);
                    },
                    className: itemClass,
                    onClick: _this2.handleClickItem.bind(_this2, index, _this2.props.children[index]),
                    onKeyDown: _this2.handleClickItem.bind(_this2, index, _this2.props.children[index])
                };

                if (index === 0) {
                    img = _react2.default.cloneElement(img, {
                        onLoad: _this2.setMountState
                    });
                }

                return _react2.default.createElement(
                    'li',
                    _extends({}, thumbProps, { role: 'button', tabIndex: 0 }),
                    img
                );
            });
        }
    }, {
        key: 'render',
        value: function render() {
            if (!this.props.children) {
                return null;
            }

            // show left arrow?
            var hasPrev = this.state.showArrows && this.state.firstItem > 0;
            // show right arrow
            var hasNext = this.state.showArrows && this.state.firstItem < this.state.lastPosition;
            // obj to hold the transformations and styles
            var itemListStyles = {};

            var currentPosition = -this.state.firstItem * this.state.itemSize + 'px';

            var transformProp = (0, _CSSTranslate2.default)(currentPosition, this.props.axis);

            var transitionTime = this.props.transitionTime + 'ms';

            itemListStyles = {
                'WebkitTransform': transformProp,
                'MozTransform': transformProp,
                'MsTransform': transformProp,
                'OTransform': transformProp,
                'transform': transformProp,
                'msTransform': transformProp,
                'WebkitTransitionDuration': transitionTime,
                'MozTransitionDuration': transitionTime,
                'MsTransitionDuration': transitionTime,
                'OTransitionDuration': transitionTime,
                'transitionDuration': transitionTime,
                'msTransitionDuration': transitionTime
            };

            return _react2.default.createElement(
                'div',
                { className: _cssClasses2.default.CAROUSEL(false) },
                _react2.default.createElement(
                    'div',
                    { className: _cssClasses2.default.WRAPPER(false), ref: this.setItemsWrapperRef },
                    _react2.default.createElement('button', { type: 'button', className: _cssClasses2.default.ARROW_PREV(!hasPrev), onClick: this.slideRight }),
                    _react2.default.createElement(
                        _reactEasySwipe2.default,
                        { tagName: 'ul',
                            selectedItem: this.state.selectedItem,
                            className: _cssClasses2.default.SLIDER(false, this.state.swiping),
                            onSwipeLeft: this.slideLeft,
                            onSwipeRight: this.slideRight,
                            onSwipeMove: this.onSwipeMove,
                            onSwipeStart: this.onSwipeStart,
                            onSwipeEnd: this.onSwipeEnd,
                            style: itemListStyles,
                            ref: this.setItemsListRef },
                        this.renderItems()
                    ),
                    _react2.default.createElement('button', { type: 'button', className: _cssClasses2.default.ARROW_NEXT(!hasNext), onClick: this.slideLeft })
                )
            );
        }
    }]);

    return Thumbs;
}(_react.Component);

Thumbs.displayName = 'Thumbs';
Thumbs.propsTypes = {
    children: _propTypes2.default.element.isRequired,
    transitionTime: _propTypes2.default.number,
    selectedItem: _propTypes2.default.number,
    thumbWidth: _propTypes2.default.number
};
Thumbs.defaultProps = {
    selectedItem: 0,
    transitionTime: 350,
    axis: 'horizontal'
};

var _initialiseProps = function _initialiseProps() {
    var _this3 = this;

    this.setItemsWrapperRef = function (node) {
        _this3.itemsWrapperRef = node;
    };

    this.setItemsListRef = function (node) {
        _this3.itemsListRef = node;
    };

    this.setThumbsRef = function (node, index) {
        if (!_this3.thumbsRef) {
            _this3.thumbsRef = [];
        }
        _this3.thumbsRef[index] = node;
    };

    this.updateSizes = function () {
        if (!_this3.props.children || !_this3.itemsWrapperRef) {
            return;
        }

        var total = _this3.props.children.length;
        var wrapperSize = _this3.itemsWrapperRef.clientWidth;
        var itemSize = _this3.props.thumbWidth ? _this3.props.thumbWidth : (0, _dimensions.outerWidth)(_this3.thumbsRef[0]);
        var visibleItems = Math.floor(wrapperSize / itemSize);
        var lastPosition = total - visibleItems;
        var showArrows = visibleItems < total;
        _this3.setState(function (_state, props) {
            return {
                itemSize: itemSize,
                visibleItems: visibleItems,
                firstItem: showArrows ? _this3.getFirstItem(props.selectedItem) : 0,
                lastPosition: lastPosition,
                showArrows: showArrows
            };
        });
    };

    this.setMountState = function () {
        _this3.setState({ hasMount: true });
        _this3.updateSizes();
    };

    this.handleClickItem = function (index, item, e) {
        if (!e.keyCode || e.key === 'Enter') {
            var handler = _this3.props.onSelectItem;

            if (typeof handler === 'function') {
                handler(index, item);
            }
        }
    };

    this.onSwipeStart = function () {
        _this3.setState({
            swiping: true
        });
    };

    this.onSwipeEnd = function () {
        _this3.setState({
            swiping: false
        });
    };

    this.onSwipeMove = function (deltaX) {
        var leftBoundary = 0;

        var currentPosition = -_this3.state.firstItem * _this3.state.itemSize;
        var lastLeftBoundary = -_this3.state.visibleItems * _this3.state.itemSize;

        // prevent user from swiping left out of boundaries
        if (currentPosition === leftBoundary && deltaX > 0) {
            deltaX = 0;
        }

        // prevent user from swiping right out of boundaries
        if (currentPosition === lastLeftBoundary && deltaX < 0) {
            deltaX = 0;
        }

        var wrapperSize = _this3.itemsWrapperRef.clientWidth;
        var position = currentPosition + 100 / (wrapperSize / deltaX) + '%';

        // if 3d isn't available we will use left to move
        if (_this3.itemsListRef) {
            ['WebkitTransform', 'MozTransform', 'MsTransform', 'OTransform', 'transform', 'msTransform'].forEach(function (prop) {
                _this3.itemsListRef.style[prop] = (0, _CSSTranslate2.default)(position, _this3.props.axis);
            });
        }
    };

    this.slideRight = function (positions) {
        _this3.moveTo(_this3.state.firstItem - (typeof positions === 'number' ? positions : 1));
    };

    this.slideLeft = function (positions) {
        _this3.moveTo(_this3.state.firstItem + (typeof positions === 'number' ? positions : 1));
    };

    this.moveTo = function (position) {
        // position can't be lower than 0
        position = position < 0 ? 0 : position;
        // position can't be higher than last postion
        position = position >= _this3.lastPosition ? _this3.lastPosition : position;

        _this3.setState({
            firstItem: position,
            // if it's not a slider, we don't need to set position here
            selectedItem: _this3.state.selectedItem
        });
    };
};

exports.default = Thumbs;