var React = require('react');
var ReactDOM = require('react-dom');
var ImageGallery = require('./components/ImageGallery');
var Carousel = require('./components/Carousel');
var Slider = require('./components/Slider');

// Begin DemoSliderControls
var DemoSlider = function() {
    return (
        <Slider showControls={true} showStatus={true}>
            <img src="assets/1.jpeg" />
            <img src="assets/2.jpeg" />
            <img src="assets/3.jpeg" />
            <img src="assets/4.jpeg" />
            <img src="assets/5.jpeg" />
            <img src="assets/6.jpeg" />
            <img src="assets/7.jpeg" />
        </Slider>
    );
};

ReactDOM.render(<DemoSlider />, document.querySelector('.demo-slider-controls'));

// // Begin DemoSliderControls
// var DemoSliderControls = function() {
//     return (
//         <Carousel type="slider" showControls={true} showStatus={true}>
//             <img src="assets/1.jpeg" />
//             <img src="assets/2.jpeg" />
//             <img src="assets/3.jpeg" />
//             <img src="assets/4.jpeg" />
//             <img src="assets/5.jpeg" />
//             <img src="assets/6.jpeg" />
//             <img src="assets/7.jpeg" />
//         </Carousel>
//     );
// };

// ReactDOM.render(<DemoSliderControls />, document.querySelector('.demo-slider-controls'));
// End DemoSliderControls

// Begin DemoGallery
var DemoGallery = function() {
    return (
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
    );
};

// ReactDOM.render(<DemoGallery />, document.querySelector('.demo-gallery'));
// End DemoGallery

// Begin DemoCarousel
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
        </Carousel>
    );
};

// ReactDOM.render(<DemoCarousel />, document.querySelector('.demo-carousel'));
// End DemoCarousel