/** @jsx React.DOM */
var React = require('react/addons');
var klass = require('../cssClasses');
var outerWidth = require('../dimensions').outerWidth;
var has3d = require('../has3d')();

var addClass = (el, className) => {
	if (el.classList)
	  el.classList.add(className);
	else
	  el.className += ' ' + className;
}

var removeClass = (el, className) => {
	if (el.classList)
	  el.classList.remove(className);
	else
	  el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
}

// touch / swipe lib
var Hammer = require('hammerjs');

module.exports = React.createClass({

	currentPosition: 0, 
	position: null,
	touchStart: null, 

	propsTypes: {
		items: React.PropTypes.array.isRequired
	},

	getDefaultProps () {
		return {
			selectedItem: 0,
			// Carousel is the default type
			type: 'carousel'
		}
	}, 

	getInitialState () {
		return {
			// index of the image to be shown.
			selectedItem: this.props.selectedItem,

			// Index of the thumb that will appear first.
			// If you are using type = slider, this has 
			// the same value of the selected item.
			firstItem: 0
		}
	}, 

	componentWillMount() {
        window.addEventListener("resize", this.updateDimensions);
    },

	componentWillUnmount() {
		window.removeEventListener("resize", this.updateDimensions);
    },

	componentWillReceiveProps (props, state) {
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

	componentDidMount (nextProps) {
		// when the component is rendered we need to calculate 
		// the container size to adjust the responsive behaviour
		this.updateDimensions();

		var el = this.refs.itemList.getDOMNode();

		var self = this;

		var handleStart = (e) => {
			console.log(e.touches[0]);
			self.touchStart = e.touches[0].pageX;
			addClass(el, 'swiping');
		}
		
		var handleMove = (e) => {
			var delta = e.touches[0].pageX - self.touchStart;
			var position = this.currentPosition + delta;

			console.log(this.currentPosition, delta);

			
			self.position = delta;

			this.onSwipeMove({
				position: position
			})
		}

		var handleEnd = (e) => {
			var position = self.position;

			console.log('touchend', position)
			// left
			if (position < 0) {
				this.slideLeft();
			} else {
				this.slideRight();
			}

			self.position = null;
			self.touchStart = null;
			removeClass(el, 'swiping');
		}

		el.addEventListener('touchstart', handleStart);
		el.addEventListener('touchmove', handleMove);
		el.addEventListener('touchend', handleEnd);
	}, 

	updateDimensions () {
		this.calculateSpace(this.props.items.length);
		
		// the component should be rerended after calculating space
		this.forceUpdate();
	},

	// Calculate positions for carousel
	calculateSpace (total) {
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

	handleClickItem (index, item) {
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

	triggerOnChange (item) {
		var handler = this.props.onChange;

		if (typeof handler === 'function') {
			handler(item);
		}	
	}, 

	slideRight (){
		this.moveTo(this.state.firstItem - 1)
	},

	slideLeft (){
		this.moveTo(this.state.firstItem + 1)
	},

	onSwipeMove (e) {
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
			].forEach((propertie) => elementStyle[propertie] = 'translate3d(' + e.position + 'px, 0, 0)');
		} else {
			elementStyle.left = e.position + 'px';
		}
	},

	onSwipeEnd (e) {
		this.moveTo(e.index);
	},

	moveTo (position) {
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


	getTotalWidth () {
		if (this.isMounted()) {
			return this.lastElementPosition + outerWidth(this.lastElement.getDOMNode());
		} else {
			return 'auto';
		}
	},

	getNextPosition () {
		if (this.isMounted()) {
			var nextPosition = this.refs['item' + this.state.firstItem].getDOMNode().offsetLeft;
			return - nextPosition;	
		} else {
			return 0;
		}
	},

	changeItem (e) {
		var newIndex = e.target.value;
		this.setState({
			selectedItem: newIndex,
			firstItem: newIndex
		})
	},

	renderItems () {
		var isSlider = (this.props.type === "slider");

		return this.props.items.map((item, index) => {
			var itemClass = klass.ITEM(isSlider, index, this.state.selectedItem);
			var imageSchema = {};
			
			return (
				<li key={index} ref={"item" + index} className={itemClass}
					style={{width: this.isSlider && this.itemSize}} 
					onClick={ this.handleClickItem.bind(this, index, item) }>
					<img src={item.url} />
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
				{this.props.items.map( (item, index) => {
					return <li className={klass.DOT(index === this.state.selectedItem)} onClick={this.changeItem} value={index} />;
				})}
			</ul>
		);
	},

	renderStatus () {
		if (!this.props.showStatus) {
			return null
		}
		return <p className="carousel-status">{this.state.selectedItem} of {this.props.items.length}</p>;
	}, 

	render () {
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

		this.currentPosition = this.getNextPosition();

		itemListStyles.width = this.itemSize * total;
		
		var itemListProps = {
			className: klass.SLIDER(isSlider),
			style: itemListStyles
		}
	
		return (
			<div className={klass.CAROUSEL(isSlider)}>
				<button className={klass.ARROW_LEFT(!hasPrev)} onClick={this.slideRight} />
				
				<div className={klass.WRAPPER(isSlider)} ref="itemsWrapper">
					<ul {...itemListProps} ref="itemList">
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

