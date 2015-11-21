var React = require('react');
var ReactDOM = require('react-dom');
var Carousel = require('./components/Carousel');

var DemoSliderControls = function(){
	return (
		<Carousel type="slider" showControls={true} showStatus={true}>
			<img src="assets/1.jpeg" />
			<img src="assets/2.jpeg" />
			<img src="assets/3.jpeg" />
			<img src="assets/4.jpeg" />
			<img src="assets/5.jpeg" />
			<img src="assets/6.jpeg" />
			<img src="assets/7.jpeg" />
		</Carousel>
	);
};

ReactDOM.render(<DemoSliderControls />, document.querySelector('.demo-slider-controls'));


var React = require('react');
var ReactDOM = require('react-dom');
var ImageGallery = require('./components/ImageGallery');

var DemoGallery = function() {
	return (
		<ImageGallery showControls={true} showStatus={true}>
			<img src="assets/1.jpeg" />
			<img src="assets/2.jpeg" />
			<img src="assets/3.jpeg" />
			<img src="assets/4.jpeg" />
			<img src="assets/5.jpeg" />
			<img src="assets/6.jpeg" />
		</ImageGallery>
	);
};

ReactDOM.render(<DemoGallery />, document.querySelector('.demo-gallery'));


var React = require('react');
var ReactDOM = require('react-dom');
var Carousel = require('./components/Carousel');

var DemoCarousel = function() {
	return (
		<Carousel>
			<img src="assets/1.jpeg" />
			<img src="assets/2.jpeg" />
			<img src="assets/3.jpeg" />
			<img src="assets/4.jpeg" />
			<img src="assets/5.jpeg" />
			<img src="assets/6.jpeg" />
			<img src="assets/7.jpeg" />
		</Carousel>
	);
};

ReactDOM.render(<DemoCarousel />, document.querySelector('.demo-carousel'));

