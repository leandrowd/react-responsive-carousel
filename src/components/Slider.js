var React = require('react');
var ReactDOM = require('react-dom');
var klass = require('../cssClasses');
var has3d = require('../has3d')();
var Thumbs = require('./Thumbs-2');
var Swipe = require('./Swipe');

// TODO: Remove states

function translateStyles(position, axis) {
    var positionCss;
    var transitionProp = has3d ? 'translate3d' : 'translate';

    if (axis === 'horizontal') {
        positionCss = '(' + position + ', 0, 0)';
    } else {
        positionCss = '(0, ' + position + ', 0)';
    }

    return transitionProp + positionCss;
}

module.exports = React.createClass({
    
    propsTypes: {
        children: React.PropTypes.element.isRequired,
        showArrows: React.PropTypes.bool,
        showStatus: React.PropTypes.bool,
        showIndicators: React.PropTypes.bool,
        showThumbs: React.PropTypes.bool,
        selectedItem: React.PropTypes.number,
        axis: React.PropTypes.string
    },

    getDefaultProps () {
        return {
            showIndicators: true,
            showArrows: true,
            showStatus:true,
            showThumbs:true,
            selectedItem: 0,
            axis: 'horizontal'
        }
    }, 

    getInitialState () {
        return {
            // index of the image to be shown.
            selectedItem: this.props.selectedItem,
            hasMount: false
        }
    }, 

    componentWillReceiveProps (props, state) {
        if (props.selectedItem !== this.state.selectedItem) {
            this.updateStatics();
            this.setState({
                selectedItem: props.selectedItem
            });
        }
    },

    componentWillMount() {
        // as the widths are calculated, we need to resize 
        // the carousel when the window is resized
        window.addEventListener("resize", this.updateStatics);
        // issue #2 - image loading smaller
        window.addEventListener("DOMContentLoaded", this.updateStatics);
    },

    componentWillUnmount() {
        // removing listeners
        window.removeEventListener("resize", this.updateStatics);
        window.removeEventListener("DOMContentLoaded", this.updateStatics);
    },

    componentDidMount (nextProps) {
        // when the component is rendered we need to calculate 
        // the container size to adjust the responsive behaviour
        this.updateStatics();

        this.isHorizontal = this.props.axis === 'horizontal';

        var defaultImg = ReactDOM.findDOMNode(this.refs.item0).getElementsByTagName('img')[0];
        defaultImg.addEventListener('load', this.setMountState);
    },

    updateStatics () {
        var firstItem = ReactDOM.findDOMNode(this.refs.item0);
        this.itemSize = this.isHorizontal ? firstItem.clientWidth : firstItem.clientHeight;
        this.wrapperSize = this.isHorizontal ? this.itemSize * this.props.children.length : this.itemSize;
    },

    setMountState () {
        this.setState({hasMount: true});
        this.updateStatics();
        this.forceUpdate();
    },

    handleClickItem (index, item) {
        var handler = this.props.onSelectItem;

        if (typeof handler === 'function') {
            handler(index, item);
        }   

        if (index !== this.state.selectedItem) {
            this.setState({
                selectedItem: index,
            });
        }
    }, 

    triggerOnChange (index, item) {
        var handler = this.props.onChange;

        if (typeof handler === 'function') {
            handler(index, item);
        }   
    }, 

    onSwipeStart() {
        this.setState({
            swiping: true
        });
    },

    onSwipeEnd() {
        this.setState({
            swiping: false
        });
    },

    onSwipeMove(delta) {
        var list = ReactDOM.findDOMNode(this.refs.itemList);
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
        ].forEach((prop) => {
            list.style[prop] = translateStyles(position, this.props.axis);
        });
    },

    decrement (positions){
        this.moveTo(this.state.selectedItem - (typeof positions === 'Number' ? positions : 1));
    },

    increment (positions){
        this.moveTo(this.state.selectedItem + (typeof positions === 'Number' ? positions : 1));
    },

    moveTo (position) {
        // position can't be lower than 0
        position = position < 0 ? 0 : position;
        // position can't be higher than last postion
        position = position >= this.props.children.length ? this.props.children.length : position;
        
        this.selectItem({
            // if it's not a slider, we don't need to set position here
            selectedItem: position
        });
    },

    changeItem (e) {
        var newIndex = e.target.value;

        this.selectItem({
            selectedItem: newIndex
        });
    },

    selectItem (state) {
        this.setState(state);
        this.triggerOnChange(state.selectedItem, this.props.children[state.selectedItem]);
    },

    onThumbClick(index) {
        this.selectItem({
            selectedItem: index
        });
    },

    renderItems () {
        return React.Children.map(this.props.children, (item, index) => {
            var hasMount = this.state.hasMount;
            var itemClass = klass.ITEM(true, index === this.state.selectedItem);
            
            return (
                <li key={index} ref={"item" + index} key={"itemKey" + index} className={itemClass}
                    onClick={ this.handleClickItem.bind(this, index, item) }>
                    { item }
                </li>
            );
        });
    },

    renderControls () {
        if (!this.props.showIndicators) {
            return null
        }
        
        return (
            <ul className="control-dots">
                {React.Children.map(this.props.children, (item, index) => {
                    return <li className={klass.DOT(index === this.state.selectedItem)} onClick={this.changeItem} value={index} key={index} />;
                })}
            </ul>
        );
    },

    renderStatus () {
        if (!this.props.showStatus) {
            return null
        }

        return <p className="carousel-status">{this.state.selectedItem + 1} of {this.props.children.length}</p>;
    }, 

    renderThumbs () {
        if (!this.props.showThumbs) {
            return null
        }

        return (
            <Thumbs onSelectItem={this.onThumbClick} selectedItem={this.state.selectedItem}>
                {this.props.children}
            </Thumbs>
        );
    }, 

    render () {
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
        var transformProp = translateStyles(currentPosition, this.props.axis);
        
        itemListStyles = {
            'WebkitTransform': transformProp,
               'MozTransform': transformProp,
                'MsTransform': transformProp,
                 'OTransform': transformProp,
                  'transform': transformProp,
                'msTransform': transformProp,
                     'height': this.itemSize
        };

        var swiperProps = {
            selectedItem: this.state.selectedItem,
            className: klass.SLIDER(true, this.state.swiping),
            onSwipeMove: this.onSwipeMove,
            onSwipeStart: this.onSwipeStart,
            onSwipeEnd: this.onSwipeEnd,
            style: itemListStyles,
            ref: "itemList"
        };

        if (this.isHorizontal) {
            Object.assign(swiperProps, {
                onSwipeLeft: this.increment,
                onSwipeRight: this.decrement
            });
        } else {
            Object.assign(swiperProps, {
                onSwipeUp: this.decrement,
                onSwipeDown: this.increment
            });
        }

        return (
            <div className={this.props.className}>
                <div className={klass.CAROUSEL(true)}>
                    <button className={klass.ARROW_PREV(!hasPrev)} onClick={this.decrement} />
                    <div className={klass.WRAPPER(true, this.props.axis)} style={{height: this.itemSize}} ref="itemsWrapper">
                        <Swipe tagName="ul" {...swiperProps}>
                            { this.renderItems() }
                        </Swipe>
                    </div>
                    <button className={klass.ARROW_NEXT(!hasNext)} onClick={this.increment} />
                    
                    { this.renderControls() }
                    { this.renderStatus() }
                </div> 
                { this.renderThumbs() }
            </div>               
        );
        
    }
});

