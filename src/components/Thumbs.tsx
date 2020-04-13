import React, { Component, Children, ReactElement, MouseEvent } from 'react';
import klass from '../cssClasses';
import { outerWidth } from '../dimensions';
import CSSTranslate from '../CSSTranslate';
import Swipe from 'react-easy-swipe';
import getWindow from '../shims/window';

const isKeyboardEvent = (e: React.MouseEvent | React.KeyboardEvent): e is React.KeyboardEvent =>
    e.hasOwnProperty('key');

interface Props {
    axis: 'horizontal' | 'vertical';
    children: React.ReactChild[];
    labels: {
        leftArrow: string;
        rightArrow: string;
        item: string;
    };
    onSelectItem: (index: number, item: React.ReactNode) => void;
    selectedItem: number;
    thumbWidth: number;
    transitionTime: number;
}

interface State {
    selectedItem: number;
    hasMount: boolean;
    firstItem: number;
    itemSize?: number;
    visibleItems: number;
    lastPosition: number;
    showArrows: boolean;
    images: React.ReactNode[];
    swiping: boolean;
}

class Thumbs extends Component<Props, State> {
    private itemsWrapperRef?: HTMLDivElement;
    private itemsListRef?: HTMLUListElement;
    private thumbsRef?: HTMLLIElement[];
    private lastPosition: number = 0;

    static displayName = 'Thumbs';

    static defaultProps = {
        axis: 'horizontal',
        labels: {
            leftArrow: 'previous slide / item',
            rightArrow: 'next slide / item',
            item: 'slide item',
        },
        selectedItem: 0,
        thumbWidth: 80,
        transitionTime: 350,
    };

    constructor(props: Props) {
        super(props);

        this.state = {
            selectedItem: props.selectedItem,
            hasMount: false,
            swiping: false,
            showArrows: false,
            firstItem: 0,
            visibleItems: 0,
            lastPosition: 0,
            images: this.getImages(),
        };
    }

    componentDidMount() {
        this.setupThumbs();
    }

    UNSAFE_componentWillReceiveProps(props: Props) {
        if (props.selectedItem !== this.state.selectedItem) {
            this.setState({
                selectedItem: props.selectedItem,
                firstItem: this.getFirstItem(props.selectedItem),
            });
        }
        if (props.children !== this.props.children) {
            this.setState({
                images: this.getImages(),
            });
        }
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.children === prevProps.children) {
            return;
        }

        // This will capture any size changes for arrow adjustments etc.
        // usually in the same render cycle so we don't see any flickers
        this.updateSizes();
    }

    componentWillUnmount() {
        this.destroyThumbs();
    }

    setItemsWrapperRef = (node: HTMLDivElement) => {
        this.itemsWrapperRef = node;
    };

    setItemsListRef = (node: HTMLUListElement) => {
        this.itemsListRef = node;
    };

    setThumbsRef = (node: HTMLLIElement, index: number) => {
        if (!this.thumbsRef) {
            this.thumbsRef = [];
        }
        this.thumbsRef[index] = node;
    };

    setupThumbs() {
        // as the widths are calculated, we need to resize
        // the carousel when the window is resized
        getWindow().addEventListener('resize', this.updateSizes);
        // issue #2 - image loading smaller
        getWindow().addEventListener('DOMContentLoaded', this.updateSizes);

        // when the component is rendered we need to calculate
        // the container size to adjust the responsive behaviour
        this.updateSizes();
    }

    destroyThumbs() {
        // removing listeners
        getWindow().removeEventListener('resize', this.updateSizes);
        getWindow().removeEventListener('DOMContentLoaded', this.updateSizes);
    }

    updateSizes = () => {
        if (!this.props.children || !this.itemsWrapperRef || this.state.images.length === 0 || !this.thumbsRef) {
            return;
        }

        const total = Children.count(this.props.children);
        const wrapperSize = this.itemsWrapperRef.clientWidth;
        const itemSize = this.props.thumbWidth ? this.props.thumbWidth : outerWidth(this.thumbsRef[0]);
        const visibleItems = Math.floor(wrapperSize / itemSize);
        const lastPosition = total - visibleItems;
        const showArrows = visibleItems < total;
        this.setState((_state, props) => ({
            itemSize,
            visibleItems,
            firstItem: showArrows ? this.getFirstItem(props.selectedItem) : 0,
            lastPosition,
            showArrows,
        }));
    };

    getImages() {
        const images = Children.map(this.props.children, (item) => {
            let img: React.ReactNode = item;

            // if the item is not an image, try to find the first image in the item's children.
            if ((item as React.ReactElement<{ children: React.ReactChild[] }>).type !== 'img') {
                img = Children.toArray(
                    (item as React.ReactElement<{ children: React.ReactChild[] }>).props.children
                ).find((children) => (children as React.ReactElement).type === 'img');
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
    }

    setMountState = () => {
        this.setState({ hasMount: true });
        this.updateSizes();
    };

    handleClickItem = (index: number, item: React.ReactNode, e: React.MouseEvent | React.KeyboardEvent) => {
        if (!isKeyboardEvent(e) || e.key === 'Enter') {
            const handler = this.props.onSelectItem;

            if (typeof handler === 'function') {
                handler(index, item);
            }
        }
    };

    onSwipeStart = () => {
        this.setState({
            swiping: true,
        });
    };

    onSwipeEnd = () => {
        this.setState({
            swiping: false,
        });
    };

    onSwipeMove = (deltaX: number) => {
        if (!this.state.itemSize || !this.itemsWrapperRef) {
            return;
        }
        const leftBoundary = 0;

        const currentPosition = -this.state.firstItem * this.state.itemSize;
        const lastLeftBoundary = -this.state.visibleItems * this.state.itemSize;

        // prevent user from swiping left out of boundaries
        if (currentPosition === leftBoundary && deltaX > 0) {
            deltaX = 0;
        }

        // prevent user from swiping right out of boundaries
        if (currentPosition === lastLeftBoundary && deltaX < 0) {
            deltaX = 0;
        }

        const wrapperSize = this.itemsWrapperRef.clientWidth;
        const position = currentPosition + 100 / (wrapperSize / deltaX);
        // if 3d isn't available we will use left to move
        if (this.itemsListRef) {
            ['WebkitTransform', 'MozTransform', 'MsTransform', 'OTransform', 'transform', 'msTransform'].forEach(
                (prop) => {
                    this.itemsListRef!.style[prop as any] = CSSTranslate(position, '%', this.props.axis);
                }
            );
        }
    };

    slideRight = (positions?: number) => {
        this.moveTo(this.state.firstItem - (typeof positions === 'number' ? positions : 1));
    };

    slideLeft = (positions?: number) => {
        this.moveTo(this.state.firstItem + (typeof positions === 'number' ? positions : 1));
    };

    moveTo = (position: number) => {
        // position can't be lower than 0
        position = position < 0 ? 0 : position;
        // position can't be higher than last postion
        position = position >= this.lastPosition ? this.lastPosition : position;

        this.setState({
            firstItem: position,
        });
    };

    getFirstItem(selectedItem: number) {
        let firstItem = selectedItem;

        if (selectedItem >= this.state.lastPosition) {
            firstItem = this.state.lastPosition;
        }

        if (selectedItem < this.state.firstItem + this.state.visibleItems) {
            firstItem = this.state.firstItem;
        }

        if (selectedItem < this.state.firstItem) {
            firstItem = selectedItem;
        }

        return firstItem;
    }

    renderItems() {
        return this.state.images.map((img, index) => {
            const itemClass = klass.ITEM(false, index === this.state.selectedItem && this.state.hasMount);

            const thumbProps = {
                key: index,
                ref: (e: HTMLLIElement) => this.setThumbsRef(e, index),
                className: itemClass,
                onClick: this.handleClickItem.bind(this, index, this.props.children[index]),
                onKeyDown: this.handleClickItem.bind(this, index, this.props.children[index]),
                'aria-label': `${this.props.labels.item} ${index + 1}`,
                style: { width: this.props.thumbWidth },
            };

            if (index === 0) {
                img = React.cloneElement(img, {
                    onLoad: this.setMountState,
                });
            }

            return (
                <li {...thumbProps} role="button" tabIndex={0}>
                    {img}
                </li>
            );
        });
    }

    render() {
        if (!this.props.children) {
            return null;
        }

        // show left arrow?
        const hasPrev = this.state.showArrows && this.state.firstItem > 0;
        // show right arrow
        const hasNext = this.state.showArrows && this.state.firstItem < this.state.lastPosition;
        // obj to hold the transformations and styles
        let itemListStyles = {};

        const currentPosition = -this.state.firstItem * (this.state.itemSize || 0);

        const transformProp = CSSTranslate(currentPosition, 'px', this.props.axis);

        const transitionTime = this.props.transitionTime + 'ms';

        itemListStyles = {
            WebkitTransform: transformProp,
            MozTransform: transformProp,
            MsTransform: transformProp,
            OTransform: transformProp,
            transform: transformProp,
            msTransform: transformProp,
            WebkitTransitionDuration: transitionTime,
            MozTransitionDuration: transitionTime,
            MsTransitionDuration: transitionTime,
            OTransitionDuration: transitionTime,
            transitionDuration: transitionTime,
            msTransitionDuration: transitionTime,
        };

        return (
            <div className={klass.CAROUSEL(false)}>
                <div className={klass.WRAPPER(false)} ref={this.setItemsWrapperRef}>
                    <button
                        type="button"
                        className={klass.ARROW_PREV(!hasPrev)}
                        onClick={() => this.slideRight()}
                        aria-label={this.props.labels.leftArrow}
                    />
                    <Swipe
                        tagName="ul"
                        className={klass.SLIDER(false, this.state.swiping)}
                        onSwipeLeft={this.slideLeft}
                        onSwipeRight={this.slideRight}
                        onSwipeMove={this.onSwipeMove}
                        onSwipeStart={this.onSwipeStart}
                        onSwipeEnd={this.onSwipeEnd}
                        style={itemListStyles}
                        innerRef={this.setItemsListRef}
                    >
                        {this.renderItems()}
                    </Swipe>
                    <button
                        type="button"
                        className={klass.ARROW_NEXT(!hasNext)}
                        onClick={() => this.slideLeft()}
                        aria-label={this.props.labels.rightArrow}
                    />
                </div>
            </div>
        );
    }
}

export default Thumbs;
