import { Children } from 'react';
import CSSTranslate from '../../CSSTranslate';
import { getPosition, setPosition } from './utils';
import { AnimationHandler, AnimationHandlerResponse, SwipeAnimationHandler, StopSwipingHandler } from './types';

/**
 * Main animation handler for the default 'sliding' style animation
 * @param props
 * @param state
 */
export const slideAnimationHandler: AnimationHandler = (props, state): AnimationHandlerResponse => {
    const returnStyles: AnimationHandlerResponse = {};
    const { selectedItem } = state;
    const previousItem = selectedItem;
    const lastPosition = Children.count(props.children) - 1;
    const needClonedSlide = props.infiniteLoop && (selectedItem < 0 || selectedItem > lastPosition);

    // Handle list position if it needs a clone
    if (needClonedSlide) {
        if (previousItem < 0) {
            if (props.centerMode && props.centerSlidePercentage && props.axis === 'horizontal') {
                returnStyles.itemListStyle = setPosition(
                    -(lastPosition + 2) * props.centerSlidePercentage - (100 - props.centerSlidePercentage) / 2,
                    props.axis
                );
            } else {
                returnStyles.itemListStyle = setPosition(-(lastPosition + 2) * 100, props.axis);
            }
        } else if (previousItem > lastPosition) {
            returnStyles.itemListStyle = setPosition(0, props.axis);
        }

        return returnStyles;
    }

    const currentPosition = getPosition(selectedItem, props);

    // if 3d is available, let's take advantage of the performance of transform
    const transformProp = CSSTranslate(currentPosition, '%', props.axis);

    const transitionTime = props.transitionTime + 'ms';

    returnStyles.itemListStyle = {
        WebkitTransform: transformProp,
        msTransform: transformProp,
        OTransform: transformProp,
        transform: transformProp,
    };

    if (!state.swiping) {
        returnStyles.itemListStyle = {
            ...returnStyles.itemListStyle,
            WebkitTransitionDuration: transitionTime,
            MozTransitionDuration: transitionTime,
            OTransitionDuration: transitionTime,
            transitionDuration: transitionTime,
            msTransitionDuration: transitionTime,
        };
    }

    return returnStyles;
};

/**
 * Swiping animation handler for the default 'sliding' style animation
 * @param delta
 * @param props
 * @param state
 * @param setState
 */
export const slideSwipeAnimationHandler: SwipeAnimationHandler = (
    delta,
    props,
    state,
    setState
): AnimationHandlerResponse => {
    const returnStyles: AnimationHandlerResponse = {};
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

    if (!props.preventMovementUntilSwipeScrollTolerance || hasMoved || state.swipeMovementStarted) {
        if (!state.swipeMovementStarted) {
            setState({ swipeMovementStarted: true });
        }

        returnStyles.itemListStyle = setPosition(position, props.axis);
    }

    //allows scroll if the swipe was within the tolerance
    if (hasMoved && !state.cancelClick) {
        setState({
            cancelClick: true,
        });
    }
    return returnStyles;
};

/**
 * Default 'sliding' style animination handler for when a swipe action stops.
 * @param props
 * @param state
 */
export const slideStopSwipingHandler: StopSwipingHandler = (props, state): AnimationHandlerResponse => {
    const currentPosition = getPosition(state.selectedItem, props);
    const itemListStyle = setPosition(currentPosition, props.axis);

    return {
        itemListStyle,
    };
};

/**
 * Main animation handler for the default 'fade' style animation
 * @param props
 * @param state
 */
export const fadeAnimationHandler: AnimationHandler = (props, state): AnimationHandlerResponse => {
    const transitionTime = props.transitionTime + 'ms';
    const transitionTimingFunction = 'ease-in-out';

    let slideStyle: React.CSSProperties = {
        position: 'absolute',
        display: 'block',
        zIndex: -2,
        minHeight: '100%',
        opacity: 0,
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        transitionTimingFunction: transitionTimingFunction,
        msTransitionTimingFunction: transitionTimingFunction,
        MozTransitionTimingFunction: transitionTimingFunction,
        WebkitTransitionTimingFunction: transitionTimingFunction,
        OTransitionTimingFunction: transitionTimingFunction,
    };

    if (!state.swiping) {
        slideStyle = {
            ...slideStyle,
            WebkitTransitionDuration: transitionTime,
            MozTransitionDuration: transitionTime,
            OTransitionDuration: transitionTime,
            transitionDuration: transitionTime,
            msTransitionDuration: transitionTime,
        };
    }

    return {
        slideStyle,
        selectedStyle: { ...slideStyle, opacity: 1, position: 'relative' },
        prevStyle: { ...slideStyle },
    };
};
