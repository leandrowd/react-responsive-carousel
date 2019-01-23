import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import klass from '../cssClasses';
import { outerWidth } from '../dimensions';
import CSSTranslate from '../CSSTranslate';
import Swipe from 'react-easy-swipe';

class Thumbs extends Component {
    static displayName = 'Thumbs';

    static propsTypes = {
        children: PropTypes.element.isRequired,
        transitionTime: PropTypes.number,
        selectedItem: PropTypes.number,
        thumbWidth: PropTypes.number
    };

    static defaultProps = {
        selectedItem: 0,
        transitionTime: 350,
        axis: 'horizontal'
    };

    constructor(props) {
        super(props);

        this.state = {
            selectedItem: props.selectedItem,
            hasMount: false,
            firstItem: 0,
            itemSize: null,
            visibleItems: 0,
            lastPosition: 0,
            showArrows: false,
            images: this.getImages()
        }
    }

    componentDidMount(nextProps) {
        this.setupThumbs();
    }

    componentWillReceiveProps(props, state) {
        if (props.selectedItem !== this.state.selectedItem) {
            this.setState({
                selectedItem: props.selectedItem,
                firstItem: this.getFirstItem(props.selectedItem)
            });
        }
        if (props.children !== this.props.children) {
            this.setState({
               images: this.getImages()
            });
        }
    }

    componentDidUpdate(prevProps) {
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

    setItemsWrapperRef = node => {
        this.itemsWrapperRef = node;
    }

    setItemsListRef = node => {
        this.itemsListRef = node;
    }

    setThumbsRef = (node, index) => {
        if (!this.thumbsRef) {
            this.thumbsRef = [];
        }
        this.thumbsRef[index] = node;
    }

    setupThumbs() {
        // as the widths are calculated, we need to resize
        // the carousel when the window is resized
        window.addEventListener("resize", this.updateSizes);
        // issue #2 - image loading smaller
        window.addEventListener("DOMContentLoaded", this.updateSizes);

        // when the component is rendered we need to calculate
        // the container size to adjust the responsive behaviour
        this.updateSizes();
    }

    destroyThumbs() {
        // removing listeners
        window.removeEventListener("resize", this.updateSizes);
        window.removeEventListener("DOMContentLoaded", this.updateSizes);
    }

    updateSizes = () => {
        if (!this.props.children || !this.itemsWrapperRef) {
            return;
        }

        const total = this.props.children.length;
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
            showArrows
        }))
    }

    getImages() {
        const images = Children.map(this.props.children, (item, index) => {
            let img = item;

            // if the item is not an image, try to find the first image in the item's children.
            if (item.type !== "img") {
                img = Children.toArray(item.props.children).filter((children) => children.type === "img")[0];
            }

            if (!img || img.length === 0) {
                return null;
            }

            return img;
        });

        if (images.filter(image => image !== null).length === 0) {
            console.warn(`No images found! Can't build the thumb list without images. If you don't need thumbs, set showThumbs={false} in the Carousel. Note that it's not possible to get images rendered inside custom components. More info at https://github.com/leandrowd/react-responsive-carousel/blob/master/TROUBLESHOOTING.md`);

            return null;
        }

        return images;
    }

    setMountState = () => {
        this.setState({hasMount: true});
        this.updateSizes();
    }

    handleClickItem = (index, item, e) => {
        if (!e.keyCode || e.key === 'Enter') {
            const handler = this.props.onSelectItem;

            if (typeof handler === 'function') {
                handler(index, item);
            }
        }
    }

    onSwipeStart = () => {
        this.setState({
            swiping: true
        });
    }

    onSwipeEnd = () => {
        this.setState({
            swiping: false
        });
    }

    onSwipeMove = (deltaX) => {
        const leftBoundary = 0;

        const currentPosition = - this.state.firstItem * this.state.itemSize;
        const lastLeftBoundary = - this.state.visibleItems * this.state.itemSize;

        // prevent user from swiping left out of boundaries
        if (currentPosition === leftBoundary && deltaX > 0) {
            deltaX = 0;
        }

        // prevent user from swiping right out of boundaries
        if (currentPosition === lastLeftBoundary && deltaX < 0) {
            deltaX = 0;
        }

        const wrapperSize = this.itemsWrapperRef.clientWidth;
        const position = currentPosition + (100 / (wrapperSize / deltaX)) + '%';

        // if 3d isn't available we will use left to move
        if (this.itemsListRef) {
            [
                'WebkitTransform',
                'MozTransform',
                'MsTransform',
                'OTransform',
                'transform',
                'msTransform'
            ].forEach((prop) => {
                this.itemsListRef.style[prop] = CSSTranslate(position, this.props.axis);
            });
        }
    }

    slideRight = (positions) => {
        this.moveTo(this.state.firstItem - (typeof positions === 'number' ? positions : 1));
    }

    slideLeft = (positions) => {
        this.moveTo(this.state.firstItem + (typeof positions === 'number' ? positions : 1));
    }

    moveTo = (position) => {
        // position can't be lower than 0
        position = position < 0 ? 0 : position;
        // position can't be higher than last postion
        position = position >= this.lastPosition ? this.lastPosition : position;

        this.setState({
            firstItem: position,
            // if it's not a slider, we don't need to set position here
            selectedItem: this.state.selectedItem
        });
    }

    getFirstItem (selectedItem) {
        let firstItem = selectedItem;

        if (selectedItem >= this.state.lastPosition) {
            firstItem = this.state.lastPosition;
        }

        if (selectedItem < (this.state.firstItem + this.state.visibleItems)) {
            firstItem = this.state.firstItem;
        }

        if (selectedItem < this.state.firstItem) {
            firstItem = selectedItem;
        }

        return firstItem;
    }

    renderItems () {
        return this.state.images.map((img, index) => {
            const itemClass = klass.ITEM(false, index === this.state.selectedItem && this.state.hasMount);

            const thumbProps = {
              key: index,
              ref: e => this.setThumbsRef(e, index),
              className: itemClass,
              onClick: this.handleClickItem.bind(this, index, this.props.children[index]),
              onKeyDown: this.handleClickItem.bind(this, index, this.props.children[index])
            };

            if (index === 0) {
                img = React.cloneElement(img, {
                    onLoad: this.setMountState
                });
            }

            return (
                <li {...thumbProps} role='button' tabIndex={0}>
                    { img }
                </li>
            );
        });
    }

    render () {
        if (!this.props.children) {
            return null;
        }

        // show left arrow?
        const hasPrev = this.state.showArrows && this.state.firstItem > 0;
        // show right arrow
        const hasNext = this.state.showArrows && this.state.firstItem < this.state.lastPosition;
        // obj to hold the transformations and styles
        let itemListStyles = {};

        const currentPosition = - this.state.firstItem * this.state.itemSize + 'px';

        const transformProp = CSSTranslate(currentPosition, this.props.axis);

        const transitionTime = this.props.transitionTime + 'ms';

        itemListStyles = {
                    'WebkitTransform': transformProp,
                       'MozTransform': transformProp,
                        'MsTransform': transformProp,
                         'OTransform': transformProp,
                          'transform': transformProp,
                        'msTransform': transformProp,
           'WebkitTransitionDuration': transitionTime,
              'MozTransitionDuration': transitionTime,
               'MsTransitionDuration': transitionTime,
                'OTransitionDuration': transitionTime,
                 'transitionDuration': transitionTime,
               'msTransitionDuration': transitionTime
        };

        return (
            <div className={klass.CAROUSEL(false)}>
                <div className={klass.WRAPPER(false)} ref={this.setItemsWrapperRef}>
                    <button type="button" className={klass.ARROW_PREV(!hasPrev)} onClick={this.slideRight} />
                    <Swipe tagName="ul"
                        selectedItem={this.state.selectedItem}
                        className={klass.SLIDER(false, this.state.swiping)}
                        onSwipeLeft={this.slideLeft}
                        onSwipeRight={this.slideRight}
                        onSwipeMove={this.onSwipeMove}
                        onSwipeStart={this.onSwipeStart}
                        onSwipeEnd={this.onSwipeEnd}
                        style={itemListStyles}
                        ref={this.setItemsListRef}>
                        { this.renderItems() }
                    </Swipe>
                    <button type="button" className={klass.ARROW_NEXT(!hasNext)} onClick={this.slideLeft} />
                </div>
            </div>
        );
    }
}

export default Thumbs;
