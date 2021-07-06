export interface AnimationHandlerResponse {
    itemListStyle?: React.CSSProperties;
    slideStyle?: React.CSSProperties;
    selectedStyle?: React.CSSProperties;
    prevStyle?: React.CSSProperties;
}

export type AnimationHandler = (props: CarouselProps, state: CarouselState) => AnimationHandlerResponse;

export type SwipeAnimationHandler = (
    delta: {
        x: number;
        y: number;
    },
    props: CarouselProps,
    state: CarouselState,
    setState: Function
) => AnimationHandlerResponse;

export type StopSwipingHandler = (props: CarouselProps, state: CarouselState) => AnimationHandlerResponse;

export interface CarouselProps {
    ariaLabel?: string | undefined;
    axis: 'horizontal' | 'vertical';
    autoFocus?: boolean;
    autoPlay?: boolean;
    centerMode?: boolean;
    centerSlidePercentage: number;
    children?: React.ReactChild[];
    className?: string;
    dynamicHeight?: boolean;
    emulateTouch?: boolean;
    infiniteLoop?: boolean;
    interval: number;
    labels: {
        leftArrow: string;
        rightArrow: string;
        item: string;
    };
    onClickItem: (index: number, item: React.ReactNode) => void;
    onClickThumb: (index: number, item: React.ReactNode) => void;
    onChange: (index: number, item: React.ReactNode) => void;
    onSwipeStart: (event: React.TouchEvent) => void;
    onSwipeEnd: (event: React.TouchEvent) => void;
    onSwipeMove: (event: React.TouchEvent) => boolean;
    preventMovementUntilSwipeScrollTolerance: boolean;
    renderArrowPrev: (clickHandler: () => void, hasPrev: boolean, label: string) => React.ReactNode;
    renderArrowNext: (clickHandler: () => void, hasNext: boolean, label: string) => React.ReactNode;
    renderIndicator: (
        clickHandler: (e: React.MouseEvent | React.KeyboardEvent) => void,
        isSelected: boolean,
        index: number,
        label: string
    ) => React.ReactNode;
    renderItem: (item: React.ReactNode, options?: { isSelected: boolean; isPrevious: boolean }) => React.ReactNode;
    renderThumbs: (children: React.ReactChild[]) => React.ReactChild[];
    selectedItem: number;
    showArrows: boolean;
    showStatus: boolean;
    showIndicators: boolean;
    showThumbs: boolean;
    statusFormatter: (currentItem: number, total: number) => string;
    stopOnHover: boolean;
    swipeable: boolean;
    swipeScrollTolerance: number;
    thumbWidth?: number;
    transitionTime: number;
    useKeyboardArrows?: boolean;
    verticalSwipe: 'natural' | 'standard';
    width: number | string;
    animationHandler: 'slide' | 'fade' | AnimationHandler;
    swipeAnimationHandler: SwipeAnimationHandler;
    stopSwipingHandler: StopSwipingHandler;
}

export interface CarouselState {
    autoPlay?: boolean;
    cancelClick: boolean;
    hasMount: boolean;
    initialized: boolean;
    isMouseEntered: boolean;
    itemSize: number;
    previousItem: number;
    selectedItem: number;
    swiping?: boolean;
    swipeMovementStarted: boolean;
    itemListStyle?: React.CSSProperties;
    slideStyle?: React.CSSProperties;
    selectedStyle?: React.CSSProperties;
    prevStyle?: React.CSSProperties;
}
