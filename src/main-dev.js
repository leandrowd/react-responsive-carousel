var React = require('react');
var ReactDOM = require('react-dom');
var ImageGallery = require('./components/ImageGallery');
var Carousel = require('./components/Carousel');
var Slider = require('./components/Slider');

function onChange() {
    console.log('onChange', arguments);
}

function onSelectItem() {
    console.log('onSelectItem', arguments);
}

// Begin DemoSliderControls
var DemoSliderWithItems = React.createClass({
    render() {
        return (
            <Slider showArrows={false} onChange={onChange} onSelectItem={onSelectItem}>
                <div>
                    <img src="assets/1.jpeg" />
                    <p className="legend">Legend 1</p>
                </div>
                <div>
                    <img src="assets/2.jpeg" />
                    <p className="legend">Legend 2</p>
                </div>
                <div>
                    <img src="assets/3.jpeg" />
                    <p className="legend">Legend 3</p>
                </div>
                <div>
                    <img src="assets/4.jpeg" />
                    <p className="legend">Legend 4</p>
                </div>
                <div>
                    <img src="assets/5.jpeg" />
                    <p className="legend">Legend 5</p>
                </div>
                <div>
                    <img src="assets/6.jpeg" />
                    <p className="legend">Legend 6</p>
                </div>
            </Slider>
        );
    }
});
ReactDOM.render(<DemoSliderWithItems />, document.querySelector('.demo-gallery'));


// Begin DemoSliderControls
var DemoSlider2 = function() {
    return (
        <Slider showControls="true" showStatus="true" showThumbs="true" onChange={onChange} onSelectItem={onSelectItem}>
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

var Gallery = function () {
    return (
        <Slider showControls="true" showStatus="true" onChange={onChange} onSelectItem={onSelectItem} className="parent">
            <div className="page-carousel">
                <DemoSliderWithItems />
            </div>
            <div className="page-carousel">
                <DemoSlider2 />
            </div>
        </Slider>
    );
}

// ReactDOM.render(<Gallery />, document.querySelector('.demo-slider-controls'));

// ReactDOM.render(<DemoSlider />, document.querySelector('.demo-gallery'));


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