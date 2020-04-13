import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Carousel from '../components/Carousel';

describe('SSR', () => {
    it('should be able to render the component without throwing', () => {
        expect(() =>
            ReactDOMServer.renderToStaticMarkup(
                <Carousel>
                    <img src="assets/1.jpeg" key="1" />
                    <img src="assets/2.jpeg" key="2" />
                </Carousel>
            )
        ).not.toThrow();
    });
});
