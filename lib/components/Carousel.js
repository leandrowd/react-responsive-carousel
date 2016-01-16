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

    getDefaultProps:function () {
        return {
            showIndicators: true,
            showArrows: true,
            showStatus:true,
            showThumbs:true,
            selectedItem: 0,
            axis: 'horizontal'
        }
    }, 

    getInitialState:function () {
        return {
            // index of the image to be shown.
            selectedItem: this.props.selectedItem,
            hasMount: false
        }
    }, 

    componentWillReceiveProps:function (props, state) {
        if (props.selectedItem !== this.state.selectedItem) {
            this.updateSizes();
            this.setState({
                selectedItem: props.selectedItem
            });
        }
    },

    componentWillMount:function() {
        // as the widths are calculated, we need to resize 
        // the carousel when the window is resized
        window.addEventListener("resize", this.updateSizes);
        // issue #2 - image loading smaller
        window.addEventListener("DOMContentLoaded", this.updateSizes);
    },

    componentWillUnmount:function() {
        // removing listeners
        window.removeEventListener("resize", this.updateSizes);
        window.removeEventListener("DOMContentLoaded", this.updateSizes);
    },

    componentDidMount:function (nextProps) {
        // when the component is rendered we need to calculate 
        // the container size to adjust the responsive behaviour
        this.updateSizes();

        this.isHorizontal = this.props.axis === 'horizontal';
        
        var defaultImg = ReactDOM.findDOMNode(this.item0).getElementsByTagName('img')[0];
        defaultImg.addEventListener('load', this.setMountState);
    },

    updateSizes:function () {
        var firstItem = ReactDOM.findDOMNode(this.item0);
        this.itemSize = this.isHorizontal ? firstItem.clientWidth : firstItem.clientHeight;
        this.wrapperSize = this.isHorizontal ? this.itemSize * this.props.children.length : this.itemSize;
    },

    setMountState:function () {
        this.setState({hasMount: true});
        this.updateSizes();
        this.forceUpdate();
    },

    handleClickItem:function (index, item) {
        var handler = this.props.onClickItem;

        if (typeof handler === 'function') {
            handler(index, item);
        }   

        if (index !== this.state.selectedItem) {
            this.setState({
                selectedItem: index,
            });
        }
    }, 

    handleOnChange:function (index, item) {
        var handler = this.props.onChange;

        if (typeof handler === 'function') {
            handler(index, item);
        }   
    }, 

    handleClickThumb:function(index, item) {
        var handler = this.props.onClickThumb;

        if (typeof handler === 'function') {
            handler(index, item);
        }

        this.selectItem({
            selectedItem: index
        });
    },

    onSwipeStart:function() {
        this.setState({
            swiping: true
        });
    },

    onSwipeEnd:function() {
        this.setState({
            swiping: false
        });
    },

    onSwipeMove:function(delta) {
        var list = ReactDOM.findDOMNode(this.itemList);
        var isHorizontal = this.props.axis === 'horizontal';
        
        var initialBoundry = 0;

        var currentPosition = - this.state.selectedItem * 100; 
        var finalBoundry = - (this.props.children.length - 1) * 100;

        var axisDelta = isHorizontal ? delta.x : delta.y;

        // prevent user from swiping left out of boundaries
        if (currentPosition === initialBoundry && axisDelta > 0) {
            axisDelta = 0;
        }
        
        // prevent user from swiping right out of boundaries
        if (currentPosition === finalBoundry && axisDelta < 0) {
            axisDelta = 0;
        }

        var position = currentPosition + (100 / (this.wrapperSize / axisDelta)) + '%';
        
        [
            'WebkitTransform',
            'MozTransform',
            'MsTransform',
            'OTransform',
            'transform',
            'msTransform'
        ].forEach(function(prop)  {
            list.style[prop] = CSSTranslate(position, this.props.axis);
        }.bind(this));
    },

    decrement:function (positions){
        this.moveTo(this.state.selectedItem - (typeof positions === 'Number' ? positions : 1));
    },

    increment:function (positions){
        this.moveTo(this.state.selectedItem + (typeof positions === 'Number' ? positions : 1));
    },

    moveTo:function (position) {
        // position can't be lower than 0
        position = position < 0 ? 0 : position;
        // position can't be higher than last postion
        position = position >= this.props.children.length - 1 ? this.props.children.length - 1 : position;
        
        this.selectItem({
            // if it's not a slider, we don't need to set position here
            selectedItem: position
        });
    },

    changeItem:function (e) {
        var newIndex = e.target.value;

        this.selectItem({
            selectedItem: newIndex
        });
    },
    
    selectItem:function (state) {
        this.setState(state);
        this.handleOnChange(state.selectedItem, this.props.children[state.selectedItem]);
    },

    renderItems:function () {
        return React.Children.map(this.props.children, function(item, index)  {
            var hasMount = this.state.hasMount;
            var itemClass = klass.ITEM(true, index === this.state.selectedItem);
            
            return (
                React.createElement("li", {ref: function(node)  {return this["item" + index] = node;}.bind(this), key: "itemKey" + index, className: itemClass, 
                    onClick:  this.handleClickItem.bind(this, index, item) }, 
                    item 
                )
            );
        }.bind(this));
    },

    renderControls:function () {
        if (!this.props.showIndicators) {
            return null
        }
        
        return (
            React.createElement("ul", {className: "control-dots"}, 
                React.Children.map(this.props.children, function(item, index)  {
                    return React.createElement("li", {className: klass.DOT(index === this.state.selectedItem), onClick: this.changeItem, value: index, key: index});
                }.bind(this))
            )
        );
    },

    renderStatus:function () {
        if (!this.props.showStatus) {
            return null
        }

        return React.createElement("p", {className: "carousel-status"}, this.state.selectedItem + 1, " of ", this.props.children.length);
    }, 

    renderThumbs:function () {
        if (!this.props.showThumbs) {
            return null
        }

        return (
            React.createElement(Thumbs, {onSelectItem: this.handleClickThumb, selectedItem: this.state.selectedItem}, 
                this.props.children
            )
        );
    }, 

    render:function () {
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

        var currentPosition = - this.state.selectedItem * 100 + '%';   
        
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
            ref: function(node)  {return this.itemList = node;}.bind(this)
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

        return (
            React.createElement("div", {className: this.props.className}, 
                React.createElement("div", {className: klass.CAROUSEL(true)}, 
                    React.createElement("button", {className: klass.ARROW_PREV(!hasPrev), onClick: this.decrement}), 
                    React.createElement("div", {className: klass.WRAPPER(true, this.props.axis), style: containerStyles, ref: function(node)  {return this.itemsWrapper = node;}.bind(this)}, 
                        React.createElement(Swipe, React.__spread({tagName: "ul"},  swiperProps), 
                             this.renderItems() 
                        )
                    ), 
                    React.createElement("button", {className: klass.ARROW_NEXT(!hasNext), onClick: this.increment}), 
                    
                     this.renderControls(), 
                     this.renderStatus() 
                ), 
                 this.renderThumbs() 
            )               
        );
        
    }
});

