var React = require('react');
var Carousel = require('./Carousel');

module.exports = React.createClass({displayName: "exports",
	
	propsTypes: {
		children: React.PropTypes.element.isRequired,
		showStatus: React.PropTypes.bool,
		showControls: React.PropTypes.bool,
		selectedItem: React.PropTypes.number,
		type: React.PropTypes.oneOf(['carousel', 'slider'])
	},

	getDefaultProps:function () {
		return {
			selectedItem: 0
		}
	},

	getInitialState:function () {
		return {
			selectedItem: this.props.selectedItem
		}
	},

	selectItem:function (selectedItem) {
		this.setState({
			selectedItem: selectedItem
		});
	},

	render:function () {
		return (
			React.createElement("div", {className: "image-gallery"}, 
				React.createElement(Carousel, {type: "slider", selectedItem: this.state.selectedItem, showControls: this.props.showControls, showStatus: this.props.showStatus, onChange: this.selectItem, onSelectItem:  this.selectItem}, 
					 this.props.children
				), 
				React.createElement(Carousel, {selectedItem: this.state.selectedItem, onSelectItem:  this.selectItem}, 
					 this.props.children
				)
			)
		);
	}
});