'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var ReactDOM = require('react-dom');
var PropTypes = require('prop-types');
var CreateReactClass = require('create-react-class');
var klass = require('../cssClasses');
var merge = require('../object-assign');
var CSSTranslate = require('../CSSTranslate');
var Swipe = require('react-easy-swipe');
var Thumbs = require('./Thumbs');
var customPropTypes = require('../customPropTypes');

// react-swipe was compiled using babel
Swipe = Swipe.default;

module.exports = CreateReactClass({
    displayName: 'Carousel',
    propTypes: {
        children: PropTypes.node,
        showArrows: PropTypes.bool,
        showStatus: PropTypes.bool,
        showIndicators: PropTypes.bool,
        infiniteLoop: PropTypes.bool,
        showThumbs: PropTypes.bool,
        selectedItem: PropTypes.number,
        onClickItem: PropTypes.func,
        onClickThumb: PropTypes.func,
        onChange: PropTypes.func,
        axis: PropTypes.oneOf(['horizontal', 'vertical']),
        width: customPropTypes.unit,
        useKeyboardArrows: PropTypes.bool,
        autoPlay: PropTypes.bool,
        stopOnHover: PropTypes.bool,
        interval: PropTypes.number,
        transitionTime: PropTypes.number,
        swipeScrollTolerance: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        dynamicHeight: PropTypes.bool,
        emulateTouch: PropTypes.bool
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
            width: '100%',
            useKeyboardArrows: false,
            autoPlay: false,
            stopOnHover: true,
            interval: 3000,
            transitionTime: 350,
            swipeScrollTolerance: 5,
            dynamicHeight: false,
            emulateTouch: false
        };
    },
    getInitialState: function getInitialState() {
        return {
            // index of the image to be shown.
            initialized: false,
            selectedItem: this.props.selectedItem,
            hasMount: false
        };
    },
    componentDidMount: function componentDidMount() {
        if (!this.props.children) {
            return;
        }

        this.setupCarousel();
    },
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        if (nextProps.selectedItem !== this.state.selectedItem) {
            this.updateSizes();
            this.setState({
                selectedItem: nextProps.selectedItem
            });
        }

        if (nextProps.autoPlay !== this.props.autoPlay) {
            if (nextProps.autoPlay) {
                this.setupAutoPlay();
            } else {
                this.destroyAutoPlay();
            }
        }
    },
    componentDidUpdate: function componentDidUpdate(prevProps) {
        if (!prevProps.children && this.props.children && !this.state.initialized) {
            this.setupCarousel();
        }
    },
    componentWillUnmount: function componentWillUnmount() {
        this.destroyCarousel();
    },
    setupCarousel: function setupCarousel() {
        this.bindEvents();

        if (this.props.autoPlay) {
            this.setupAutoPlay();
        }

        var initialImage = this.getInitialImage();
        if (initialImage) {
            // if it's a carousel of images, we set the mount state after the first image is loaded
            initialImage.addEventListener('load', this.setMountState);
        } else {
            this.setMountState();
        }

        this.setState({
            initialized: true
        });
    },
    destroyCarousel: function destroyCarousel() {
        if (this.state.initialized) {
            this.unbindEvents();
            this.destroyAutoPlay();
        }
    },
    setupAutoPlay: function setupAutoPlay() {
        this.autoPlay();

        if (this.props.stopOnHover) {
            var carouselWrapper = this.refs['carouselWrapper'];
            carouselWrapper.addEventListener('mouseenter', this.stopOnHover);
            carouselWrapper.addEventListener('touchstart', this.stopOnHover);
            carouselWrapper.addEventListener('mouseleave', this.autoPlay);
            carouselWrapper.addEventListener('touchend', this.autoPlay);
        }
    },
    destroyAutoPlay: function destroyAutoPlay() {
        this.clearAutoPlay();
        var carouselWrapper = this.refs['carouselWrapper'];

        if (this.props.stopOnHover && carouselWrapper) {
            carouselWrapper.removeEventListener('mouseenter', this.stopOnHover);
            carouselWrapper.removeEventListener('touchstart', this.stopOnHover);
            carouselWrapper.removeEventListener('mouseleave', this.autoPlay);
            carouselWrapper.removeEventListener('touchend', this.autoPlay);
        }
    },
    autoPlay: function autoPlay() {
        var _this = this;

        this.timer = setTimeout(function () {
            _this.increment();
        }, this.props.interval);
    },
    clearAutoPlay: function clearAutoPlay() {
        clearTimeout(this.timer);
    },
    resetAutoPlay: function resetAutoPlay() {
        this.clearAutoPlay();
        this.autoPlay();
    },
    stopOnHover: function stopOnHover() {
        this.clearAutoPlay();
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

        var initialImage = this.getInitialImage();
        if (initialImage) {
            initialImage.removeEventListener("load", this.setMountState);
        }

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
        if (!this.state.initialized) {
            return;
        }

        var isHorizontal = this.props.axis === 'horizontal';
        var firstItem = this.refs.item0;
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
        if (this.state.cancelClick) {
            this.selectItem({
                cancelClick: false
            });

            return;
        }

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
            swiping: false,
            cancelClick: true
        });
    },
    onSwipeMove: function onSwipeMove(delta) {
        var _this2 = this;

        var list = ReactDOM.findDOMNode(this.refs.itemList);
        var isHorizontal = this.props.axis === 'horizontal';

        var initialBoundry = 0;

        var currentPosition = -this.state.selectedItem * 100;
        var finalBoundry = -(this.props.children.length - 1) * 100;

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

        var position = currentPosition + 100 / (this.state.itemSize / handledDelta) + '%';

        ['WebkitTransform', 'MozTransform', 'MsTransform', 'OTransform', 'transform', 'msTransform'].forEach(function (prop) {
            list.style[prop] = CSSTranslate(position, _this2.props.axis);
        });

        // allows scroll if the swipe was within the tolerance
        return Math.abs(axisDelta) > this.props.swipeScrollTolerance;
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

        if (this.props.autoPlay) {
            this.resetAutoPlay();
        }
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
        var _this3 = this;

        return React.Children.map(this.props.children, function (item, index) {
            var hasMount = _this3.state.hasMount;
            var itemClass = klass.ITEM(true, index === _this3.state.selectedItem);

            return React.createElement(
                'li',
                { ref: "item" + index, key: "itemKey" + index, className: itemClass,
                    onClick: _this3.handleClickItem.bind(_this3, index, item) },
                item
            );
        });
    },
    renderControls: function renderControls() {
        var _this4 = this;

        if (!this.props.showIndicators) {
            return null;
        }

        return React.createElement(
            'ul',
            { className: 'control-dots' },
            React.Children.map(this.props.children, function (item, index) {
                return React.createElement('li', { className: klass.DOT(index === _this4.state.selectedItem), onClick: _this4.changeItem, value: index, key: index });
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
            { onSelectItem: this.handleClickThumb, selectedItem: this.state.selectedItem, transitionTime: this.props.transitionTime },
            this.props.children
        );
    },
    getInitialImage: function getInitialImage() {
        var selectedItem = this.props.selectedItem;
        var item = this.refs['item' + selectedItem];
        var images = item && item.getElementsByTagName('img');
        return images && images[selectedItem];
    },
    getVariableImageHeight: function getVariableImageHeight(position) {
        var _this5 = this;

        var item = this.refs['item' + position];
        var images = item && item.getElementsByTagName('img');
        if (this.state.hasMount && images.length > 0) {
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
    },
    render: function render() {
        if (!this.props.children) {
            return null;
        }

        var itemsLength = this.props.children.length;

        if (itemsLength === 0) {
            return null;
        }

        var isHorizontal = this.props.axis === 'horizontal';

        var canShowArrows = this.props.showArrows && itemsLength > 1;

        // show left arrow?
        var hasPrev = canShowArrows && (this.state.selectedItem > 0 || this.props.infiniteLoop);
        // show right arrow
        var hasNext = canShowArrows && (this.state.selectedItem < itemsLength - 1 || this.props.infiniteLoop);
        // obj to hold the transformations and styles
        var itemListStyles = {};

        var currentPosition = -this.state.selectedItem * 100 + '%';

        // if 3d is available, let's take advantage of the performance of transform
        var transformProp = CSSTranslate(currentPosition, this.props.axis);

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

        var swiperProps = {
            selectedItem: this.state.selectedItem,
            className: klass.SLIDER(true, this.state.swiping),
            onSwipeMove: this.onSwipeMove,
            onSwipeStart: this.onSwipeStart,
            onSwipeEnd: this.onSwipeEnd,
            style: itemListStyles,
            ref: 'itemList'
        };

        var containerStyles = {};

        if (isHorizontal) {
            merge(swiperProps, {
                onSwipeLeft: this.increment,
                onSwipeRight: this.decrement
            });

            if (this.props.dynamicHeight) {
                var itemHeight = this.getVariableImageHeight(this.state.selectedItem);
                swiperProps.style.height = itemHeight || 'auto';
                containerStyles.height = itemHeight || 'auto';
            }
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
            { className: this.props.className, ref: 'carouselWrapper' },
            React.createElement(
                'div',
                { className: klass.CAROUSEL(true), style: { width: this.props.width } },
                React.createElement('button', { type: 'button', className: klass.ARROW_PREV(!hasPrev), onClick: this.decrement }),
                React.createElement(
                    'div',
                    { className: klass.WRAPPER(true, this.props.axis), style: containerStyles, ref: 'itemsWrapper' },
                    React.createElement(
                        Swipe,
                        _extends({ tagName: 'ul' }, swiperProps, { allowMouseEvents: this.props.emulateTouch }),
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