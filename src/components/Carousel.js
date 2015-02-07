/** @jsx React.DOM */
var React = require('react/addons');
// var Swiper = require('react-swiper');
var klass = require('../cssClasses');
var outerWidth = require('../dimensions').outerWidth;

var Finger = require('ainojs-finger');

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
        
        // unbinding swipe component
		if (this.isSlider) {
			this.finger.off('frame', this.onSwipeMove);
			this.finger.off('complete', this.onSwipeEnd);
			this.finger.destroy();
		}

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
		
		// the component should be rerended after calculating space
		this.forceUpdate();
	},

	componentDidMount (nextProps) {
		this.calculateSpace(this.props.items.length);

		// the component should be rerended after calculating space
		this.forceUpdate();	

		// creating swipe component
		if (this.isSlider) {
			this.finger = new Finger(this.refs.itemsWrapper.getDOMNode(), {
				duration: 400
			});
			this.finger.on('frame', this.onSwipeMove);
			this.finger.on('complete', this.onSwipeEnd);
		}
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
		this.refs.itemList.getDOMNode().style.transform = 'translate3d(' + e.position + 'px, 0, 0)';
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
	
		var transformProp = 'translate3d(' + this.getNextPosition() + 'px, 0, 0)';
		
		var itemListProps = {
			className: klass.SLIDER(isSlider),
			style: {
				'WebkitTransform': transformProp,
				   'MozTransform': transformProp,
				    'msTransform': transformProp,
				     'OTransform': transformProp,
				      'transform': transformProp,
				// left: this.getNextPosition(),
				// '-webkit-transform': 'translate3d(' + this.getNextPosition() + 'px, 0, 0)',
				width: this.itemSize * total
			}
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

