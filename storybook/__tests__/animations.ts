import Carousel from '../components/Carousel';
import { CarouselProps, CarouselState } from '../components/Carousel/types';
import {
    fadeAnimationHandler,
    slideAnimationHandler,
    slideSwipeAnimationHandler,
} from '../components/Carousel/animations';

/**
 * Test suite for the default animation handlers
 */
describe('Default Animations', () => {
    let props: CarouselProps;
    let state: CarouselState;
    const setState = jest.fn();

    beforeEach(() => {
        props = Carousel.defaultProps;
        state = {
            initialized: false,
            previousItem: 0,
            selectedItem: 1,
            hasMount: false,
            isMouseEntered: false,
            autoPlay: true,
            swiping: false,
            swipeMovementStarted: false,
            cancelClick: false,
            itemSize: 1,
            itemListStyle: {},
            slideStyle: {},
            selectedStyle: {},
            prevStyle: {},
        };
    });

    describe('slideAnimationHandler', () => {
        it('should return itemListStyle with a transform prop', () => {
            const response = slideAnimationHandler(props, state);
            expect(response).toHaveProperty('itemListStyle');
            expect(response.itemListStyle).toHaveProperty('transform');
        });

        it('should return a transition time on itemListStyle if not swiping', () => {
            const response = slideAnimationHandler(props, state);
            expect(response.itemListStyle).toHaveProperty('transitionDuration');
        });
    });

    describe('slideSwipeAnimationHandler', () => {
        it('should return empty object if preventMovementUntilSwipeScrollTolerance is true and the tolerance has not been reached', () => {
            props = { ...props, swipeScrollTolerance: 10, preventMovementUntilSwipeScrollTolerance: true };
            expect(
                slideSwipeAnimationHandler(
                    {
                        x: 5,
                        y: 10,
                    },
                    props,
                    state,
                    setState
                )
            ).toEqual({});
        });

        it('should return itemListStyle if preventMovementUntilSwipeScrollTolerance is true and movement has already begun', () => {
            props = { ...props, swipeScrollTolerance: 10, preventMovementUntilSwipeScrollTolerance: true };
            state = { ...state, swipeMovementStarted: true };

            expect(
                slideSwipeAnimationHandler(
                    {
                        x: 5,
                        y: 10,
                    },
                    props,
                    state,
                    setState
                )
            ).toHaveProperty('itemListStyle');
        });

        it('should return itemListStyle if preventMovementUntilSwipeScrollTolerance is true and the tolerance has been reached', () => {
            props = { ...props, swipeScrollTolerance: 10, preventMovementUntilSwipeScrollTolerance: true };

            expect(
                slideSwipeAnimationHandler(
                    {
                        x: 30,
                        y: 10,
                    },
                    props,
                    state,
                    setState
                )
            ).toHaveProperty('itemListStyle');
        });

        it('should still return itemListStyle if preventMovementUntilSwipeScrollTolerance is false and the tolerance has not been reached', () => {
            props = { ...props, swipeScrollTolerance: 10, preventMovementUntilSwipeScrollTolerance: false };

            expect(
                slideSwipeAnimationHandler(
                    {
                        x: 5,
                        y: 10,
                    },
                    props,
                    state,
                    setState
                )
            ).toHaveProperty('itemListStyle');
        });
    });

    describe('fade animation handler', () => {
        it('should return a slideStyle, selectedStyle, and prevStyle', () => {
            const response = fadeAnimationHandler(props, state);
            expect(response).toHaveProperty('slideStyle');
            expect(response).toHaveProperty('selectedStyle');
            expect(response).toHaveProperty('prevStyle');
        });

        it('should give selectedStyle an opacity of 1 and position of relative', () => {
            const response = fadeAnimationHandler(props, state);
            expect(response.selectedStyle?.opacity).toEqual(1);
            expect(response.selectedStyle?.position).toEqual('relative');
        });

        it('should give default slideStyle a negative z-index, opacity 0, and position absolute', () => {
            const response = fadeAnimationHandler(props, state);
            expect(response.slideStyle?.opacity).toEqual(0);
            expect(response.slideStyle?.position).toEqual('absolute');
            expect(response.slideStyle?.zIndex).toEqual(-2);
        });

        it('should give prevStyle a negative z-index, opacity 0, and position absolute', () => {
            const response = fadeAnimationHandler(props, state);
            expect(response.prevStyle?.opacity).toEqual(0);
            expect(response.prevStyle?.position).toEqual('absolute');
            expect(response.prevStyle?.zIndex).toEqual(-2);
        });
    });
});
