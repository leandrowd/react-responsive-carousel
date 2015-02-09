/** @jsx React.DOM */
var React = require('react/addons');
var klass = require('../cssClasses');
var outerWidth = require('../dimensions').outerWidth;
var has3d = require('../has3d')();

// helper lib to do the swipe work
var Finger = require('ainojs-finger');

module.exports = React.createClass({displayName: "exports",
	
	propsTypes: {
		items: React.PropTypes.array.isRequired
	},

	getDefaultProps:function () {
		return {
			selectedItem: 0,
			// Carousel is the default type
			type: 'carousel'
		}
	}, 

	getInitialState:function () {
		return {
			// index of the image to be shown.
			selectedItem: this.props.selectedItem,

			// Index of the thumb that will appear first.
			// If you are using type = slider, this has 
			// the same value of the selected item.
			firstItem: 0
		}
	}, 

	componentWillMount:function() {
        window.addEventListener("resize", this.updateDimensions);
    },

	componentWillUnmount:function() {
		window.removeEventListener("resize", this.updateDimensions);
        
        // unbinding swipe component
		if (this.isSlider) {
			this.finger.off('frame', this.onSwipeMove);
			this.finger.off('complete', this.onSwipeEnd);
			this.finger.destroy();
		}

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

		// swipe is only applied to slider because the of the current lib
		// TODO: implement the swipe behaviour for the carousel too.
		if (this.isSlider) {
			var finger = new Finger(this.refs.itemsWrapper.getDOMNode());
			
			// this was breaking the tests, some weird behaviour of jest
			if ('on' in finger) {
				finger.on('frame', this.onSwipeMove);
				finger.on('complete', this.onSwipeEnd);
			}

			this.finger = finger;
		}
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
		
		this.lastElement = this.refs['item' + (total - 1)];//.getDOMNode();
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

	slideRight:function (){
		this.moveTo(this.state.firstItem - 1)
	},

	slideLeft:function (){
		this.moveTo(this.state.firstItem + 1)
	},

	onSwipeMove:function (e) {
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
			].forEach(function(propertie)  {return elementStyle[propertie] = 'translate3d(' + e.position + 'px, 0, 0)';});
		} else {
			elementStyle.left = e.position + 'px';
		}
	},

	onSwipeEnd:function (e) {
		this.moveTo(e.index);
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
		if (this.isMounted()) {
			return this.lastElementPosition + outerWidth(this.lastElement.getDOMNode());
		} else {
			return 'auto';
		}
	},

	getNextPosition:function () {
		if (this.isMounted()) {
			var nextPosition = this.refs['item' + this.state.firstItem].getDOMNode().offsetLeft;
			return - nextPosition;	
		} else {
			return 0;
		}
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
			var itemClass = klass.ITEM(isSlider, index, this.state.selectedItem);
			var imageSchema = {};
			
			return (
				React.createElement("li", {key: index, ref: "item" + index, className: itemClass, 
					style: {width: this.isSlider && this.itemSize}, 
					onClick:  this.handleClickItem.bind(this, index, item) }, 
					React.createElement("img", {src: item.url})
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
					return React.createElement("li", {className: klass.DOT(index === this.state.selectedItem), onClick: this.changeItem, value: index});
				}.bind(this))
			)
		);
	},

	renderStatus:function () {
		if (!this.props.showStatus) {
			return null
		}
		return React.createElement("p", {className: "carousel-status"}, this.state.selectedItem, " of ", this.props.items.length);
	}, 

	render:function () {
		if (this.props.items.length === 0) {
			return null;
		}
		
		var total = this.props.items.length;
		var showArrows = this.visibleItems < total;
		var isSlider = (this.props.type === "slider");

		var hasPrev = showArrows && this.state.firstItem > 0;
		var hasNext = showArrows && this.state.firstItem < this.lastPosition;
		
				
		var itemListStyles = {};
		// if 3d isn't available we will use left to move
		if (has3d) {
			var transformProp = 'translate3d(' + this.getNextPosition() + 'px, 0, 0)';
			itemListStyles = {
				'WebkitTransform': transformProp,
				   'MozTransform': transformProp,
				    'MsTransform': transformProp,
				     'OTransform': transformProp,
				      'transform': transformProp,
				    'msTransform': transformProp
			}
		} else {
			itemListStyles = {
				left: this.getNextPosition()
			}
		}

		itemListStyles.width = this.itemSize * total;
		
		var itemListProps = {
			className: klass.SLIDER(isSlider),
			style: itemListStyles
		}
	
		return (
			React.createElement("div", {className: klass.CAROUSEL(isSlider)}, 
				React.createElement("button", {className: klass.ARROW_LEFT(!hasPrev), onClick: this.slideRight}), 
				
				React.createElement("div", {className: klass.WRAPPER(isSlider), ref: "itemsWrapper"}, 
					React.createElement("ul", React.__spread({},  itemListProps, {ref: "itemList"}), 
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

