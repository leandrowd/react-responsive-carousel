import { Children } from 'react';
import { CarouselProps } from './types';
import CSSTranslate from '../../CSSTranslate';

export const noop = () => {};

export const defaultStatusFormatter = (current: number, total: number) => `${current} of ${total}`;

export const isKeyboardEvent = (e?: React.MouseEvent | React.KeyboardEvent): e is React.KeyboardEvent =>
    e ? e.hasOwnProperty('key') : false;

/**
 * Gets the list 'position' relative to a current index
 * @param index
 */
export const getPosition = (index: number, props: CarouselProps): number => {
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
export const setPosition = (position: number, axis: 'horizontal' | 'vertical'): React.CSSProperties => {
    const style = {};
    ['WebkitTransform', 'MozTransform', 'MsTransform', 'OTransform', 'transform', 'msTransform'].forEach((prop) => {
        // @ts-ignore
        style[prop] = CSSTranslate(position, '%', axis);
    });

    return style;
};
