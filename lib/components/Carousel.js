'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var ReactDOM = require('react-dom');
var klass = require('../cssClasses');
var merge = require('../object-assign');
var CSSTranslate = require('../CSSTranslate');
var Swipe = require('react-easy-swipe');
var Thumbs = require('./Thumbs');

// react-swipe was compiled using babel
Swipe = Swipe.default;

module.exports = React.createClass({
    displayName: 'Slider',
    propTypes: {
        children: React.PropTypes.node.isRequired,
        showArrows: React.PropTypes.bool,
        showStatus: React.PropTypes.bool,
        showIndicators: React.PropTypes.bool,
        infiniteLoop: React.PropTypes.bool,
        showThumbs: React.PropTypes.bool,
        selectedItem: React.PropTypes.number,
        onClickItem: React.PropTypes.func,
        onClickThumb: React.PropTypes.func,
        onChange: React.PropTypes.func,
        axis: React.PropTypes.string,
        width: React.PropTypes.string,
        useKeyboardArrows: React.PropTypes.bool
    },

    getDefaultProps: function getDefaultProps() {
        return {
            showIndicators: true,
            showArrows: true,
            showStatus: true,
            showThumbs: true,
            infiniteLoop: false,
            selectedItem: 0,
            axis: 'horizontal',
            useKeyboardArrows: false
        };
    },
    getInitialState: function getInitialState() {
        return {
            // index of the image to be shown.
            selectedItem: this.props.selectedItem,
            hasMount: false
        };
    },
    componentWillReceiveProps: function componentWillReceiveProps(props, state) {
        if (props.selectedItem !== this.state.selectedItem) {
            this.updateSizes();
            this.setState({
                selectedItem: props.selectedItem
            });
        }
    },
    componentDidMount: function componentDidMount(nextProps) {
        this.bindEvents();

        var images = ReactDOM.findDOMNode(this.item0).getElementsByTagName('img');
        var initialImage = images && images[this.props.selectedItem];

        if (initialImage) {
            // if it's a carousel of images, we set the mount state after the first image is loaded
            initialImage.addEventListener('load', this.setMountState);
        } else {
            this.setMountState();
        }
    },
    componentWillUnmount: function componentWillUnmount() {
        this.unbindEvents();
    },
    bindEvents: function bindEvents() {
        // as the widths are calculated, we need to resize
        // the carousel when the window is resized
        window.addEventListener("resize", this.updateSizes);
        // issue #2 - image loading smaller
        window.addEventListener("DOMContentLoaded", this.updateSizes);

        if (this.props.useKeyboardArrows) {
            document.addEventListener("keydown", this.navigateWithKeyboard);
        }
    },
    unbindEvents: function unbindEvents() {
        // removing listeners
        window.removeEventListener("resize", this.updateSizes);
        window.removeEventListener("DOMContentLoaded", this.updateSizes);

        if (this.props.useKeyboardArrows) {
            document.removeEventListener("keydown", this.navigateWithKeyboard);
        }
    },
    navigateWithKeyboard: function navigateWithKeyboard(e) {
        var nextKeys = ['ArrowDown', 'ArrowRight'];
        var prevKeys = ['ArrowUp', 'ArrowLeft'];
        var allowedKeys = nextKeys.concat(prevKeys);

        if (allowedKeys.indexOf(e.key) > -1) {
            if (nextKeys.indexOf(e.key) > -1) {
                this.increment();
            } else if (prevKeys.indexOf(e.key) > -1) {
                this.decrement();
            }
        }
    },
    updateSizes: function updateSizes() {
        var isHorizontal = this.props.axis === 'horizontal';
        var firstItem = ReactDOM.findDOMNode(this.item0);
        var itemSize = isHorizontal ? firstItem.clientWidth : firstItem.clientHeight;

        this.setState({
            itemSize: itemSize,
            wrapperSize: isHorizontal ? itemSize * this.props.children.length : itemSize
        });
    },
    setMountState: function setMountState() {
        this.setState({ hasMount: true });
        this.updateSizes();
    },
    handleClickItem: function handleClickItem(index, item) {
        var handler = this.props.onClickItem;

        if (typeof handler === 'function') {
            handler(index, item);
        }

        if (index !== this.state.selectedItem) {
            this.setState({
                selectedItem: index
            });
        }
    },
    handleOnChange: function handleOnChange(index, item) {
        var handler = this.props.onChange;

        if (typeof handler === 'function') {
            handler(index, item);
        }
    },
    handleClickThumb: function handleClickThumb(index, item) {
        var handler = this.props.onClickThumb;

        if (typeof handler === 'function') {
            handler(index, item);
        }

        this.selectItem({
            selectedItem: index
        });
    },
    onSwipeStart: function onSwipeStart() {
        this.setState({
            swiping: true
        });
    },
    onSwipeEnd: function onSwipeEnd() {
        this.setState({
            swiping: false
        });
    },
    onSwipeMove: function onSwipeMove(delta) {
        var _this = this;

        var list = ReactDOM.findDOMNode(this.itemList);
        var isHorizontal = this.props.axis === 'horizontal';

        var initialBoundry = 0;

        var currentPosition = -this.state.selectedItem * 100;
        var finalBoundry = -(this.props.children.length - 1) * 100;

        var axisDelta = isHorizontal ? delta.x : delta.y;

        // prevent user from swiping left out of boundaries
        if (currentPosition === initialBoundry && axisDelta > 0) {
            axisDelta = 0;
        }

        // prevent user from swiping right out of boundaries
        if (currentPosition === finalBoundry && axisDelta < 0) {
            axisDelta = 0;
        }

        var position = currentPosition + 100 / (this.state.wrapperSize / axisDelta) + '%';

        ['WebkitTransform', 'MozTransform', 'MsTransform', 'OTransform', 'transform', 'msTransform'].forEach(function (prop) {
            list.style[prop] = CSSTranslate(position, _this.props.axis);
        });
    },
    decrement: function decrement(positions) {
        this.moveTo(this.state.selectedItem - (typeof positions === 'Number' ? positions : 1));
    },
    increment: function increment(positions) {
        this.moveTo(this.state.selectedItem + (typeof positions === 'Number' ? positions : 1));
    },
    moveTo: function moveTo(position) {
        var lastPosition = this.props.children.length - 1;

        if (position < 0) {
            position = this.props.infiniteLoop ? lastPosition : 0;
        }

        if (position > lastPosition) {
            position = this.props.infiniteLoop ? 0 : lastPosition;
        }

        this.selectItem({
            // if it's not a slider, we don't need to set position here
            selectedItem: position
        });
    },
    changeItem: function changeItem(e) {
        var newIndex = e.target.value;

        this.selectItem({
            selectedItem: newIndex
        });
    },
    selectItem: function selectItem(state) {
        this.setState(state);
        this.handleOnChange(state.selectedItem, this.props.children[state.selectedItem]);
    },
    renderItems: function renderItems() {
        var _this2 = this;

        return React.Children.map(this.props.children, function (item, index) {
            var hasMount = _this2.state.hasMount;
            var itemClass = klass.ITEM(true, index === _this2.state.selectedItem);

            return React.createElement(
                'li',
                { ref: function ref(node) {
                        return _this2["item" + index] = node;
                    }, key: "itemKey" + index, className: itemClass,
                    onClick: _this2.handleClickItem.bind(_this2, index, item) },
                item
            );
        });
    },
    renderControls: function renderControls() {
        var _this3 = this;

        if (!this.props.showIndicators) {
            return null;
        }

        return React.createElement(
            'ul',
            { className: 'control-dots' },
            React.Children.map(this.props.children, function (item, index) {
                return React.createElement('li', { className: klass.DOT(index === _this3.state.selectedItem), onClick: _this3.changeItem, value: index, key: index });
            })
        );
    },
    renderStatus: function renderStatus() {
        if (!this.props.showStatus) {
            return null;
        }

        return React.createElement(
            'p',
            { className: 'carousel-status' },
            this.state.selectedItem + 1,
            ' of ',
            this.props.children.length
        );
    },
    renderThumbs: function renderThumbs() {
        if (!this.props.showThumbs) {
            return null;
        }

        return React.createElement(
            Thumbs,
            { onSelectItem: this.handleClickThumb, selectedItem: this.state.selectedItem },
            this.props.children
        );
    },
    render: function render() {
        var _this4 = this;

        var itemsLength = this.props.children.length;

        if (itemsLength === 0) {
            return null;
        }

        var isHorizontal = this.props.axis === 'horizontal';

        var canShowArrows = this.props.showArrows && itemsLength > 1;

        // show left arrow?
        var hasPrev = canShowArrows && this.state.selectedItem > 0 || this.props.infiniteLoop;
        // show right arrow
        var hasNext = canShowArrows && this.state.selectedItem < itemsLength - 1 || this.props.infiniteLoop;
        // obj to hold the transformations and styles
        var itemListStyles = {};

        var currentPosition = -this.state.selectedItem * 100 + '%';

        // if 3d is available, let's take advantage of the performance of transform
        var transformProp = CSSTranslate(currentPosition, this.props.axis);

        itemListStyles = {
            'WebkitTransform': transformProp,
            'MozTransform': transformProp,
            'MsTransform': transformProp,
            'OTransform': transformProp,
            'transform': transformProp,
            'msTransform': transformProp
        };

        var swiperProps = {
            selectedItem: this.state.selectedItem,
            className: klass.SLIDER(true, this.state.swiping),
            onSwipeMove: this.onSwipeMove,
            onSwipeStart: this.onSwipeStart,
            onSwipeEnd: this.onSwipeEnd,
            style: itemListStyles,
            ref: function ref(node) {
                return _this4.itemList = node;
            }
        };

        var containerStyles = {};

        if (isHorizontal) {
            merge(swiperProps, {
                onSwipeLeft: this.increment,
                onSwipeRight: this.decrement
            });
        } else {
            merge(swiperProps, {
                onSwipeUp: this.decrement,
                onSwipeDown: this.increment
            });

            swiperProps.style.height = this.state.itemSize;
            containerStyles.height = this.state.itemSize;
        }

        return React.createElement(
            'div',
            { className: this.props.className },
            React.createElement(
                'div',
                { className: klass.CAROUSEL(true), style: { width: this.props.width || '100%' } },
                React.createElement('button', { type: 'button', className: klass.ARROW_PREV(!hasPrev), onClick: this.decrement }),
                React.createElement(
                    'div',
                    { className: klass.WRAPPER(true, this.props.axis), style: containerStyles, ref: function ref(node) {
                            return _this4.itemsWrapper = node;
                        } },
                    React.createElement(
                        Swipe,
                        _extends({ tagName: 'ul' }, swiperProps),
                        this.renderItems()
                    )
                ),
                React.createElement('button', { type: 'button', className: klass.ARROW_NEXT(!hasNext), onClick: this.increment }),
                this.renderControls(),
                this.renderStatus()
            ),
            this.renderThumbs()
        );
    }
});