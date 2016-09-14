var React = require('react');
var ReactDOM = require('react-dom');
var Carousel = require('./components/Carousel');

function onChange() {
    console.log('onChange', arguments);
}

function onClickItem() {
    console.log('onClickItem', arguments);
}

function onClickThumb() {
    console.log('onClickThumb', arguments);
}

// Begin DemoSliderControls
var DemoCarousel = React.createClass({
    render() {
        return (
            <Carousel showArrows={true} onChange={onChange} onClickItem={onClickItem} onClickThumb={onClickThumb}>
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
ReactDOM.render(<DemoCarousel />, document.querySelector('.demo-carousel'));

var DemoCarouselVideos = React.createClass({
    render() {
        return (
            <Carousel showThumbs={false} width="750">
                <div>
                    <iframe width="750" height="300" src="https://www.youtube.com/embed/n0F6hSpxaFc" />
                </div>

                <div>
                    <iframe width="750" height="300" src="https://www.youtube.com/embed/C-y70ZOSzE0" />
                </div>

                <div>
                    <iframe width="750" height="300" src="https://www.youtube.com/embed/IyTv_SR2uUo" />
                </div>

                <div>
                    <iframe width="750" height="300" src="https://www.youtube.com/embed/3zrfGHQd4Bo" />
                </div>
            </Carousel>
        );
    }
});

ReactDOM.render(<DemoCarouselVideos />, document.querySelector('.demo-carousel-videos'));


// Begin DemoSliderControls
var DemoCarouselVertical = React.createClass({
    render() {
        return (
            <Carousel axis="vertical" showArrows={true} onChange={onChange} onClickItem={onClickItem} onClickThumb={onClickThumb}>
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
ReactDOM.render(<DemoCarouselVertical />, document.querySelector('.demo-carousel-vertical'));

// Begin DemoSliderControls
var DemoCleanCarousel = React.createClass({
    render() {
        return (
            <Carousel showThumbs={false} showArrows={false} showStatus={false} onChange={onChange} onClickItem={onClickItem}>
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
ReactDOM.render(<DemoCleanCarousel />, document.querySelector('.demo-clean-carousel'));

