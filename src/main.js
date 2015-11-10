var React = require('react');
window.React = React;
var ImageGallery = require('./components/ImageGallery');
var Carousel = require('./components/Carousel');

var galleryImages = [
	{url: "assets/1.jpeg"},
	{url: "assets/2.jpeg"},
	{url: "assets/3.jpeg"},
	{url: "assets/4.jpeg"},
	{url: "assets/5.jpeg"},
	{url: "assets/6.jpeg"},
	{url: "assets/7.jpeg"}
];

var sliderImages = [
	{url: "http://lorempixel.com/960/400/nature/1"},
	{url: "http://lorempixel.com/960/400/nature/2"},
	{url: "http://lorempixel.com/960/400/nature/3"},
	{url: "http://lorempixel.com/960/400/nature/4"},
	{url: "http://lorempixel.com/960/400/nature/5"},
	{url: "http://lorempixel.com/960/400/nature/6"},
	{url: "http://lorempixel.com/960/400/nature/7"}
];

var carouselImages = [
	{url: "http://lorempixel.com/70/70/animals/1"},
	{url: "http://lorempixel.com/70/70/animals/2"},
	{url: "http://lorempixel.com/70/70/animals/3"},
	{url: "http://lorempixel.com/70/70/animals/4"},
	{url: "http://lorempixel.com/70/70/animals/5"},
	{url: "http://lorempixel.com/70/70/animals/6"},
	{url: "http://lorempixel.com/70/70/animals/7"},
	{url: "http://lorempixel.com/70/70/animals/8"},
	{url: "http://lorempixel.com/70/70/animals/9"},
	{url: "http://lorempixel.com/70/70/animals/10"},
	{url: "http://lorempixel.com/70/70/animals/11"},
	{url: "http://lorempixel.com/70/70/animals/12"},
	{url: "http://lorempixel.com/70/70/animals/13"},
	{url: "http://lorempixel.com/70/70/animals/14"},
	{url: "http://lorempixel.com/70/70/animals/15"},
	{url: "http://lorempixel.com/70/70/animals/16"},
	{url: "http://lorempixel.com/70/70/animals/17"},
	{url: "http://lorempixel.com/70/70/animals/18"},
	{url: "http://lorempixel.com/70/70/animals/19"},
	{url: "http://lorempixel.com/70/70/animals/20"}

];

var DemoGallery = React.createClass({
	render() {
		return (
			<div className="demo-image-gallery">
				<ImageGallery>
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

React.render(<DemoGallery />, document.querySelector('.demo-gallery'));
React.render(<DemoSliderControls />, document.querySelector('.demo-slider-controls'));
React.render(<DemoCarousel />, document.querySelector('.demo-carousel'));

