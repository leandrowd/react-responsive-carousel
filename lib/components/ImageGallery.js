/** @jsx React.DOM */
var React = require('react/addons');
var Carousel = require('./Carousel');

module.exports = React.createClass({displayName: "exports",
	
	propsTypes: {
		images: React.PropTypes.array.isRequired
	},

	getInitialState:function () {
		return {
			currentImage: 0
		}
	},

	selectItem:function (selectedItem) {
		this.setState({
			currentImage: selectedItem
		});
	},

	render:function () {
		var $__0=    this.props,images=$__0.images;
		var $__1=    this.state,current=$__1.current;
		var mainImage = (images && images[current] && images[current].url);

		return (
			React.createElement("div", {className: "image-gallery"}, 
				React.createElement(Carousel, {type: "slider", items: images, selectedItem: this.state.currentImage, onChange: this.selectItem, onSelectItem:  this.selectItem}), 
				React.createElement(Carousel, {items: images, selectedItem: this.state.currentImage, onSelectItem:  this.selectItem})
			)
		);
	}
});

