var React = require('react');
var klass = require('../cssClasses');
var outerWidth = require('../dimensions').outerWidth;
var has3d = require('../has3d')();

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

    statics: {
        // touchPosition is a temporary var to decide what to do on touchEnd
        touchPosition: null
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

    triggerOnChange (item) {
        var handler = this.props.onChange;

        if (typeof handler === 'function') {
            handler(item);
        }   
    }, 

    // touch start
    onSwipeStart (e) {
        this.setState({
            wrapperSize: this.refs.itemsWrapper.clientWidth,
            // saving the initial touch 
            touchStart: e.touches[0].pageX,
            // setting the swiping state
            swiping: true
        })
    },

    onSwipeMove (e) {
        // getting the current delta
        var delta = e.touches[0].pageX - this.state.touchStart;
        var leftBoundry = 0;

        var currentPosition;
        var lastLeftBoundry;

        currentPosition = - this.state.selectedItem * 100; 
        lastLeftBoundry = - (this.props.children.length - 1) * 100;

        //if the first image meets the left boundry, prevent user from swiping left
        if (currentPosition === leftBoundry && delta > 0) {
            delta = 0;
        }
        
        //if the last image meets the left boundry, prevent user from swiping right
        if (currentPosition === lastLeftBoundry && delta < 0) {
            delta = 0;
        }

        var position = currentPosition + (100 / (this.state.wrapperSize / delta)) + '%';

        // adding it to the last position and saving the position
        this.touchPosition = delta;

        var elementStyle = this.refs.itemList.style;

        // if 3d isn't available we will use left to move
        [
            'WebkitTransform',
            'MozTransform',
            'MsTransform',
            'OTransform',
            'transform',
            'msTransform'
        ].forEach((prop) => {
            elementStyle[prop] = has3d ? 'translate3d(' + position + ', 0, 0)' : 'translate(' + position + ', 0)';
        });
    },

    onSwipeEnd (e) {
        this.setState({
            // reset touchStart position
            touchStart: null,
            // finish the swiping state
            swiping: false
        }, 
            // this function is the callback of setState because we need to wait for the
            // state to be setted, so the swiping class will be removed and the 
            // transition to the next slide will be smooth
            function () {
                // number of positions to advance;
                var positions;

                if (this.touchPosition === 0) {
                    /* prevent users from swipe right on the first image
                       but it goes to the opposite direction, as the delta is alwsys 0
                       when swipe right on the first image.
                       also prevent users from swipe left on the last image from the same reason.
                    */
                } else {
                    // if it's a slider, positions is 1
                    positions = 1;                  
                } 

                if (this.touchPosition < 0) {
                    // less than 0 means that it's going left
                    this.slideLeft(positions);
                } else if (this.touchPosition > 0) {
                    this.slideRight(positions);
                }
                // discard the position
                this.touchPosition = null;  
            }.bind(this)
        );  
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
        })
    },

    selectItem (state) {
        this.setState(state);
        this.triggerOnChange(state.selectedItem);
    },

    renderItems () {
        return this.props.children.map((item, index) => {
            var hasMount = this.state.hasMount;
            var itemClass = klass.ITEM(true, index, this.state.selectedItem, hasMount);
            
            return (
                <li key={index} ref={"item" + index} className={itemClass}
                    onClick={ this.handleClickItem.bind(this, index, item) }>
                    <img src={item.props.src} ref={"itemImg" + index}/>
                </li>
            );
        });
                    
    },

    renderControls () {
        if (!this.props.showControls) {
            return null
        }
        
        return (
            <ul className="control-dots">
                {this.props.children.map( (item, index) => {
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

    render () {
        var itemsLength = this.props.children.length;

        if (itemsLength === 0) {
            return null;
        }

        var canShowArrows = itemsLength > 1;

        // show left arrow? 
        var hasPrev = canShowArrows && this.state.selectedItem > 0;
        // show right arrow
        var hasNext = canShowArrows && this.state.selectedItem < itemsLength - 1;
        // obj to hold the transformations and styles
        var itemListStyles = {};

        var currentPosition = - this.state.selectedItem * 100 + '%';   
        
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
            <div className={klass.CAROUSEL(true)}>
                <button className={klass.ARROW_LEFT(!hasPrev)} onClick={this.slideRight} />
                
                <div className={klass.WRAPPER(true)} ref="itemsWrapper">
                    <ul className={klass.SLIDER(true, this.state.swiping)} 
                        onTouchMove={this.onSwipeMove}
                        onTouchStart={this.onSwipeStart}
                        onTouchEnd={this.onSwipeEnd}
                        style={itemListStyles} 
                        ref="itemList">
                        { this.renderItems() }
                    </ul>
                </div>

                <button className={klass.ARROW_RIGHT(!hasNext)} onClick={this.slideLeft} />
                
                { this.renderControls() }
                { this.renderStatus() }
            </div>
        );
        
    }
});

