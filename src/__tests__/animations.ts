import Carousel from '../components/Carousel';
import { CarouselProps, CarouselState } from '../components/Carousel/types';
import {
    // slideAnimationHandler,
    slideSwipeAnimationHandler,
    // slideStopSwipingHandler,
    // fadeAnimationHandler,
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

    describe('slideAnimationHandler', () => {});

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

    describe('slideStopSwipingHandler', () => {});
});

// it('should set slide position directly and trigger a reflow when doing first to last transition', () => {
//   componentInstance.setPosition = jest.fn();
//   componentInstance.decrement();
//   expect(componentInstance.setPosition).toBeCalledWith(-800, true);
//   componentInstance.setPosition.mockClear();
// });

// it('should set slide position directly and trigger a reflow when doing last to first transition', () => {
//   renderDefaultComponent({
//       infiniteLoop: true,
//       selectedItem: 7,
//   });

//   componentInstance.setPosition = jest.fn();
//   componentInstance.increment();
//   expect(componentInstance.setPosition).toHaveBeenCalled();
// });

// it('should not call setPosition if swiping with inifinite scrolling', () => {
//   componentInstance.setPosition = jest.fn();
//   componentInstance.decrement(1, true);
//   expect(componentInstance.setPosition).not.toHaveBeenCalled();
// });
