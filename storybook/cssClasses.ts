import classNames from 'classnames';

export default {
    ROOT: (customClassName?: string) =>
        classNames({
            'carousel-root': true,
            [customClassName || '']: !!customClassName,
        }),

    CAROUSEL: (isSlider?: boolean) =>
        classNames({
            carousel: true,
            'carousel-slider': isSlider,
        }),

    WRAPPER: (isSlider: boolean, axis?: 'horizontal' | 'vertical') =>
        classNames({
            'thumbs-wrapper': !isSlider,
            'slider-wrapper': isSlider,
            'axis-horizontal': axis === 'horizontal',
            'axis-vertical': axis !== 'horizontal',
        }),

    SLIDER: (isSlider: boolean, isSwiping?: boolean) =>
        classNames({
            thumbs: !isSlider,
            slider: isSlider,
            animated: !isSwiping,
        }),

    ITEM: (isSlider: boolean, selected: boolean) =>
        classNames({
            thumb: !isSlider,
            slide: isSlider,
            selected: selected,
        }),

    ARROW_PREV: (disabled?: boolean) =>
        classNames({
            'control-arrow control-prev': true,
            'control-disabled': disabled,
        }),

    ARROW_NEXT: (disabled?: boolean) =>
        classNames({
            'control-arrow control-next': true,
            'control-disabled': disabled,
        }),

    DOT: (selected?: boolean) =>
        classNames({
            dot: true,
            selected: selected,
        }),
};
