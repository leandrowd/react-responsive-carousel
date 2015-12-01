var React = require('react');
var klass = require('../cssClasses');
var outerWidth = require('../dimensions').outerWidth;
var has3d = require('../has3d')();
var Swipe = require('./Swipe');

// TODO: Remove states

module.exports = React.createClass({
    
    propsTypes: {
        children: React.PropTypes.element.isRequired,
        selectedItem: React.PropTypes.number
    },

    getDefaultProps () {
        return {
            selectedItem: 0
        }
    }, 

    getInitialState () {
        return {
            // index of the image to be shown.
            selectedItem: this.props.selectedItem,
            hasMount: false,

            // Index of the thumb that will appear first.
            // If you are using type = slider, this has 
            // the same value of the selected item.
            firstItem: this.props.selectedItem
        }
    }, 

    componentWillMount() {
        // as the widths are calculated, we need to resize 
        // the carousel when the window is resized
        window.addEventListener("resize", this.updateDimensions);
        // issue #2 - image loading smaller
        window.addEventListener("DOMContentLoaded", this.updateDimensions);
    },

    componentWillUnmount() {
        // removing listeners
        window.removeEventListener("resize", this.updateDimensions);
        window.removeEventListener("DOMContentLoaded", this.updateDimensions);
    },

    componentWillReceiveProps (props, state) {
        if (props.selectedItem !== this.state.firstItem) {
            this.setState({
                selectedItem: props.selectedItem,
                firstItem: this.getFirstItem(props.selectedItem)
            });
        }
    },

    componentDidMount (nextProps) {
        // when the component is rendered we need to calculate 
        // the container size to adjust the responsive behaviour
        this.updateDimensions();

        var defaultImg = this.refs.itemImg0;
        defaultImg.addEventListener('load', this.setMountState);
    },

    setMountState: function() {
        this.setState({hasMount: true});
    },

    updateDimensions () {
        this.calculateSpace(this.props.children.length);
        // the component should be rerended after calculating space
        this.forceUpdate();
    },

    // Calculate positions for carousel
    calculateSpace (total) {
        total = total || this.props.children.length;
        
        this.wrapperSize = this.refs.itemsWrapper.clientWidth;
        this.itemSize = outerWidth(this.refs.item0);
        this.visibleItems = Math.floor(this.wrapperSize / this.itemSize);   
        
        // exposing variables to other methods on this component
        this.showArrows = this.visibleItems < total;
        
        // Index of the last visible element that can be the first of the carousel
        this.lastPosition = total - this.visibleItems;
    }, 

    getFirstItem (selectedItem) {
        if (!this.showArrows) {
            return 0;
        }

        return selectedItem >= this.lastPosition ? this.lastPosition : selectedItem;
    },

    handleClickItem (index, item) {
        var handler = this.props.onSelectItem;

        if (typeof handler === 'function') {
            handler(index, item);
        }   
    },

    triggerOnChange (item) {
        var handler = this.props.onChange;

        if (typeof handler === 'function') {
            handler(item);
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
        var list = this.refs.itemList;
        var wrapperSize = list.clientWidth;
        var visibleItems = Math.floor(wrapperSize / this.itemSize);   

        var currentPosition = - this.props.firstItem * this.itemSize;   
        var lastLeftBoundry = - this.visibleItems * this.itemSize;


        // prevent user from swiping left out of boundaries
        if (currentPosition === leftBoundry && deltaX > 0) {
            deltaX = 0;
        }
        
        // prevent user from swiping right out of boundaries
        if (currentPosition === lastLeftBoundry && deltaX < 0) {
            deltaX = 0;
        }

        var position = currentPosition + (100 / (wrapperSize / deltaX)) + '%';

        console.log(this.refs, list);

        // if 3d isn't available we will use left to move
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
        this.moveTo(this.state.firstItem - (typeof positions === 'Number' ? positions : 1));
    },

    slideLeft (positions){
        this.moveTo(this.state.firstItem + (typeof positions === 'Number' ? positions : 1));
    },

    moveTo (position) {
        // position can't be lower than 0
        position = position < 0 ? 0 : position;
        // position can't be higher than last postion
        position = position >= this.lastPosition ? this.lastPosition : position;
        
        this.selectItem({
            firstItem: this.getFirstItem(position),
            // if it's not a slider, we don't need to set position here
            selectedItem: this.state.selectedItem
        });
    },

    selectItem (state) {
        this.setState(state);
        this.triggerOnChange(state.selectedItem);
    },

    renderItems () {
        return this.props.children.map((item, index) => {
            var hasMount = this.state.hasMount;
            var itemClass = klass.ITEM(false, index, this.state.selectedItem, hasMount);
            
            return (
                <li key={index} ref={"item" + index} className={itemClass}
                    onClick={ this.handleClickItem.bind(this, index, item) }>
                    <img src={item.props.src} ref={"itemImg" + index}/>
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

