import React from 'react';
import ReactDOM from 'react-dom';
import Carousel from './components/Carousel';

function _onChange() {
    console.log('onChange', arguments);
}

function _onClickItem() {
    console.log('onClickItem', arguments);
}

function _onClickThumb() {
    console.log('onClickThumb', arguments);
}

// Begin DemoSliderControls
const DemoCarousel = () => (
    <Carousel
        showArrows
        infiniteLoop
        autoPlay
        emulateTouch
        onClickItem={_onClickItem}
        onChange={_onChange}
        onClickThumb={_onClickThumb}
    >
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

ReactDOM.render(<DemoCarousel />, document.querySelector('.demo-carousel'));
