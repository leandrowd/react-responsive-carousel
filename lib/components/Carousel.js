var React = require('react/addons');
var klass = require('../cssClasses');
var outerWidth = require('../dimensions').outerWidth;
var has3d = require('../has3d')();

module.exports = React.createClass({displayName: "exports",
	
	propsTypes: {
		items: React.PropTypes.array.isRequired
	},

	getDefaultProps:function () {
		return {
			selectedItem: 0,
			// Carousel is the default type. It stands for a group of thumbs.
			// It also accepts 'slider', which will show a full width item 
			type: 'carousel'
		}
	}, 

	getInitialState:function () {
		return {
			// index of the image to be shown.
			selectedItem: this.props.selectedItem,
            hasMount: false,

			// Index of the thumb that will appear first.
			// If you are using type = slider, this has 
			// the same value of the selected item.
			firstItem: 0
		}
	}, 

	statics: {
		// current position is needed to calculate the right delta
		currentPosition: 0,
		// touchPosition is a temporary var to decide what to do on touchEnd
		touchPosition: null
	},

	componentWillMount:function() {
		// as the widths are calculated, we need to resize 
		// the carousel when the window is resized
		window.addEventListener("resize", this.updateDimensions);
		// issue #2 - image loading smaller
		window.addEventListener("DOMContentLoaded", this.updateDimensions);
    },

	componentWillUnmount:function() {
		// removing listeners
		window.removeEventListener("resize", this.updateDimensions);
		window.removeEventListener("DOMContentLoaded", this.updateDimensions);
    },

	componentWillReceiveProps:function (props, state) {
		if (props.selectedItem !== this.state.selectedItem) {
			var firstItem = props.selectedItem;
			
			if (props.selectedItem >= this.lastPosition) {
				firstItem =  this.lastPosition;
			} 

			if (!this.showArrows) {
				firstItem = 0;
			}

			this.setState({
				selectedItem: props.selectedItem,
				firstItem: firstItem
			});
		}
	},

	componentDidMount:function (nextProps) {
		// when the component is rendered we need to calculate 
		// the container size to adjust the responsive behaviour
		this.updateDimensions();

		// adding swipe events
		var el = this.refs.itemList.getDOMNode();
		el.addEventListener('touchstart', this.onSwipeStart);
		el.addEventListener('touchmove', this.onSwipeMove);
		el.addEventListener('touchend', this.onSwipeEnd);

		if (!this.isSlider) {
			var defaultImgIndex = 0;
			var defaultImg = this.refs['itemImg' + defaultImgIndex].getDOMNode();
			defaultImg.addEventListener('load', this.setMountState);
		}
	},

    setMountState: function() {
        this.setState({hasMount: true});
	},

	updateDimensions:function () {
		this.calculateSpace(this.props.items.length);
		// the component should be rerended after calculating space
		this.forceUpdate();
	},

	// Calculate positions for carousel
	calculateSpace:function (total) {
		total = total || this.props.items.length;
		this.isSlider = this.props.type === "slider";
		
		this.wrapperSize = this.refs.itemsWrapper.getDOMNode().clientWidth;
		this.itemSize = this.isSlider ? this.wrapperSize : outerWidth(this.refs.item0.getDOMNode());
		this.visibleItems = Math.floor(this.wrapperSize / this.itemSize);	
		
		this.lastElement = this.refs['item' + (total - 1)];
		this.lastElementPosition = this.itemSize * total;
		
		// exposing variables to other methods on this component
		this.showArrows = this.visibleItems < total;
		
		// Index of the last visible element that can be the first of the carousel
		this.lastPosition = (total - this.visibleItems);
	}, 

	handleClickItem:function (index, item) {
		var handler = this.props.onSelectItem;

		if (typeof handler === 'function') {
			handler(index, item);
		}	

		if (index !== this.state.selectedItem) {
			this.setState({
				selectedItem: index
			});
		}
	}, 

	triggerOnChange:function (item) {
		var handler = this.props.onChange;

		if (typeof handler === 'function') {
			handler(item);
		}	
	}, 

	// touch start
	onSwipeStart:function (e) {
		this.setState({
			// saving the initial touch 
			touchStart: e.touches[0].pageX,
			// setting the swiping state
			swiping: true
		})
	},

	onSwipeMove:function (e) {
		// getting the current delta
		var delta = e.touches[0].pageX - this.state.touchStart;
        var leftBoundry = 0;
        var lastLeftBoundry = - this.itemSize * (this.props.items.length - 1);

        //if the first image meets the left boundry, prevent user from swiping left
        if (this.currentPosition === leftBoundry && delta > 0) {
            delta = 0;
        }
        //if the last image meets the left boundry, prevent user from swiping right
        if (this.currentPosition === lastLeftBoundry && delta < 0) {
            delta = 0;
        }
		// real position
		var position = this.currentPosition + delta;
		// adding it to the last position and saving the position
		this.touchPosition = delta;

		var elementStyle = this.refs.itemList.getDOMNode().style;

		// if 3d isn't available we will use left to move
		if (has3d) {
			[
				'WebkitTransform',
				'MozTransform',
				'MsTransform',
				'OTransform',
				'transform',
				'msTransform'
			].forEach(function(prop)  {return elementStyle[prop] = 'translate3d(' + position + 'px, 0, 0)';});
		} else {
			elementStyle.left = position + 'px';
		}
	},

	onSwipeEnd:function (e) {
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
                if (this.touchPosition === 0) {
                    /* prevent users from swipe right on the first image
                       but it goes to the opposite direction, as the delta is alwsys 0
                       when swipe right on the first image.
                       also prevent users from swipe left on the last image from the same reason.
                    */
                } else if (this.touchPosition < 0) {
                    // less than 0 means that it's going left
                    this.slideLeft();
                } else if (this.touchPosition > 0) {
                    this.slideRight();
                }
				// discard the position
				this.touchPosition = null;	
			}.bind(this)
		);	
	},

	slideRight:function (){
		this.moveTo(this.state.firstItem - 1)
	},

	slideLeft:function (){
		this.moveTo(this.state.firstItem + 1)
	},

	moveTo:function (position) {
		// position can't be lower than 0
		position = position < 0 ? 0 : position;

		// position can't be higher than last postion
		position = position >= this.lastPosition ? this.lastPosition : position;
		
		this.setState({
			firstItem: position,
			// if it's not a slider, we don't need to set position here
			selectedItem: this.isSlider ? position : this.state.selectedItem
		});
		
		this.triggerOnChange(position);
	},


	getTotalWidth:function () {
		return this.itemSize * this.props.items.length || 'auto';
	},

	getNextPosition:function () {
		return - this.itemSize * this.state.firstItem || 0;
	},

	changeItem:function (e) {
		var newIndex = e.target.value;
		this.setState({
			selectedItem: newIndex,
			firstItem: newIndex
		})
	},

	renderItems:function () {
		var isSlider = (this.props.type === "slider");

		return this.props.items.map(function(item, index)  {
            var hasMount = this.state.hasMount;
			var itemClass = klass.ITEM(this.isSlider, index, this.state.selectedItem, hasMount);
			var imageSchema = {};
			
			return (
				React.createElement("li", {key: index, ref: "item" + index, className: itemClass, 
					style: {width: this.isSlider && this.itemSize}, 
					onClick:  this.handleClickItem.bind(this, index, item) }, 
					React.createElement("img", {src: item.url, ref: "itemImg" + index})
				)
			);
		}.bind(this));
					
	},

	renderControls:function () {
		if (!this.props.showControls) {
			return null
		}
		
		return (
			React.createElement("ul", {className: "control-dots"}, 
				this.props.items.map( function(item, index)  {
					return React.createElement("li", {className: klass.DOT(index === this.state.selectedItem), onClick: this.changeItem, value: index, key: index});
				}.bind(this))
			)
		);
	},

	renderStatus:function () {
		if (!this.props.showStatus) {
			return null
		}
		return React.createElement("p", {className: "carousel-status"}, this.state.selectedItem + 1, " of ", this.props.items.length);
	}, 

	render:function () {
		if (this.props.items.length === 0) {
			return null;
		}

		// show left arrow? 
		var hasPrev = this.showArrows && this.state.firstItem > 0;
		// show right arrow
		var hasNext = this.showArrows && this.state.firstItem < this.lastPosition;
		// obj to hold the transformations and styles
		var itemListStyles = {};
		
		// hold the last position in the component context to calculate the delta on swiping
		this.currentPosition = this.getNextPosition();

		if (has3d) {
			// if 3d is available, let's take advantage of the performance of transform
			var transformProp = 'translate3d(' + this.currentPosition + 'px, 0, 0)';
			itemListStyles = {
				'WebkitTransform': transformProp,
				   'MozTransform': transformProp,
				    'MsTransform': transformProp,
				     'OTransform': transformProp,
				      'transform': transformProp,
				    'msTransform': transformProp,
				    	  'width': this.lastElementPosition
			}
		} else {
			// if 3d isn't available we will use left to move
			itemListStyles = {
				left: this.currentPosition,
				width: this.lastElementPosition
			}
		}
		
		return (
			React.createElement("div", {className: klass.CAROUSEL(this.isSlider)}, 
				React.createElement("button", {className: klass.ARROW_LEFT(!hasPrev), onClick: this.slideRight}), 
				
				React.createElement("div", {className: klass.WRAPPER(this.isSlider), ref: "itemsWrapper"}, 
					React.createElement("ul", {className: klass.SLIDER(this.isSlider, this.state.swiping), style: itemListStyles, ref: "itemList"}, 
						 this.renderItems() 
					)
				), 

				React.createElement("button", {className: klass.ARROW_RIGHT(!hasNext), onClick: this.slideLeft}), 
				
				 this.renderControls(), 
				 this.renderStatus() 
			)
		);
		
	}
});

