/** @jsx React.DOM */
var React = require('react/addons');
var classSet = React.addons.classSet;
var Swiper = require('react-swiper');
var Carousel = require('./Carousel');

module.exports = React.createClass({
	
	propsTypes: {
		images: React.PropTypes.array.isRequired
	},

	getInitialState () {
		return {
			currentImage: 0
		}
	},

	selectItem (selectedItem) {
		this.setState({
			currentImage: selectedItem
		});
	},

	renderImageGallery (imageSize) {
		var { images } = this.props;
		var { current } = this.state;
		var mainImage = (images && images[current] && images[current].url);

		return (
			<div>
				<Carousel type="slider" items={ images } selectedItem={this.state.currentImage} onChange={this.selectItem} onSelectItem={ this.selectItem } />
				<Carousel items={ images } selectedItem={this.state.currentImage} onSelectItem={ this.selectItem } />
			</div>
		);
	},

	render () {
		return (
			<div className={this.props.className}>
				{ this.renderImageGallery() }
				<p className="gallery-status">{this.state.currentImage + 1} of {this.props.images.length} Photos</p>
			</div>
		);
	}
});

