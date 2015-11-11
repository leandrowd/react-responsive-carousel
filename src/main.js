var React = require('react');
var ReactDOM = require('react-dom');
// window.React = React;
var ImageGallery = require('./components/ImageGallery');
var Carousel = require('./components/Carousel');

var DemoSliderControls = React.createClass({
	render() {
		return (
			<div className="demo-slider">
				<Carousel type="slider" showControls={true} showStatus={true}>
					<img src="assets/1.jpeg" />
					<img src="assets/2.jpeg" />
					<img src="assets/3.jpeg" />
					<img src="assets/4.jpeg" />
					<img src="assets/5.jpeg" />
					<img src="assets/6.jpeg" />
					<img src="assets/7.jpeg" />
				</Carousel>
			</div>
		);
	}
});

var DemoGallery = React.createClass({
	render() {
		return (
			<div className="demo-image-gallery">
				<ImageGallery showControls={true} showStatus={true}>
					<img src="assets/1.jpeg" />
					<img src="assets/2.jpeg" />
					<img src="assets/3.jpeg" />
					<img src="assets/4.jpeg" />
					<img src="assets/5.jpeg" />
					<img src="assets/6.jpeg" />
					<img src="assets/7.jpeg" />
					<img src="assets/1.jpeg" />
					<img src="assets/2.jpeg" />
					<img src="assets/3.jpeg" />
					<img src="assets/4.jpeg" />
					<img src="assets/5.jpeg" />
					<img src="assets/6.jpeg" />
					<img src="assets/7.jpeg" />
					<img src="assets/1.jpeg" />
					<img src="assets/2.jpeg" />
					<img src="assets/3.jpeg" />
					<img src="assets/4.jpeg" />
					<img src="assets/5.jpeg" />
					<img src="assets/6.jpeg" />
					<img src="assets/7.jpeg" />
					<img src="assets/1.jpeg" />
					<img src="assets/2.jpeg" />
					<img src="assets/3.jpeg" />
					<img src="assets/4.jpeg" />
					<img src="assets/5.jpeg" />
					<img src="assets/6.jpeg" />
					<img src="assets/7.jpeg" />
				</ImageGallery>
			</div>
		);
	}
});

var DemoCarousel = React.createClass({
	render() {
		return (
			<div className="demo-carousel">
				<Carousel>
					<img src="assets/1.jpeg" />
					<img src="assets/2.jpeg" />
					<img src="assets/3.jpeg" />
					<img src="assets/4.jpeg" />
					<img src="assets/5.jpeg" />
					<img src="assets/6.jpeg" />
					<img src="assets/7.jpeg" />
				</Carousel>
			</div>
		);
	}
});

ReactDOM.render(<DemoSliderControls />, document.querySelector('.demo-slider-controls'));
ReactDOM.render(<DemoGallery />, document.querySelector('.demo-gallery'));
ReactDOM.render(<DemoCarousel />, document.querySelector('.demo-carousel'));

