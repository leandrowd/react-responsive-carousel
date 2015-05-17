/** @jsx React.DOM */
var React = require('react/addons');
var klass = require('../cssClasses');
var outerWidth = require('../dimensions').outerWidth;
var has3d = require('../has3d')();

module.exports = React.createClass({
	
	propsTypes: {
		items: React.PropTypes.array.isRequired
	},

	getDefaultProps () {
		return {
			selectedItem: 0,
			// Carousel is the default type. It stands for a group of thumbs.
			// It also accepts 'slider', which will show a full width item 
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

	statics: {
		// current position is needed to calculate the right delta
		currentPosition: 0,
		// touchPosition is a temporary var to decide what to do on touchEnd
		touchPosition: null
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

		// adding swipe events
		var el = this.refs.itemList.getDOMNode();
		el.addEventListener('touchstart', this.onSwipeStart);
		el.addEventListener('touchmove', this.onSwipeMove);
		el.addEventListener('touchend', this.onSwipeEnd);
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
		
		this.lastElement = this.refs['item' + (total - 1)];
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

	// touch start
	onSwipeStart (e) {
		this.setState({
			// saving the initial touch 
			touchStart: e.touches[0].pageX,
			// setting the swiping state
			swiping: true
		})
	},

	onSwipeMove (e) {
		// getting the current delta
		var delta = e.touches[0].pageX - this.state.touchStart;
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
			].forEach((prop) => elementStyle[prop] = 'translate3d(' + position + 'px, 0, 0)');
		} else {
			elementStyle.left = position + 'px';
		}
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
				// less than 0 means that it's going left
				if (this.touchPosition < 0) {
					this.slideLeft();
				} else {
					this.slideRight();
				}
				// discard the position
				this.touchPosition = null;	
			}.bind(this)
		);	
	},

	slideRight (){
		this.moveTo(this.state.firstItem - 1)
	},

	slideLeft (){
		this.moveTo(this.state.firstItem + 1)
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
		return this.itemSize * this.props.items.length || 'auto';
	},

	getNextPosition () {
		return - this.itemSize * this.state.firstItem || 0;
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
			var itemClass = klass.ITEM(this.isSlider, index, this.state.selectedItem);
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
					return <li className={klass.DOT(index === this.state.selectedItem)} onClick={this.changeItem} value={index} key={index} />;
				})}
			</ul>
		);
	},

	renderStatus () {
		if (!this.props.showStatus) {
			return null
		}
		return <p className="carousel-status">{this.state.selectedItem + 1} of {this.props.items.length}</p>;
	}, 

	render () {
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
			<div className={klass.CAROUSEL(this.isSlider)}>
				<button className={klass.ARROW_LEFT(!hasPrev)} onClick={this.slideRight} />
				
				<div className={klass.WRAPPER(this.isSlider)} ref="itemsWrapper">
					<ul className={klass.SLIDER(this.isSlider, this.state.swiping)} style={itemListStyles} ref="itemList">
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

