'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var PropTypes = require('prop-types');
var CreateReactClass = require('create-react-class');
var klass = require('../cssClasses');
var outerWidth = require('../dimensions').outerWidth;
var CSSTranslate = require('../CSSTranslate');
var Swipe = require('react-easy-swipe');

// react-swipe was compiled using babel
Swipe = Swipe.default;

module.exports = CreateReactClass({

    propsTypes: {
        children: PropTypes.element.isRequired,
        transitionTime: PropTypes.number,
        selectedItem: PropTypes.number
    },

    getDefaultProps: function getDefaultProps() {
        return {
            selectedItem: 0,
            transitionTime: 350,
            axis: 'horizontal'
        };
    },
    getInitialState: function getInitialState() {
        return {
            selectedItem: this.props.selectedItem,
            hasMount: false,
            firstItem: this.getFirstItem(this.props.selectedItem)
        };
    },
    componentWillReceiveProps: function componentWillReceiveProps(props, state) {
        if (props.selectedItem !== this.state.selectedItem) {
            this.setState({
                selectedItem: props.selectedItem,
                firstItem: this.getFirstItem(props.selectedItem)
            });
        }
    },
    componentDidMount: function componentDidMount(nextProps) {
        // as the widths are calculated, we need to resize
        // the carousel when the window is resized
        window.addEventListener("resize", this.updateStatics);
        // issue #2 - image loading smaller
        window.addEventListener("DOMContentLoaded", this.updateStatics);

        var defaultImg = this.getDefaultImage();
        if (defaultImg) {
            defaultImg.addEventListener('load', this.onFirstImageLoad);
        }

        // when the component is rendered we need to calculate
        // the container size to adjust the responsive behaviour
        this.updateStatics();
    },
    componentWillUnmount: function componentWillUnmount() {
        // removing listeners
        window.removeEventListener("resize", this.updateStatics);
        window.removeEventListener("DOMContentLoaded", this.updateStatics);

        var defaultImg = this.getDefaultImage();
        if (defaultImg) {
            defaultImg.removeEventListener('load', this.onFirstImageLoad);
        }
    },
    updateStatics: function updateStatics() {
        var total = this.props.children.length;
        this.wrapperSize = this.itemsWrapper.clientWidth;
        this.itemSize = outerWidth(this.thumb0);
        this.visibleItems = Math.floor(this.wrapperSize / this.itemSize);
        this.lastPosition = total - this.visibleItems;
        this.showArrows = this.visibleItems < total;
    },
    getDefaultImage: function getDefaultImage() {
        var firstItem = ReactDOM.findDOMNode(this.thumb0);

        if (firstItem) {
            var firstImage = firstItem.getElementsByTagName('img');
            return firstImage && firstImage[0];
        }

        return null;
    },
    onFirstImageLoad: function onFirstImageLoad() {
        this.setState({ hasMount: true });
        this.updateStatics();
    },
    handleClickItem: function handleClickItem(index, item) {
        var handler = this.props.onSelectItem;

        if (typeof handler === 'function') {
            handler(index, item);
        }
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
    onSwipeMove: function onSwipeMove(deltaX) {
        var _this = this;

        var leftBoundry = 0;
        var list = ReactDOM.findDOMNode(this.itemList);
        var wrapperSize = list.clientWidth;
        var visibleItems = Math.floor(wrapperSize / this.itemSize);

        var currentPosition = -this.state.firstItem * this.itemSize;
        var lastLeftBoundry = -this.visibleItems * this.itemSize;

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
            list.style[prop] = CSSTranslate(position, _this.props.axis);
        });
    },
    slideRight: function slideRight(positions) {
        this.moveTo(this.state.firstItem - (typeof positions === 'Number' ? positions : 1));
    },
    slideLeft: function slideLeft(positions) {
        this.moveTo(this.state.firstItem + (typeof positions === 'Number' ? positions : 1));
    },
    moveTo: function moveTo(position) {
        // position can't be lower than 0
        position = position < 0 ? 0 : position;
        // position can't be higher than last postion
        position = position >= this.lastPosition ? this.lastPosition : position;

        this.setState({
            firstItem: position,
            // if it's not a slider, we don't need to set position here
            selectedItem: this.state.selectedItem
        });
    },
    getFirstItem: function getFirstItem(selectedItem) {
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
    },
    renderItems: function renderItems() {
        var _this2 = this;

        return React.Children.map(this.props.children, function (item, index) {
            var itemClass = klass.ITEM(false, index === _this2.state.selectedItem && _this2.state.hasMount);

            var img = item;

            if (item.type !== "img") {
                img = React.Children.toArray(item.props.children).filter(function (children) {
                    return children.type === "img";
                })[0];
            }

            if (img.length) {
                console.warn(img, img.length, "No images found! Can't build the thumb list. If you don't need thumbs, set showThumbs={false} in the Carousel");
                return null;
            }

            return React.createElement(
                'li',
                { key: index, ref: function ref(node) {
                        return _this2["thumb" + index] = node;
                    }, className: itemClass,
                    onClick: _this2.handleClickItem.bind(_this2, index, item) },
                img
            );
        });
    },
    render: function render() {
        var _this3 = this;

        if (!this.props.children) {
            return null;
        }

        // show left arrow?
        var hasPrev = this.showArrows && this.state.firstItem > 0;
        // show right arrow
        var hasNext = this.showArrows && this.state.firstItem < this.lastPosition;
        // obj to hold the transformations and styles
        var itemListStyles = {};

        var currentPosition = -this.state.firstItem * this.itemSize + 'px';

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

        return React.createElement(
            'div',
            { className: klass.CAROUSEL(false) },
            React.createElement(
                'div',
                { className: klass.WRAPPER(false), ref: function ref(node) {
                        return _this3.itemsWrapper = node;
                    } },
                React.createElement('button', { type: 'button', className: klass.ARROW_PREV(!hasPrev), onClick: this.slideRight }),
                React.createElement(
                    Swipe,
                    { tagName: 'ul',
                        selectedItem: this.state.selectedItem,
                        className: klass.SLIDER(false, this.state.swiping),
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
                React.createElement('button', { type: 'button', className: klass.ARROW_NEXT(!hasNext), onClick: this.slideLeft })
            )
        );
    }
});