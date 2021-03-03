import React from 'react';
import ReactDOM from 'react-dom';

import(/* webpackChunkName: "carousel-component" */ './components/Carousel').then(({ default: Carousel }) => {
    const DemoCarousel = () => (
        <Carousel
            showArrows
            infiniteLoop
            autoPlay
            emulateTouch
            onClickItem={(...args) => console.log('onClickItem', ...args)}
            onChange={(...args) => console.log('onChange', ...args)}
            onClickThumb={(...args) => console.log('onClickThumb', ...args)}
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
});
