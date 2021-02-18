import React, { Children } from 'react';
import ReactDOM from 'react-dom';
// @ts-ignore
import Swipe, { ReactEasySwipeProps } from 'react-easy-swipe';
import klass from '../../cssClasses';
import CSSTranslate from '../../CSSTranslate';
import Thumbs from '../Thumbs';
import getDocument from '../../shims/document';
import getWindow from '../../shims/window';
import { noop, defaultStatusFormatter, isKeyboardEvent } from './utils';
import { CarouselProps, CarouselState } from './types';
import { slideAnimationHandler } from './animations';

export default class Carousel extends React.Component<CarouselProps, CarouselState> {
    private thumbsRef?: Thumbs; // HTML ref for Thumbnails
    private carouselWrapperRef?: HTMLDivElement; // HTML ref for wrapper element
    private listRef?: HTMLElement | HTMLUListElement; // HTML ref for list containing slides
    private itemsRef?: HTMLElement[]; // HTML ref ro slide items
    private timer?: ReturnType<typeof setTimeout>;

    static displayName = 'Carousel';

    static defaultProps: CarouselProps = {
        axis: 'horizontal',
        centerSlidePercentage: 80,
        interval: 3000,
        labels: {
            leftArrow: 'previous slide / item',
            rightArrow: 'next slide / item',
            item: 'slide item',
        },
        onClickItem: noop,
        onClickThumb: noop,
        onChange: noop,
        onSwipeStart: () => {},
        onSwipeEnd: () => {},
        onSwipeMove: () => false,
        preventMovementUntilSwipeScrollTolerance: false,
        renderArrowPrev: (onClickHandler: () => void, hasPrev: boolean, label: string) => (
            <button type="button" aria-label={label} className={klass.ARROW_PREV(!hasPrev)} onClick={onClickHandler} />
        ),
        renderArrowNext: (onClickHandler: () => void, hasNext: boolean, label: string) => (
            <button type="button" aria-label={label} className={klass.ARROW_NEXT(!hasNext)} onClick={onClickHandler} />
        ),
        renderIndicator: (
            onClickHandler: (e: React.MouseEvent | React.KeyboardEvent) => void,
            isSelected: boolean,
            index: number,
            label: string
        ) => {
            return (
                <li
                    className={klass.DOT(isSelected)}
                    onClick={onClickHandler}
                    onKeyDown={onClickHandler}
                    value={index}
                    key={index}
                    role="button"
                    tabIndex={0}
                    aria-label={`${label} ${index + 1}`}
                />
            );
        },
        renderItem: (item: React.ReactNode) => {
            return item;
        },
        renderThumbs: (children: React.ReactChild[]) => {
            const images = Children.map<React.ReactChild | undefined, React.ReactChild>(children, (item) => {
                let img: React.ReactChild | undefined = item;

                // if the item is not an image, try to find the first image in the item's children.
                if ((item as React.ReactElement<{ children: React.ReactChild[] }>).type !== 'img') {
                    img = (Children.toArray((item as React.ReactElement).props.children) as React.ReactChild[]).find(
                        (children) => (children as React.ReactElement).type === 'img'
                    );
                }

                if (!img) {
                    return undefined;
                }

                return img;
            });

            if (images.filter((image) => image).length === 0) {
                console.warn(
                    `No images found! Can't build the thumb list without images. If you don't need thumbs, set showThumbs={false} in the Carousel. Note that it's not possible to get images rendered inside custom components. More info at https://github.com/leandrowd/react-responsive-carousel/blob/master/TROUBLESHOOTING.md`
                );

                return [];
            }

            return images;
        },
        statusFormatter: defaultStatusFormatter,
        selectedItem: 0,
        showArrows: true,
        showIndicators: true,
        showStatus: true,
        showThumbs: true,
        stopOnHover: true,
        swipeScrollTolerance: 5,
        swipeable: true,
        transitionTime: 350,
        verticalSwipe: 'standard',
        width: '100%',
        animationHandler: slideAnimationHandler,
        swipeAnimationHandler: () => {},
    };

    constructor(props: CarouselProps) {
        super(props);

        this.state = {
            initialized: false,
            previousItem: props.selectedItem,
            selectedItem: props.selectedItem,
            hasMount: false,
            isMouseEntered: false,
            autoPlay: props.autoPlay,
            swiping: false,
            swipeMovementStarted: false,
            cancelClick: false,
            itemSize: 1,
        };
    }

    componentDidMount() {
        if (!this.props.children) {
            return;
        }

        this.setupCarousel();
    }

    componentDidUpdate(prevProps: CarouselProps, prevState: CarouselState) {
        if (!prevProps.children && this.props.children && !this.state.initialized) {
            this.setupCarousel();
        }

        if (!prevProps.autoFocus && this.props.autoFocus) {
            this.forceFocus();
        }

        // NOTE swipe refactor to animation
        if (prevState.swiping && !this.state.swiping) {
            // We stopped swiping, ensure we are heading to the new/current slide and not stuck
            this.resetPosition();
        }

        if (prevProps.selectedItem !== this.props.selectedItem || prevProps.centerMode !== this.props.centerMode) {
            this.updateSizes();
            this.moveTo(this.props.selectedItem);
        }

        if (prevProps.autoPlay !== this.props.autoPlay) {
            if (this.props.autoPlay) {
                this.setupAutoPlay();
            } else {
                this.destroyAutoPlay();
            }

            this.setState({ autoPlay: this.props.autoPlay });
        }
    }

    componentWillUnmount() {
        this.destroyCarousel();
    }

    setThumbsRef = (node: Thumbs) => {
        this.thumbsRef = node;
    };

    setCarouselWrapperRef = (node: HTMLDivElement) => {
        this.carouselWrapperRef = node;
    };

    setListRef = (node: HTMLElement | HTMLUListElement) => {
        this.listRef = node;
    };

    setItemsRef = (node: HTMLElement, index: number) => {
        if (!this.itemsRef) {
            this.itemsRef = [];
        }
        this.itemsRef[index] = node;
    };

    setupCarousel() {
        this.bindEvents();

        if (this.state.autoPlay && Children.count(this.props.children) > 1) {
            this.setupAutoPlay();
        }

        if (this.props.autoFocus) {
            this.forceFocus();
        }

        this.setState(
            {
                initialized: true,
            },
            () => {
                const initialImage = this.getInitialImage();
                if (initialImage && !initialImage.complete) {
                    // if it's a carousel of images, we set the mount state after the first image is loaded
                    initialImage.addEventListener('load', this.setMountState);
                } else {
                    this.setMountState();
                }
            }
        );
    }

    destroyCarousel() {
        if (this.state.initialized) {
            this.unbindEvents();
            this.destroyAutoPlay();
        }
    }

    setupAutoPlay() {
        this.autoPlay();
        const carouselWrapper = this.carouselWrapperRef;

        if (this.props.stopOnHover && carouselWrapper) {
            carouselWrapper.addEventListener('mouseenter', this.stopOnHover);
            carouselWrapper.addEventListener('mouseleave', this.startOnLeave);
        }
    }

    destroyAutoPlay() {
        this.clearAutoPlay();
        const carouselWrapper = this.carouselWrapperRef;

        if (this.props.stopOnHover && carouselWrapper) {
            carouselWrapper.removeEventListener('mouseenter', this.stopOnHover);
            carouselWrapper.removeEventListener('mouseleave', this.startOnLeave);
        }
    }

    bindEvents() {
        // as the widths are calculated, we need to resize
        // the carousel when the window is resized
        getWindow().addEventListener('resize', this.updateSizes);
        // issue #2 - image loading smaller
        getWindow().addEventListener('DOMContentLoaded', this.updateSizes);

        if (this.props.useKeyboardArrows) {
            getDocument().addEventListener('keydown', this.navigateWithKeyboard);
        }
    }

    unbindEvents() {
        // removing listeners
        getWindow().removeEventListener('resize', this.updateSizes);
        getWindow().removeEventListener('DOMContentLoaded', this.updateSizes);

        const initialImage = this.getInitialImage();

        if (initialImage) {
            initialImage.removeEventListener('load', this.setMountState);
        }

        if (this.props.useKeyboardArrows) {
            getDocument().removeEventListener('keydown', this.navigateWithKeyboard);
        }
    }

    autoPlay = () => {
        if (Children.count(this.props.children) <= 1) {
            return;
        }

        this.clearAutoPlay();

        this.timer = setTimeout(() => {
            this.increment();
        }, this.props.interval);
    };

    clearAutoPlay = () => {
        if (this.timer) clearTimeout(this.timer);
    };

    resetAutoPlay = () => {
        this.clearAutoPlay();
        this.autoPlay();
    };

    stopOnHover = () => {
        this.setState({ isMouseEntered: true }, this.clearAutoPlay);
    };

    startOnLeave = () => {
        this.setState({ isMouseEntered: false }, this.autoPlay);
    };

    forceFocus() {
        this.carouselWrapperRef?.focus();
    }

    isFocusWithinTheCarousel = () => {
        if (!this.carouselWrapperRef) {
            return false;
        }

        if (
            getDocument().activeElement === this.carouselWrapperRef ||
            this.carouselWrapperRef.contains(getDocument().activeElement)
        ) {
            return true;
        }

        return false;
    };

    navigateWithKeyboard = (e: KeyboardEvent) => {
        if (!this.isFocusWithinTheCarousel()) {
            return;
        }

        const { axis } = this.props;
        const isHorizontal = axis === 'horizontal';
        const keyNames = {
            ArrowUp: 38,
            ArrowRight: 39,
            ArrowDown: 40,
            ArrowLeft: 37,
        };

        const nextKey = isHorizontal ? keyNames.ArrowRight : keyNames.ArrowDown;
        const prevKey = isHorizontal ? keyNames.ArrowLeft : keyNames.ArrowUp;

        if (nextKey === e.keyCode) {
            this.increment();
        } else if (prevKey === e.keyCode) {
            this.decrement();
        }
    };

    updateSizes = () => {
        if (!this.state.initialized || !this.itemsRef || this.itemsRef.length === 0) {
            return;
        }
        const isHorizontal = this.props.axis === 'horizontal';
        const firstItem = this.itemsRef[0];
        if (!firstItem) {
            return;
        }
        const itemSize = isHorizontal ? firstItem.clientWidth : firstItem.clientHeight;

        this.setState({
            itemSize,
        });

        if (this.thumbsRef) {
            this.thumbsRef.updateSizes();
        }
    };

    setMountState = () => {
        this.setState({ hasMount: true });
        this.updateSizes();
    };

    handleClickItem = (index: number, item: React.ReactNode) => {
        if (Children.count(this.props.children) === 0) {
            return;
        }

        if (this.state.cancelClick) {
            this.setState({
                cancelClick: false,
            });

            return;
        }

        this.props.onClickItem(index, item);

        if (index !== this.state.selectedItem) {
            this.setState({
                selectedItem: index,
            });
        }
    };

    /**
     * On Change handler, Passes the index and React node to the supplied onChange prop
     * @param index of the carousel item
     * @param item React node of the item being changed
     */
    handleOnChange = (index: number, item: React.ReactNode) => {
        if (Children.count(this.props.children) <= 1) {
            return;
        }

        this.props.onChange(index, item);
    };

    handleClickThumb = (index: number, item: React.ReactNode) => {
        this.props.onClickThumb(index, item);

        this.selectItem({
            selectedItem: index,
        });
    };

    onSwipeStart = (event: React.TouchEvent) => {
        this.setState({
            swiping: true,
        });
        this.props.onSwipeStart(event);
        this.clearAutoPlay();
    };

    onSwipeEnd = (event: React.TouchEvent) => {
        this.setState({
            swiping: false,
            cancelClick: false,
            swipeMovementStarted: false,
        });
        this.props.onSwipeEnd(event);
        this.autoPlay();
    };

    /**
     * Handles swipe move, directly updating carousel position
     * NOTE: need to swipe refactor this out to a handler
     * @param delta
     * @param event
     */
    onSwipeMove = (delta: { x: number; y: number }, event: React.TouchEvent) => {
        this.props.onSwipeMove(event);
        this.props.swipeAnimationHandler(delta, this.props, this.state);
    };

    /**
     * Decrements the selectedItem index a number of positions through the children list
     * @param positions
     * @param fromSwipe
     */
    decrement = (positions = 1) => {
        this.moveTo(this.state.selectedItem - (typeof positions === 'number' ? positions : 1));
    };

    /**
     * Increments the selectedItem index a number of positions through the children list
     * @param positions
     * @param fromSwipe
     */
    increment = (positions = 1) => {
        this.moveTo(this.state.selectedItem + (typeof positions === 'number' ? positions : 1));
    };

    /**
     * Moves the selected item to the position provided
     * @param position
     * @param fromSwipe
     */
    moveTo = (position?: number) => {
        if (typeof position !== 'number') {
            return;
        }

        const lastPosition = Children.count(this.props.children) - 1;

        if (position < 0) {
            position = this.props.infiniteLoop ? lastPosition : 0;
        }

        if (position > lastPosition) {
            position = this.props.infiniteLoop ? 0 : lastPosition;
        }

        this.selectItem({
            // if it's not a slider, we don't need to set position here
            selectedItem: position,
        });

        // don't reset auto play when stop on hover is enabled, doing so will trigger a call to auto play more than once
        // and will result in the interval function not being cleared correctly.
        if (this.state.autoPlay && this.state.isMouseEntered === false) {
            this.resetAutoPlay();
        }
    };

    onClickNext = () => {
        this.increment(1, false);
    };

    onClickPrev = () => {
        this.decrement(1, false);
    };

    onSwipeForward = () => {
        this.increment(1, true);

        if (this.props.emulateTouch) {
            this.setState({ cancelClick: true });
        }
    };

    onSwipeBackwards = () => {
        this.decrement(1, true);

        if (this.props.emulateTouch) {
            this.setState({ cancelClick: true });
        }
    };

    changeItem = (newIndex: number) => (e: React.MouseEvent | React.KeyboardEvent) => {
        if (!isKeyboardEvent(e) || e.key === 'Enter') {
            this.selectItem({
                selectedItem: newIndex,
            });
        }
    };

    /**
     * This function is called when you want to 'select' a new item, or rather move to a 'selected' item
     * It also handles the onChange callback wrapper
     * @param state state object with updated selected item, and swiping bool if relevant
     * @param cb callback to fire after selectItem is fired
     */
    selectItem = (state: Pick<CarouselState, 'selectedItem' | 'swiping'>, cb?: () => void) => {
        // Merge in the new state while updating updating previous item
        this.setState(
            {
                previousItem: this.state.selectedItem,
                ...state,
            },
            cb
        );
        this.handleOnChange(state.selectedItem, Children.toArray(this.props.children)[state.selectedItem]);
    };

    getInitialImage = () => {
        const selectedItem = this.props.selectedItem;
        const item = this.itemsRef && this.itemsRef[selectedItem];
        const images = (item && item.getElementsByTagName('img')) || [];
        return images[0];
    };

    getVariableItemHeight = (position: number) => {
        const item = this.itemsRef && this.itemsRef[position];

        if (this.state.hasMount && item && item.children.length) {
            const slideImages = item.children[0].getElementsByTagName('img') || [];

            if (slideImages.length > 0) {
                const image = slideImages[0];

                if (!image.complete) {
                    // if the image is still loading, the size won't be available so we trigger a new render after it's done
                    const onImageLoad = () => {
                        this.forceUpdate();
                        image.removeEventListener('load', onImageLoad);
                    };

                    image.addEventListener('load', onImageLoad);
                }
            }

            // try to get img first, if img not there find first display tag
            const displayItem = slideImages[0] || item.children[0];
            const height = displayItem.clientHeight;
            return height > 0 ? height : null;
        }

        return null;
    };

    renderItems(isClone?: boolean) {
        if (!this.props.children) {
            return [];
        }

        return Children.map(this.props.children, (item, index) => {
            const slideProps = {
                ref: (e: HTMLLIElement) => this.setItemsRef(e, index),
                key: 'itemKey' + index + (isClone ? 'clone' : ''),
                className: klass.ITEM(true, index === this.state.selectedItem, index === this.state.previousItem),
                onClick: this.handleClickItem.bind(this, index, item),
            };

            let extraProps: {
                style?: React.CSSProperties;
            } = {};

            if (this.props.centerMode && this.props.axis === 'horizontal') {
                extraProps.style = {
                    minWidth: this.props.centerSlidePercentage + '%',
                };
            }

            return (
                <li {...slideProps} {...extraProps}>
                    {this.props.renderItem(item, {
                        isSelected: index === this.state.selectedItem,
                        isPrevious: index === this.state.previousItem,
                    })}
                </li>
            );
        });
    }

    renderControls() {
        const { showIndicators, labels, renderIndicator, children } = this.props;
        if (!showIndicators) {
            return null;
        }

        return (
            <ul className="control-dots">
                {Children.map(children, (_, index) => {
                    return (
                        renderIndicator &&
                        renderIndicator(this.changeItem(index), index === this.state.selectedItem, index, labels.item)
                    );
                })}
            </ul>
        );
    }

    renderStatus() {
        if (!this.props.showStatus) {
            return null;
        }

        return (
            <p className="carousel-status">
                {this.props.statusFormatter(this.state.selectedItem + 1, Children.count(this.props.children))}
            </p>
        );
    }

    renderThumbs() {
        if (!this.props.showThumbs || !this.props.children || Children.count(this.props.children) === 0) {
            return null;
        }

        return (
            <Thumbs
                ref={this.setThumbsRef}
                onSelectItem={this.handleClickThumb}
                selectedItem={this.state.selectedItem}
                transitionTime={this.props.transitionTime}
                thumbWidth={this.props.thumbWidth}
                labels={this.props.labels}
            >
                {this.props.renderThumbs(this.props.children)}
            </Thumbs>
        );
    }

    render() {
        if (!this.props.children || Children.count(this.props.children) === 0) {
            return null;
        }

        const isSwipeable = this.props.swipeable && Children.count(this.props.children) > 1;

        const isHorizontal = this.props.axis === 'horizontal';

        const canShowArrows = this.props.showArrows && Children.count(this.props.children) > 1;

        // show left arrow?
        const hasPrev = (canShowArrows && (this.state.selectedItem > 0 || this.props.infiniteLoop)) || false;
        // show right arrow
        const hasNext =
            (canShowArrows &&
                (this.state.selectedItem < Children.count(this.props.children) - 1 || this.props.infiniteLoop)) ||
            false;

        // NOTE: Parts of this needs to be refactored
        const { itemListStyles, seledtedStyles, prevStyles } = this.props.animationHandler(this.props, this.state);
        // obj to hold the transformations and styles

        const currentPosition = this.getPosition(this.state.selectedItem);

        // if 3d is available, let's take advantage of the performance of transform
        const transformProp = CSSTranslate(currentPosition, '%', this.props.axis);

        const transitionTime = this.props.transitionTime + 'ms';

        itemListStyles = {
            WebkitTransform: transformProp,
            MozTransform: transformProp,
            MsTransform: transformProp,
            OTransform: transformProp,
            transform: transformProp,
            msTransform: transformProp,
        };

        if (!this.state.swiping) {
            itemListStyles = {
                ...itemListStyles,
                WebkitTransitionDuration: transitionTime,
                MozTransitionDuration: transitionTime,
                MsTransitionDuration: transitionTime,
                OTransitionDuration: transitionTime,
                transitionDuration: transitionTime,
                msTransitionDuration: transitionTime,
            };
        }

        const itemsClone = this.renderItems(true);
        const firstClone = itemsClone.shift();
        const lastClone = itemsClone.pop();

        let swiperProps: ReactEasySwipeProps = {
            className: klass.SLIDER(true, this.state.swiping),
            onSwipeMove: this.onSwipeMove,
            onSwipeStart: this.onSwipeStart,
            onSwipeEnd: this.onSwipeEnd,
            style: itemListStyles,
            tolerance: this.props.swipeScrollTolerance,
        };

        const containerStyles: React.CSSProperties = {};

        if (isHorizontal) {
            swiperProps.onSwipeLeft = this.onSwipeForward;
            swiperProps.onSwipeRight = this.onSwipeBackwards;

            if (this.props.dynamicHeight) {
                const itemHeight = this.getVariableItemHeight(this.state.selectedItem);
                swiperProps.style.height = itemHeight || 'auto';
                containerStyles.height = itemHeight || 'auto';
            }
        } else {
            swiperProps.onSwipeUp =
                this.props.verticalSwipe === 'natural' ? this.onSwipeBackwards : this.onSwipeForward;
            swiperProps.onSwipeDown =
                this.props.verticalSwipe === 'natural' ? this.onSwipeForward : this.onSwipeBackwards;
            swiperProps.style.height = this.state.itemSize;
            containerStyles.height = this.state.itemSize;
        }
        // NOTE: Parts of this needs to be refactored
        return (
            <div className={klass.ROOT(this.props.className)} ref={this.setCarouselWrapperRef} tabIndex={0}>
                <div className={klass.CAROUSEL(true)} style={{ width: this.props.width }}>
                    {this.renderControls()}
                    {this.props.renderArrowPrev(this.onClickPrev, hasPrev, this.props.labels.leftArrow)}
                    <div className={klass.WRAPPER(true, this.props.axis)} style={containerStyles}>
                        {isSwipeable ? (
                            <Swipe
                                tagName="ul"
                                innerRef={this.setListRef}
                                {...swiperProps}
                                allowMouseEvents={this.props.emulateTouch}
                            >
                                {this.props.infiniteLoop && lastClone}
                                {this.renderItems()}
                                {this.props.infiniteLoop && firstClone}
                            </Swipe>
                        ) : (
                            <ul
                                className={klass.SLIDER(true, this.state.swiping)}
                                ref={(node: HTMLUListElement) => this.setListRef(node)}
                                style={itemListStyles}
                            >
                                {this.props.infiniteLoop && lastClone}
                                {this.renderItems()}
                                {this.props.infiniteLoop && firstClone}
                            </ul>
                        )}
                    </div>
                    {this.props.renderArrowNext(this.onClickNext, hasNext, this.props.labels.rightArrow)}
                    {this.renderStatus()}
                </div>
                {this.renderThumbs()}
            </div>
        );
    }
}
