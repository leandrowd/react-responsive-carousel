var React = require('react');
var Carousel = require('./Carousel');

module.exports = React.createClass({
	
	propsTypes: {
		children: React.PropTypes.element.isRequired,
		showStatus: React.PropTypes.bool,
		showControls: React.PropTypes.bool,
		selectedItem: React.PropTypes.number,
		type: React.PropTypes.oneOf(['carousel', 'slider'])
	},

	getDefaultProps () {
		return {
			selectedItem: 0
		}
	},

	getInitialState () {
		return {
			selectedItem: this.props.selectedItem
		}
	},

	selectItem (selectedItem) {
		this.setState({
			selectedItem: selectedItem
		});
	},

	render () {
		return (
			<div className="image-gallery">
				<Carousel type="slider" selectedItem={this.state.selectedItem} showControls={this.props.showControls} showStatus={this.props.showStatus} onChange={this.selectItem} onSelectItem={ this.selectItem }>
					{ this.props.children }
				</Carousel>
				<Carousel selectedItem={this.state.selectedItem} onSelectItem={ this.selectItem }>
					{ this.props.children }
				</Carousel>
			</div>
		);
	}
});