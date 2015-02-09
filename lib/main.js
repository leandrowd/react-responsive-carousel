/** @jsx React.DOM */
var React = require('react');
var ImageGallery = require('./components/ImageGallery');
var Carousel = require('./components/Carousel');

var galleryImages = [
	{url: "http://lorempixel.com/700/250/sports/1"},
	{url: "http://lorempixel.com/700/250/sports/2"},
	{url: "http://lorempixel.com/700/250/sports/3"},
	{url: "http://lorempixel.com/700/250/sports/4"},
	{url: "http://lorempixel.com/700/250/sports/5"},
	{url: "http://lorempixel.com/700/250/sports/6"},
	{url: "http://lorempixel.com/700/250/sports/7"}
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

var DemoGallery = React.createClass({displayName: "DemoGallery",
	render:function() {
		return (
			React.createElement("div", {className: "demo-image-gallery"}, 
				React.createElement(ImageGallery, {images: galleryImages })
			)
		);
	}
});

var DemoSliderControls = React.createClass({displayName: "DemoSliderControls",
	render:function() {
		return (
			React.createElement("div", {className: "demo-slider"}, 
				React.createElement(Carousel, {type: "slider", items: sliderImages, showControls: true, showStatus: true})
			)
		);
	}
});

var DemoCarousel = React.createClass({displayName: "DemoCarousel",
	render:function() {
		return (
			React.createElement("div", {className: "demo-carousel"}, 
				React.createElement(Carousel, {items: carouselImages })
			)
		);
	}
});

React.render(React.createElement(DemoGallery, null), document.querySelector('.demo-gallery'));
React.render(React.createElement(DemoSliderControls, null), document.querySelector('.demo-slider-controls'));
React.render(React.createElement(DemoCarousel, null), document.querySelector('.demo-carousel'));

