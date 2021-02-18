import { Children } from 'react';
import {
    AnimationHandler,
    AnimationHandlerResponse,
    SwipeAnimationHandler,
    CarouselProps,
    CarouselState,
} from './types';
/**
 * Default provided animation handlers
 */

export const slideAnimationHandler: AnimationHandler = (
    props,
    state,
    carouselWrapperRef,
    listRef,
    itemsRef
): AnimationHandlerResponse => {
    const needClonedSlide = this.props.infiniteLoop && !fromSwipe && (position < 0 || position > lastPosition);
    const oldPosition = position;

    if (needClonedSlide) {
        // set swiping true would disable transition time, then we set slider to cloned position and force a reflow
        // this is only needed for non-swiping situation
        this.setState(
            {
                swiping: true,
            },
            () => {
                if (oldPosition < 0) {
                    if (this.props.centerMode && this.props.centerSlidePercentage && this.props.axis === 'horizontal') {
                        this.setPosition(
                            -(lastPosition + 2) * this.props.centerSlidePercentage -
                                (100 - this.props.centerSlidePercentage) / 2,
                            true
                        );
                    } else {
                        this.setPosition(-(lastPosition + 2) * 100, true);
                    }
                } else if (oldPosition > lastPosition) {
                    this.setPosition(0, true);
                }

                this.selectItem({
                    selectedItem: position!,
                    swiping: false,
                });
            }
        );
    }
    return {
        itemListStyle: '',
    };
};

export const fadeAnimationHandler: AnimationHandler = (
    props: CarouselProps,
    state: CarouselState
): AnimationHandlerResponse => {
    return {
        itemListStyle: '',
    };
};

/**
 * Gets the list 'position' relative to a current index
 * @param index
 */
const getPosition = (index: number, props: CarouselProps): number => {
    if (props.infiniteLoop) {
        // index has to be added by 1 because of the first cloned slide
        ++index;
    }

    if (index === 0) {
        return 0;
    }

    const childrenLength = Children.count(props.children);
    if (props.centerMode && props.axis === 'horizontal') {
        let currentPosition = -index * props.centerSlidePercentage;
        const lastPosition = childrenLength - 1;

        if (index && (index !== lastPosition || props.infiniteLoop)) {
            currentPosition += (100 - props.centerSlidePercentage) / 2;
        } else if (index === lastPosition) {
            currentPosition += 100 - props.centerSlidePercentage;
        }

        return currentPosition;
    }

    return -index * 100;
};

/**
 * Sets the 'position' transform for sliding animations
 * @param position
 * @param forceReflow
 */
const setPosition = (position: number, forceReflow?: boolean) => {
    const list = ReactDOM.findDOMNode(this.listRef);

    if (list instanceof HTMLElement) {
        ['WebkitTransform', 'MozTransform', 'MsTransform', 'OTransform', 'transform', 'msTransform'].forEach((prop) => {
            list.style[prop as any] = CSSTranslate(position, '%', this.props.axis);
        });

        if (forceReflow) {
            list.offsetLeft;
        }
    }
};

/**
 * Reset carousel position to the currently selected item
 */
// resetPosition = (selectedItem) => {
//     const currentPosition = getPosition(selectedItem);
//     setPosition(currentPosition);
// };

export const slideSwipeAnimationHandler: SwipeAnimationHandler = (delta, props, state): AnimationHandlerResponse => {
    const isHorizontal = props.axis === 'horizontal';
    const childrenLength = Children.count(props.children);

    const initialBoundry = 0;

    const currentPosition = getPosition(state.selectedItem, props);
    const finalBoundry = props.infiniteLoop
        ? getPosition(childrenLength - 1, props) - 100
        : getPosition(childrenLength - 1, props);

    const axisDelta = isHorizontal ? delta.x : delta.y;
    let handledDelta = axisDelta;

    // prevent user from swiping left out of boundaries
    if (currentPosition === initialBoundry && axisDelta > 0) {
        handledDelta = 0;
    }

    // prevent user from swiping right out of boundaries
    if (currentPosition === finalBoundry && axisDelta < 0) {
        handledDelta = 0;
    }

    let position = currentPosition + 100 / (state.itemSize / handledDelta);
    const hasMoved = Math.abs(axisDelta) > props.swipeScrollTolerance;

    if (props.infiniteLoop && hasMoved) {
        // When allowing infinite loop, if we slide left from position 0 we reveal the cloned last slide that appears before it
        // if we slide even further we need to jump to other side so it can continue - and vice versa for the last slide
        if (state.selectedItem === 0 && position > -100) {
            position -= childrenLength * 100;
        } else if (state.selectedItem === childrenLength - 1 && position < -childrenLength * 100) {
            position += childrenLength * 100;
        }
    }

    // NOTE: Need to figure out how to make setState not necessary here
    // if (!props.preventMovementUntilSwipeScrollTolerance || hasMoved || state.swipeMovementStarted) {
    //     if (!state.swipeMovementStarted) {
    //         this.setState({ swipeMovementStarted: true });
    //     }
    //     this.setPosition(position);
    // }

    // allows scroll if the swipe was within the tolerance
    // if (hasMoved && !state.cancelClick) {
    //     this.setState({
    //         cancelClick: true,
    //     });
    // }

    return {};
};
