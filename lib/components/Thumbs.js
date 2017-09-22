'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

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

        _this.updateSizes = function () {
            if (!_this.state.initialized) {
                return;
            }

            var total = _this.props.children.length;
            _this.wrapperSize = _this.itemsWrapper.clientWidth;
            _this.itemSize = _this.props.thumbWidth ? _this.props.thumbWidth : (0, _dimensions.outerWidth)(_this.refs.thumb0);
            _this.visibleItems = Math.floor(_this.wrapperSize / _this.itemSize);
            _this.lastPosition = total - _this.visibleItems;
            _this.showArrows = _this.visibleItems < total;
        };

        _this.setMountState = function () {
            _this.setState({ hasMount: true });
            _this.updateSizes();
        };

        _this.handleClickItem = function (index, item) {
            var handler = _this.props.onSelectItem;

            if (typeof handler === 'function') {
                handler(index, item);
            }
        };

        _this.onSwipeStart = function () {
            _this.setState({
                swiping: true
            });
        };

        _this.onSwipeEnd = function () {
            _this.setState({
                swiping: false
            });
        };

        _this.onSwipeMove = function (deltaX) {
            var leftBoundry = 0;
            var list = _reactDom2.default.findDOMNode(_this.itemList);
            var wrapperSize = list.clientWidth;
            var visibleItems = Math.floor(wrapperSize / _this.itemSize);

            var currentPosition = -_this.state.firstItem * _this.itemSize;
            var lastLeftBoundry = -_this.visibleItems * _this.itemSize;

            // prevent user from swiping left out of boundaries
            if (currentPosition === leftBoundry && deltaX > 0) {
                deltaX = 0;
            }

            // prevent user from swiping right out of boundaries
            if (currentPosition === lastLeftBoundry && deltaX < 0) {
                deltaX = 0;
            }

            var position = currentPosition + 100 / (wrapperSize / deltaX) + '%';

            // if 3d isn't available we will use left to move
            ['WebkitTransform', 'MozTransform', 'MsTransform', 'OTransform', 'transform', 'msTransform'].forEach(function (prop) {
                list.style[prop] = (0, _CSSTranslate2.default)(position, _this.props.axis);
            });
        };

        _this.slideRight = function (positions) {
            _this.moveTo(_this.state.firstItem - (typeof positions === 'Number' ? positions : 1));
        };

        _this.slideLeft = function (positions) {
            _this.moveTo(_this.state.firstItem + (typeof positions === 'Number' ? positions : 1));
        };

        _this.moveTo = function (position) {
            // position can't be lower than 0
            position = position < 0 ? 0 : position;
            // position can't be higher than last postion
            position = position >= _this.lastPosition ? _this.lastPosition : position;

            _this.setState({
                firstItem: position,
                // if it's not a slider, we don't need to set position here
                selectedItem: _this.state.selectedItem
            });
        };

        _this.state = {
            initialized: false,
            selectedItem: props.selectedItem,
            hasMount: false,
            firstItem: _this.getFirstItem(props.selectedItem),
            images: []
        };
        return _this;
    }

    _createClass(Thumbs, [{
        key: 'componentDidMount',
        value: function componentDidMount(nextProps) {
            if (!this.props.children) {
                return;
            }

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
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate(prevProps) {
            if (!prevProps.children && this.props.children && !this.state.initialized) {
                this.setupThumbs();
            }
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

            var images = this.getImages();

            if (!images) {
                return;
            }

            this.setState({
                initialized: true,
                images: images
            });

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
            var images = _react2.default.Children.map(this.props.children, function (item, index) {
                var img = item;

                // if the item is not an image, try to find the first image in the item's children.
                if (item.type !== "img") {
                    img = _react2.default.Children.toArray(item.props.children).filter(function (children) {
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
            if (!this.showArrows) {
                return 0;
            }

            var firstItem = selectedItem;

            if (selectedItem >= this.lastPosition) {
                firstItem = this.lastPosition;
            }

            if (selectedItem < this.state.firstItem + this.visibleItems) {
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
                    ref: 'thumb' + index,
                    className: itemClass,
                    onClick: _this2.handleClickItem.bind(_this2, index, _this2.props.children[index])
                };

                if (index === 0) {
                    img = _react2.default.cloneElement(img, {
                        onLoad: _this2.setMountState
                    });
                }

                return _react2.default.createElement(
                    'li',
                    thumbProps,
                    img
                );
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            if (!this.props.children || this.state.images.length === 0) {
                return null;
            }

            // show left arrow?
            var hasPrev = this.showArrows && this.state.firstItem > 0;
            // show right arrow
            var hasNext = this.showArrows && this.state.firstItem < this.lastPosition;
            // obj to hold the transformations and styles
            var itemListStyles = {};

            var currentPosition = -this.state.firstItem * this.itemSize + 'px';

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
                    { className: _cssClasses2.default.WRAPPER(false), ref: function ref(node) {
                            return _this3.itemsWrapper = node;
                        } },
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
                            ref: function ref(node) {
                                return _this3.itemList = node;
                            } },
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
exports.default = Thumbs;