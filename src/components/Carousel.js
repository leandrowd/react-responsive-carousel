/** @jsx React.DOM */
var React = require('react/addons');
var classSet = React.addons.classSet;
var Swiper = require('react-swiper');

var outerWidth = (el) => {
	var width = el.offsetWidth;
	var style = getComputedStyle(el);

	width += parseInt(style.marginLeft) + parseInt(style.marginRight);
	return width;
}

var klass = {
	CAROUSEL (isSlider) {
		return classSet({
			"carousel": true,
			"carousel-slider": isSlider
		});
	}, 

	WRAPPER (isSlider) {
		return classSet({
			"thumbs-wrapper": !isSlider,
			"slider-wrapper": isSlider
		});
	},

	SLIDER (isSlider){
		return classSet({
			"thumbs": !isSlider,
			"slider": isSlider
		});
	},

	ITEM (isSlider, index, selectedItem) {
		return classSet({
			"thumb": !isSlider,
			"slide": isSlider,
			"selected": index === selectedItem
		});
	},

	ARROW_LEFT (disabled) {
		return classSet({
			"control-arrow control-left": true,
			"control-disabled": disabled
		});
	},

	ARROW_RIGHT (disabled) {
		return classSet({
			"control-arrow control-right": true,
			"control-disabled": disabled
		})
	}
}


module.exports = React.createClass({
	
	propsTypes: {
		items: React.PropTypes.array.isRequired
	},

	getDefaultProps () {
		return {
			selectedItem: 0,
			type: 'carousel'
		}
	}, 

	getInitialState () {
		return {
			// index of the image to be shown
			selectedItem: this.props.selectedItem,
			// index of the thumb that will appear first
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

	updateDimensions () {
		this.calculateSpace(this.props.items.length);
		// this.component needs to calculate many sizes so we need to re render
		this.forceUpdate();
	},

	componentDidMount (nextProps) {
		this.calculateSpace(this.props.items.length);
		// this.component needs to calculate many sizes so we need to re render
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

	_handleClickItem (index, item) {
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
		var next = this.state.firstItem === 0 ? 0 : this.state.firstItem - 1;

		this.setState({
			firstItem: next
		});

		// send it's to the parent
		this.triggerOnChange(next);
	},

	slideLeft (){
		var next = this.state.firstItem + 1;
		
		// if we can show 3 elements so the last 
		// item to be the first is the last - 3
		if (next >= this.lastPosition) {
			next = this.lastPosition;
		} 

		this.setState({
			firstItem: next
		});

		// send it's to the parent
		this.triggerOnChange(next);
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

	renderItems () {
		var isSlider = (this.props.type === "slider");

		return this.props.items.map((item, index) => {
			var itemClass = klass.ITEM(isSlider, index, this.state.selectedItem);
			var imageSchema = {};
			
			if (index === 0) {
				imageSchema.itemProp = "image";
			}
			
			return (
				<li key={index} ref={"item" + index} className={itemClass}
					style={{width: this.isSlider && this.itemSize}} 
					onClick={ this._handleClickItem.bind(this, index, item) }>
					<img src={item.url} {...imageSchema} />
				</li>
			);
		});
					
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
	
		var elementProps = {
			className: klass.CAROUSEL(isSlider),
			onSwipeRight: this.slideRight,
			onSwipeLeft: this.slideLeft
		}

		var sliderProps = {
			className: klass.SLIDER(isSlider),
			style: {
				// left: this.getNextPosition(),
				'-webkit-transform': 'translate3d(' + this.getNextPosition() + 'px, 0, 0)',
				width: this.itemSize * total
			}
		}
	
		return (
			<Swiper {...elementProps}>

				<button className={klass.ARROW_LEFT(!hasPrev)} onClick={this.slideRight} />
				
				<div className={klass.WRAPPER(isSlider)} ref="itemsWrapper">
					<ul {...sliderProps} ref="itemList">
						{ this.renderItems() }
					</ul>
				</div>

				<button className={klass.ARROW_RIGHT(!hasNext)} onClick={this.slideLeft} />
				
			</Swiper>
		);
		
	}
});

