var React = require('react');
var ReactDOM = require('react-dom');
var Carousel = require('./components/Carousel');

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
            <Carousel showArrows={false} onChange={onChange} onSelectItem={onSelectItem}>
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
            </Carousel>
        );
    }
});
ReactDOM.render(<DemoSliderWithItems />, document.querySelector('.demo-gallery'));


// Begin DemoSliderControls
var DemoSlider2 = function() {
    return (
        <Carousel showControls="true" showStatus="true" showThumbs="true" onChange={onChange} onSelectItem={onSelectItem}>
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

var Gallery = function () {
    return (
        <Carousel showControls="true" showStatus="true" onChange={onChange} onSelectItem={onSelectItem} className="parent">
            <div className="page-carousel">
                <DemoSliderWithItems />
            </div>
            <div className="page-carousel">
                <DemoSlider2 />
            </div>
        </Carousel>
    );
}

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