var React = require('react');
var ReactDOM = require('react-dom');
var klass = require('../cssClasses');
var has3d = require('../has3d')();
var Swipe = require('./Swipe');

// TODO: Remove states

module.exports = React.createClass({
    
    propsTypes: {
        children: React.PropTypes.element.isRequired,
        showStatus: React.PropTypes.bool,
        showControls: React.PropTypes.bool,
        showThumbs: React.PropTypes.bool,
        selectedItem: React.PropTypes.number
    },

    getDefaultProps () {
        return {
            selectedItem: 0,
        }
    }, 

    getInitialState () {
        return {
            // index of the image to be shown.
            selectedItem: this.props.selectedItem
        }
    }, 

    componentWillReceiveProps (props, state) {
        if (props.selectedItem !== this.state.selectedItem) {
            this.setState({
                selectedItem: props.selectedItem
            });
        }
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

    onSwipeMove(deltaX) {
        var leftBoundry = 0;
        var list = ReactDOM.findDOMNode(this.refs.itemList);
        var wrapperSize = list.clientWidth;

        var currentPosition = - this.state.selectedItem * 100; 
        var lastLeftBoundry = - (this.props.children.length - 1) * 100;

        // prevent user from swiping left out of boundaries
        if (currentPosition === leftBoundry && deltaX > 0) {
            deltaX = 0;
        }
        
        // prevent user from swiping right out of boundaries
        if (currentPosition === lastLeftBoundry && deltaX < 0) {
            deltaX = 0;
        }

        var position = currentPosition + (100 / (wrapperSize / deltaX)) + '%';
        
        [
            'WebkitTransform',
            'MozTransform',
            'MsTransform',
            'OTransform',
            'transform',
            'msTransform'
        ].forEach((prop) => {
            list.style[prop] = has3d ? 'translate3d(' + position + ', 0, 0)' : 'translate(' + position + ', 0)';
        });
    },

    slideRight (positions){
        this.moveTo(this.state.selectedItem - (typeof positions === 'Number' ? positions : 1));
    },

    slideLeft (positions){
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


    renderItems () {
        return React.Children.map(this.props.children, (item, index) => {
            var hasMount = this.state.hasMount;
            var itemClass = klass.ITEM(false, index, this.state.selectedItem, hasMount);
            
            var img = item;

            if (item.type !== "img") {
                img = item.props.children.filter((children) => children.type === "img")[0];   
            }

            if (img.length) {
                console.log(img, img.length, "No images found! Can't build the thumb list");
            }
            
            return (
                <li key={index} ref={"item" + index} className={itemClass}
                    onClick={ this.handleClickItem.bind(this, index, item) }>
                    { img }
                </li>
            );
        });
    },

    render () {
        if (this.props.children.length === 0) {
            return null;
        }

        // show left arrow? 
        var hasPrev = this.showArrows && this.state.firstItem > 0;
        // show right arrow
        var hasNext = this.showArrows && this.state.firstItem < this.lastPosition;
        // obj to hold the transformations and styles
        var itemListStyles = {};

        var currentPosition = - this.state.firstItem * this.itemSize + 'px';    
        
        // if 3d is available, let's take advantage of the performance of transform
        var transformProp = has3d ? 'translate3d(' + currentPosition + ', 0, 0)' : 'translate(' + currentPosition + ', 0)';
        itemListStyles = {
            'WebkitTransform': transformProp,
               'MozTransform': transformProp,
                'MsTransform': transformProp,
                 'OTransform': transformProp,
                  'transform': transformProp,
                'msTransform': transformProp
        }

        return (
            <div className={klass.CAROUSEL(false)}>
                <div className={klass.WRAPPER(false)} ref="itemsWrapper">
                    <button className={klass.ARROW_LEFT(!hasPrev)} onClick={this.slideRight} />
                    <Swipe tagName="ul" 
                        selectedItem={this.state.selectedItem} 
                        className={klass.SLIDER(false, this.state.swiping)}
                        onSwipeLeft={this.slideLeft}
                        onSwipeRight={this.slideRight}
                        onSwipeMove={this.onSwipeMove}
                        onSwipeStart={this.onSwipeStart}
                        onSwipeEnd={this.onSwipeEnd}
                        style={itemListStyles} 
                        ref="itemList">
                        { this.renderItems() }
                    </Swipe>
                    <button className={klass.ARROW_RIGHT(!hasNext)} onClick={this.slideLeft} />
                </div>
            </div>             
        );
        
    }
});

