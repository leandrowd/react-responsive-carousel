var React = require('react/addons');
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

	render () {
		var { images } = this.props;
		var { current } = this.state;
		var mainImage = (images && images[current] && images[current].url);

		return (
			<div className="image-gallery">
				<Carousel type="slider" items={ images } selectedItem={this.state.currentImage} onChange={this.selectItem} onSelectItem={ this.selectItem } />
				<Carousel items={ images } selectedItem={this.state.currentImage} onSelectItem={ this.selectItem } />
			</div>
		);
	}
});

