import React, { Component, Children } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import klass from '../cssClasses';
import CSSTranslate from '../CSSTranslate';
import Swipe from 'react-easy-swipe';
import Thumbs from './Thumbs';
import * as customPropTypes from '../customPropTypes';

const noop = () => {};

const defaultStatusFormatter = (current, total) => `${current} of ${total}`;

class Carousel extends Component {
    static displayName = 'Carousel';

    static propTypes = {
        className: PropTypes.string,
        children: PropTypes.node,
        showArrows: PropTypes.bool,
        showStatus: PropTypes.bool,
        showIndicators: PropTypes.bool,
        infiniteLoop: PropTypes.bool,
        showThumbs: PropTypes.bool,
        thumbWidth: PropTypes.number,
        selectedItem: PropTypes.number,
        onClickItem: PropTypes.func.isRequired,
        onClickThumb: PropTypes.func.isRequired,
        onChange: PropTypes.func.isRequired,
        axis: PropTypes.oneOf(['horizontal', 'vertical']),
        verticalSwipe: PropTypes.oneOf(['natural', 'standard']),
        width: customPropTypes.unit,
        useKeyboardArrows: PropTypes.bool,
        autoPlay: PropTypes.bool,
        stopOnHover: PropTypes.bool,
        interval: PropTypes.number,
        transitionTime: PropTypes.number,
        swipeScrollTolerance: PropTypes.number,
        swipeable: PropTypes.bool,
        dynamicHeight: PropTypes.bool,
        emulateTouch: PropTypes.bool,
        statusFormatter: PropTypes.func.isRequired,
        centerMode: PropTypes.bool,
        centerSlidePercentage: PropTypes.number
    };

    static defaultProps = {
        showIndicators: true,
        showArrows: true,
        showStatus:true,
        showThumbs:true,
        infiniteLoop: false,
        selectedItem: 0,
        axis: 'horizontal',
        verticalSwipe: 'standard',
        width: '100%',
        useKeyboardArrows: false,
        autoPlay: false,
        stopOnHover: true,
        interval: 3000,
        transitionTime: 350,
        swipeScrollTolerance: 5,
        swipeable: true,
        dynamicHeight: false,
        emulateTouch: false,
        onClickItem: noop,
        onClickThumb: noop,
        onChange: noop,
        statusFormatter: defaultStatusFormatter,
        centerMode: false,
        centerSlidePercentage: 80
    };

    constructor(props) {
        super(props);

        this.state = {
            initialized: false,
            selectedItem: props.selectedItem,
            hasMount: false,
            isMouseEntered: false,
            autoPlay: props.autoPlay
        };
    }

    componentDidMount () {
        if (!this.props.children) {
            return;
        }

        this.setupCarousel();
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.selectedItem !== this.state.selectedItem) {
            this.updateSizes();
            this.moveTo(nextProps.selectedItem);
        }

        if (nextProps.autoPlay !== this.state.autoPlay) {
            this.setState({
                autoPlay: nextProps.autoPlay
            }, () => {
                if (this.state.autoPlay) {
                    this.setupAutoPlay();
                } else {
                    this.destroyAutoPlay();
                }
            });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (!prevProps.children && this.props.children && !this.state.initialized) {
            this.setupCarousel();
        }
        if (prevState.swiping && !this.state.swiping) {
            // We stopped swiping, ensure we are heading to the new/current slide and not stuck
            this.resetPosition();
        }
    }

    componentWillUnmount() {
        this.destroyCarousel();
    }

    setThumbsRef = node => {
        this.thumbsRef = node;
    }

    setCarouselWrapperRef = node => {
        this.carouselWrapperRef = node;
    }

    setListRef = node => {
        this.listRef = node;
    }

    setItemsWrapperRef = node => {
        this.itemsWrapperRef = node;
    }

    setItemsRef = (node, index) => {
        if (!this.itemsRef) {
            this.itemsRef = [];
        }
        this.itemsRef[index] = node;
    }

    setupCarousel () {
        this.bindEvents();

        if (this.state.autoPlay && Children.count(this.props.children) > 1) {
            this.setupAutoPlay();
        }

        this.setState({
            initialized: true
        });

        const initialImage = this.getInitialImage()
        if (initialImage) {
            // if it's a carousel of images, we set the mount state after the first image is loaded
            initialImage.addEventListener('load', this.setMountState);
        } else {
            this.setMountState();
        }
    }

    destroyCarousel () {
        if (this.state.initialized) {
            this.unbindEvents();
            this.destroyAutoPlay();
        }
    }

    setupAutoPlay () {
        this.autoPlay();
        const carouselWrapper = this.carouselWrapperRef;

        if (this.props.stopOnHover && carouselWrapper) {
            carouselWrapper.addEventListener('mouseenter', this.stopOnHover);
            carouselWrapper.addEventListener('mouseleave', this.startOnLeave);
        }
    }

    destroyAutoPlay () {
        this.clearAutoPlay();
        const carouselWrapper = this.carouselWrapperRef;

        if (this.props.stopOnHover && carouselWrapper) {
            carouselWrapper.removeEventListener('mouseenter', this.stopOnHover);
            carouselWrapper.removeEventListener('mouseleave', this.startOnLeave);
        }
    }

    bindEvents () {
        // as the widths are calculated, we need to resize
        // the carousel when the window is resized
        window.addEventListener("resize", this.updateSizes);
        // issue #2 - image loading smaller
        window.addEventListener("DOMContentLoaded", this.updateSizes);

        if (this.props.useKeyboardArrows) {
            document.addEventListener("keydown", this.navigateWithKeyboard);
        }
    }

    unbindEvents () {
        // removing listeners
        window.removeEventListener("resize", this.updateSizes);
        window.removeEventListener("DOMContentLoaded", this.updateSizes);

        const initialImage = this.getInitialImage();
        if(initialImage) {
            initialImage.removeEventListener("load", this.setMountState);
        }

        if (this.props.useKeyboardArrows) {
            document.removeEventListener("keydown", this.navigateWithKeyboard);
        }
    }

    autoPlay = () => {
        if (!this.state.autoPlay || Children.count(this.props.children) <= 1) {
            return;
        }

        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.increment();
        }, this.props.interval);
    }

    clearAutoPlay = () => {
        if (!this.state.autoPlay) {
            return;
        }

        clearTimeout(this.timer);
    }

    resetAutoPlay = () => {
        this.clearAutoPlay();
        this.autoPlay();
    }

    stopOnHover = () => {
        this.setState({isMouseEntered: true});
        this.clearAutoPlay();
    }

    startOnLeave = () => {
        this.setState({isMouseEntered: false});
        this.autoPlay();
    }

    navigateWithKeyboard = (e) => {
        const { axis } = this.props;
        const isHorizontal = axis === 'horizontal';
        const keyNames = {
            ArrowUp: 38,
            ArrowRight: 39,
            ArrowDown: 40,
            ArrowLeft: 37
        };

        const nextKey = isHorizontal ? keyNames.ArrowRight : keyNames.ArrowDown;
        const prevKey = isHorizontal ? keyNames.ArrowLeft : keyNames.ArrowUp;

        if (nextKey === e.keyCode) {
            this.increment();
        } else if (prevKey === e.keyCode) {
            this.decrement();
        }
    }

    updateSizes = () => {
        if (!this.state.initialized) {
            return;
        }

        const isHorizontal = this.props.axis === 'horizontal';
        const firstItem = this.itemsRef[0];
        const itemSize = isHorizontal ? firstItem.clientWidth : firstItem.clientHeight;

        this.setState((_state, props) => ({
            itemSize: itemSize,
            wrapperSize: isHorizontal ? itemSize * Children.count(props.children) : itemSize
        }));

        if (this.thumbsRef) {
            this.thumbsRef.updateSizes();
        }
    }

    setMountState = () => {
        this.setState({hasMount: true});
        this.updateSizes();
    }

    handleClickItem = (index, item) => {
        if (Children.count(this.props.children) <= 1) {
            return;
        }

        if (this.state.cancelClick) {
            this.setState({
                cancelClick: false
            });

            return;
        }

        this.props.onClickItem(index, item);

        if (index !== this.state.selectedItem) {
            this.setState({
                selectedItem: index,
            });
        }
    }

    handleOnChange = (index, item) => {
        if (Children.count(this.props.children) <= 1) {
            return;
        }

        this.props.onChange(index, item);
    }

    handleClickThumb = (index, item) => {
        this.props.onClickThumb(index, item);

        this.selectItem({
            selectedItem: index
        });
    }

    onSwipeStart = () => {
        this.setState({
            swiping: true,
        });
        this.clearAutoPlay();
    }

    onSwipeEnd = () => {
        this.setState({
            swiping: false
        });
        this.autoPlay();
    }

    onSwipeMove = (delta) => {
        const isHorizontal = this.props.axis === 'horizontal';
        const childrenLength = Children.count(this.props.children);

        const initialBoundry = 0;

        const currentPosition = this.getPosition(this.state.selectedItem);
        const finalBoundry = this.props.infiniteLoop ? this.getPosition(childrenLength - 1) - 100 : this.getPosition(childrenLength - 1);

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

        let position = currentPosition + (100 / (this.state.itemSize / handledDelta));
        if (this.props.infiniteLoop) {
            // When allowing infinite loop, if we slide left from position 0 we reveal the cloned last slide that appears before it
            // if we slide even further we need to jump to other side so it can continue - and vice versa for the last slide
            if (this.state.selectedItem === 0 && position > -100) {
                position -= childrenLength * 100;
            } else if (this.state.selectedItem === childrenLength - 1 && position <  - childrenLength * 100) {
                position += childrenLength * 100;
            }
        }
        position += '%';
        this.setPosition(position);

        // allows scroll if the swipe was within the tolerance
        const hasMoved = Math.abs(axisDelta) > this.props.swipeScrollTolerance;

        if (hasMoved && !this.state.cancelClick) {
            this.setState({
                cancelClick: true
            });
        }

        return hasMoved;
    }

    getPosition(index) {
        if (this.props.infiniteLoop) {
            // index has to be added by 1 because of the first cloned slide
            ++index;
        }
        const childrenLength = Children.count(this.props.children);
        if (this.props.centerMode && this.props.axis === 'horizontal') {
            let currentPosition = - index * this.props.centerSlidePercentage;
            const lastPosition = childrenLength - 1;

            if (index && (index !== lastPosition || this.props.infiniteLoop)) {
                currentPosition += (100 - this.props.centerSlidePercentage) / 2;
            } else if (index === lastPosition) {
                currentPosition += (100 - this.props.centerSlidePercentage);
            }

            return currentPosition;
        }

        return - index * 100;
    }

    setPosition = (position, forceReflow) => {
        const list = ReactDOM.findDOMNode(this.listRef);        
        [
            'WebkitTransform',
            'MozTransform',
            'MsTransform',
            'OTransform',
            'transform',
            'msTransform'
        ].forEach((prop) => {
            list.style[prop] = CSSTranslate(position, this.props.axis);
        });
        if (forceReflow) {
            list.offsetLeft;
        }
    }

    resetPosition = () => {
        const currentPosition = this.getPosition(this.state.selectedItem) + '%';
        this.setPosition(currentPosition);
    }

    decrement = (positions = 1, fromSwipe = false) => {
        this.moveTo(this.state.selectedItem - (typeof positions === 'number' ? positions : 1), fromSwipe);
    }

    increment = (positions = 1, fromSwipe = false) => {
        this.moveTo(this.state.selectedItem + (typeof positions === 'number' ? positions : 1), fromSwipe);
    }

    moveTo = (position, fromSwipe) => {        
        const lastPosition = Children.count(this.props.children) - 1;
        const needClonedSlide = this.props.infiniteLoop && !fromSwipe && (position < 0 || position > lastPosition);
        const oldPosition = position;

        if (position < 0 ) {
          position = this.props.infiniteLoop ?  lastPosition : 0;
        }

        if (position > lastPosition) {
          position = this.props.infiniteLoop ? 0 : lastPosition;
        }

        if (needClonedSlide) {
            // set swiping true would disable transition time, then we set slider to cloned position and force a reflow
            // this is only needed for non-swiping situation
            this.setState({
                swiping: true
            }, () => {
                if (oldPosition < 0) {
                    if (this.props.centerMode && this.props.axis === 'horizontal') {
                        this.setPosition(`-${(lastPosition + 2) * this.props.centerSlidePercentage - (100 - this.props.centerSlidePercentage) / 2}%`, true);
                    } else {
                        this.setPosition(`-${(lastPosition + 2) * 100}%`, true);
                    }
                } else if (oldPosition > lastPosition) {
                    this.setPosition(0, true);
                }

                this.selectItem({
                    selectedItem: position,
                    swiping: false
                });
            });
        } else {
            this.selectItem({
                // if it's not a slider, we don't need to set position here
                selectedItem: position
            });
        }

        // don't reset auto play when stop on hover is enabled, doing so will trigger a call to auto play more than once
        // and will result in the interval function not being cleared correctly.
        if (this.state.autoPlay && this.state.isMouseEntered === false) {
            this.resetAutoPlay();
        }
    }

    onClickNext = () => {
        this.increment(1, false);
    }

    onClickPrev = () => {
        this.decrement(1, false);
    }

    onSwipeForward = () => {
        this.increment(1, true);
    }

    onSwipeBackwards = () => {
        this.decrement(1, true);
    }

    changeItem = (e) => {
        if (!e.key || e.key === 'Enter') {
            const newIndex = e.target.value;

            this.selectItem({
                selectedItem: newIndex
            });
        }
    }

    selectItem = (state, cb) => {
        this.setState(state, cb);
        this.handleOnChange(state.selectedItem, Children.toArray(this.props.children)[state.selectedItem]);
    }

    getInitialImage = () => {
        const selectedItem = this.props.selectedItem;
        const item = this.itemsRef && this.itemsRef[selectedItem];
        const images = item && item.getElementsByTagName('img');
        return images && images[selectedItem];
    }

    getVariableImageHeight = (position) => {
        const item = this.itemsRef && this.itemsRef[position];
        const images = item && item.getElementsByTagName('img');
        if (this.state.hasMount && images.length > 0) {
            const image = images[0];

            if (!image.complete) {
                // if the image is still loading, the size won't be available so we trigger a new render after it's done
                const onImageLoad = () => {
                    this.forceUpdate();
                    image.removeEventListener('load', onImageLoad);
                }

                image.addEventListener('load', onImageLoad);
            }

            const height = image.clientHeight;
            return height > 0 ? height : null;
        }

        return null;
    }

    renderItems (isClone) {
        return Children.map(this.props.children, (item, index) => {
            const slideProps = {
                ref: (e) => this.setItemsRef(e, index),
                key: 'itemKey' + index + (isClone ? 'clone' : ''),
                className: klass.ITEM(true, index === this.state.selectedItem),
                onClick: this.handleClickItem.bind(this, index, item)
            };

            if (this.props.centerMode && this.props.axis === 'horizontal') {
                slideProps.style = {
                    minWidth: this.props.centerSlidePercentage + '%'
                };
            }

            return (
                <li {...slideProps}>
                    { item }
                </li>
            );
        });
    }

    renderControls () {
        if (!this.props.showIndicators) {
            return null
        }

        return (
            <ul className="control-dots">
                {Children.map(this.props.children, (item, index) => {
                    return <li className={klass.DOT(index === this.state.selectedItem)} onClick={this.changeItem} onKeyDown={this.changeItem} value={index} key={index} role='button' tabIndex={0} />;
                })}
            </ul>
        );
    }

    renderStatus () {
        if (!this.props.showStatus) {
            return null
        }

        return <p className="carousel-status">{this.props.statusFormatter(this.state.selectedItem + 1, Children.count(this.props.children))}</p>;
    }

    renderThumbs () {
        if (!this.props.showThumbs || Children.count(this.props.children) === 0) {
            return null
        }

        return (
            <Thumbs ref={this.setThumbsRef} onSelectItem={this.handleClickThumb} selectedItem={this.state.selectedItem} transitionTime={this.props.transitionTime} thumbWidth={this.props.thumbWidth}>
                {this.props.children}
            </Thumbs>
        );
    }

    render () {
        if (!this.props.children || Children.count(this.props.children) === 0) {
            return null;
        }

        const isHorizontal = this.props.axis === 'horizontal';

        const canShowArrows = this.props.showArrows && Children.count(this.props.children) > 1;

        // show left arrow?
        const hasPrev = canShowArrows && (this.state.selectedItem > 0 || this.props.infiniteLoop);
        // show right arrow
        const hasNext = canShowArrows && (this.state.selectedItem < Children.count(this.props.children) - 1 || this.props.infiniteLoop);
        // obj to hold the transformations and styles
        let itemListStyles = {};

        const currentPosition = this.getPosition(this.state.selectedItem);

        // if 3d is available, let's take advantage of the performance of transform
        const transformProp = CSSTranslate(currentPosition + '%', this.props.axis);

        const transitionTime = this.props.transitionTime + 'ms';

        itemListStyles = {
                    'WebkitTransform': transformProp,
                       'MozTransform': transformProp,
                        'MsTransform': transformProp,
                         'OTransform': transformProp,
                          'transform': transformProp,
                        'msTransform': transformProp
        };

        if (!this.state.swiping) {
            itemListStyles = {
                ...itemListStyles,
               'WebkitTransitionDuration': transitionTime,
                  'MozTransitionDuration': transitionTime,
                   'MsTransitionDuration': transitionTime,
                    'OTransitionDuration': transitionTime,
                     'transitionDuration': transitionTime,
                   'msTransitionDuration': transitionTime
            };
        }

        const itemsClone = this.renderItems(true);
        const firstClone = itemsClone.shift();
        const lastClone = itemsClone.pop();

        let swiperProps = {
            selectedItem: this.state.selectedItem,
            className: klass.SLIDER(true, this.state.swiping),
            onSwipeMove: this.onSwipeMove,
            onSwipeStart: this.onSwipeStart,
            onSwipeEnd: this.onSwipeEnd,
            style: itemListStyles,
            tolerance: this.props.swipeScrollTolerance
        };

        const containerStyles = {};

        if (isHorizontal) {
            swiperProps.onSwipeLeft = this.onSwipeForward;
            swiperProps.onSwipeRight = this.onSwipeBackwards;

            if (this.props.dynamicHeight) {
                const itemHeight = this.getVariableImageHeight(this.state.selectedItem);
                swiperProps.style.height = itemHeight || 'auto';
                containerStyles.height = itemHeight || 'auto';
            }

        } else {            
            swiperProps.onSwipeUp = this.props.verticalSwipe === 'natural' ? this.onSwipeBackwards : this.onSwipeForward;
            swiperProps.onSwipeDown = this.props.verticalSwipe === 'natural' ? this.onSwipeForward : this.onSwipeBackwards;
            swiperProps.style.height = this.state.itemSize;
            containerStyles.height = this.state.itemSize;
        }
        return (
            <div className={this.props.className} ref={this.setCarouselWrapperRef}>
                <div className={klass.CAROUSEL(true)} style={{width: this.props.width}}>
                    <button type="button" className={klass.ARROW_PREV(!hasPrev)} onClick={this.onClickPrev} />
                    <div className={klass.WRAPPER(true, this.props.axis)} style={containerStyles} ref={this.setItemsWrapperRef}>
                        { this.props.swipeable ?
                            <Swipe
                                tagName="ul"
                                ref={this.setListRef}
                                {...swiperProps}
                                allowMouseEvents={this.props.emulateTouch}>
                                { this.props.infiniteLoop && lastClone }
                                { this.renderItems() }
                                { this.props.infiniteLoop && firstClone }
                            </Swipe> :
                            <ul
                                className={klass.SLIDER(true, this.state.swiping)}
                                ref={this.setListRef}
                                style={itemListStyles}>
                                { this.props.infiniteLoop && lastClone }
                                { this.renderItems() }
                                { this.props.infiniteLoop && firstClone }
                            </ul>
                        }
                    </div>
                    <button type="button" className={klass.ARROW_NEXT(!hasNext)} onClick={this.onClickNext} />

                    { this.renderControls() }
                    { this.renderStatus() }
                </div>
                { this.renderThumbs() }
            </div>
        );

    }
}

export default Carousel;
