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
        showThumbs: React.PropTypes.bool,
        selectedItem: React.PropTypes.number,
        onClickItem: React.PropTypes.func,
        onClickThumb: React.PropTypes.func,
        onChange: React.PropTypes.func,
        axis: React.PropTypes.string
    },

    getDefaultProps: function getDefaultProps() {
        return {
            showIndicators: true,
            showArrows: true,
            showStatus: true,
            showThumbs: true,
            selectedItem: 0,
            axis: 'horizontal'
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
    componentWillMount: function componentWillMount() {
        // as the widths are calculated, we need to resize
        // the carousel when the window is resized
        window.addEventListener("resize", this.updateSizes);
        // issue #2 - image loading smaller
        window.addEventListener("DOMContentLoaded", this.updateSizes);
    },
    componentWillUnmount: function componentWillUnmount() {
        // removing listeners
        window.removeEventListener("resize", this.updateSizes);
        window.removeEventListener("DOMContentLoaded", this.updateSizes);
    },
    componentDidMount: function componentDidMount(nextProps) {
        // when the component is rendered we need to calculate
        // the container size to adjust the responsive behaviour
        this.updateSizes();

        this.isHorizontal = this.props.axis === 'horizontal';

        var defaultImg = ReactDOM.findDOMNode(this.item0).getElementsByTagName('img')[0];
        defaultImg && defaultImg.addEventListener('load', this.setMountState);
    },
    updateSizes: function updateSizes() {
        var firstItem = ReactDOM.findDOMNode(this.item0);
        this.itemSize = this.isHorizontal ? firstItem.clientWidth : firstItem.clientHeight;
        this.wrapperSize = this.isHorizontal ? this.itemSize * this.props.children.length : this.itemSize;
    },
    setMountState: function setMountState() {
        this.setState({ hasMount: true });
        this.updateSizes();
        this.forceUpdate();
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

        var position = currentPosition + 100 / (this.wrapperSize / axisDelta) + '%';

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
        // position can't be lower than 0
        position = position < 0 ? 0 : position;
        // position can't be higher than last postion
        position = position >= this.props.children.length - 1 ? this.props.children.length - 1 : position;

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

        var canShowArrows = this.props.showArrows && itemsLength > 1;

        // show left arrow?
        var hasPrev = canShowArrows && this.state.selectedItem > 0;
        // show right arrow
        var hasNext = canShowArrows && this.state.selectedItem < itemsLength - 1;
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

        if (this.isHorizontal) {
            merge(swiperProps, {
                onSwipeLeft: this.increment,
                onSwipeRight: this.decrement
            });
        } else {
            merge(swiperProps, {
                onSwipeUp: this.decrement,
                onSwipeDown: this.increment
            });

            swiperProps.style.height = this.itemSize;
            containerStyles.height = this.itemSize;
        }

        return React.createElement(
            'div',
            { className: this.props.className },
            React.createElement(
                'div',
                { className: klass.CAROUSEL(true) },
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