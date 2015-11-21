var React = require('react');
var ReactDOM = require('react-dom');
var Carousel = require('./components/Carousel');

var DemoSliderControls = function(){
	return (
		React.createElement(Carousel, {type: "slider", showControls: true, showStatus: true}, 
			React.createElement("img", {src: "assets/1.jpeg"}), 
			React.createElement("img", {src: "assets/2.jpeg"}), 
			React.createElement("img", {src: "assets/3.jpeg"}), 
			React.createElement("img", {src: "assets/4.jpeg"}), 
			React.createElement("img", {src: "assets/5.jpeg"}), 
			React.createElement("img", {src: "assets/6.jpeg"}), 
			React.createElement("img", {src: "assets/7.jpeg"})
		)
	);
};

ReactDOM.render(React.createElement(DemoSliderControls, null), document.querySelector('.demo-slider-controls'));


var React = require('react');
var ReactDOM = require('react-dom');
var ImageGallery = require('./components/ImageGallery');

var DemoGallery = function() {
	return (
		React.createElement(ImageGallery, {showControls: true, showStatus: true}, 
			React.createElement("img", {src: "assets/1.jpeg"}), 
			React.createElement("img", {src: "assets/2.jpeg"}), 
			React.createElement("img", {src: "assets/3.jpeg"}), 
			React.createElement("img", {src: "assets/4.jpeg"}), 
			React.createElement("img", {src: "assets/5.jpeg"}), 
			React.createElement("img", {src: "assets/6.jpeg"})
		)
	);
};

ReactDOM.render(React.createElement(DemoGallery, null), document.querySelector('.demo-gallery'));


var React = require('react');
var ReactDOM = require('react-dom');
var Carousel = require('./components/Carousel');

var DemoCarousel = function() {
	return (
		React.createElement(Carousel, null, 
			React.createElement("img", {src: "assets/1.jpeg"}), 
			React.createElement("img", {src: "assets/2.jpeg"}), 
			React.createElement("img", {src: "assets/3.jpeg"}), 
			React.createElement("img", {src: "assets/4.jpeg"}), 
			React.createElement("img", {src: "assets/5.jpeg"}), 
			React.createElement("img", {src: "assets/6.jpeg"}), 
			React.createElement("img", {src: "assets/7.jpeg"})
		)
	);
};

ReactDOM.render(React.createElement(DemoCarousel, null), document.querySelector('.demo-carousel'));

