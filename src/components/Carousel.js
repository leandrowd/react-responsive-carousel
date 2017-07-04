import React, { Component } from 'react';
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
        selectedItem: PropTypes.number,
        onClickItem: PropTypes.func.isRequired,
        onClickThumb: PropTypes.func.isRequired,
        onChange: PropTypes.func.isRequired,
        axis: PropTypes.oneOf(['horizontal', 'vertical']),
        width: customPropTypes.unit,
        useKeyboardArrows: PropTypes.bool,
        autoPlay: PropTypes.bool,
        stopOnHover: PropTypes.bool,
        interval: PropTypes.number,
        transitionTime: PropTypes.number,
        swipeScrollTolerance: PropTypes.number,
        dynamicHeight: PropTypes.bool,
        emulateTouch: PropTypes.bool,
        statusFormatter: PropTypes.func.isRequired
    };

    static defaultProps = {
        showIndicators: true,
        showArrows: true,
        showStatus:true,
        showThumbs:true,
        infiniteLoop: false,
        selectedItem: 0,
        axis: 'horizontal',
        width: '100%',
        useKeyboardArrows: false,
        autoPlay: false,
        stopOnHover: true,
        interval: 3000,
        transitionTime: 350,
        swipeScrollTolerance: 5,
        dynamicHeight: false,
        emulateTouch: false,
        onClickItem: noop,
        onClickThumb: noop,
        onChange: noop,
        statusFormatter: defaultStatusFormatter
    };

    constructor(props) {
        super(props);

        this.state = {
            initialized: false,
            selectedItem: props.selectedItem,
            hasMount: false,
            isMouseEntered: false
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

        if (nextProps.autoPlay !== this.props.autoPlay) {
            if (nextProps.autoPlay) {
                this.setupAutoPlay();
            } else {
                this.destroyAutoPlay();
            }
        }
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.children && this.props.children && !this.state.initialized) {
            this.setupCarousel();
        }
    }

    componentWillUnmount() {
        this.destroyCarousel();
    }

    setupCarousel () {
        this.bindEvents();

        if (this.props.autoPlay) {
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
        const carouselWrapper = this.refs['carouselWrapper'];

        if (this.props.stopOnHover && carouselWrapper) {
            carouselWrapper.addEventListener('mouseenter', this.stopOnHover);
            carouselWrapper.addEventListener('mouseleave', this.startOnLeave);
        }
    }

    destroyAutoPlay () {
        this.clearAutoPlay();
        const carouselWrapper = this.refs['carouselWrapper'];

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
        if (!this.props.autoPlay) {
            return;
        }

        this.timer = setTimeout(() => {
            this.increment();
        }, this.props.interval);
    }

    clearAutoPlay = () => {
        if (!this.props.autoPlay) {
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

        const nextKey = isHorizontal ? 'ArrowRight' : 'ArrowDown';
        const prevKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp';

        if (nextKey === e.key) {
            this.increment();
        } else if (prevKey === e.key) {
            this.decrement();
        }
    }

    updateSizes = () => {
        if (!this.state.initialized) {
            return;
        }

        const isHorizontal = this.props.axis === 'horizontal';
        const firstItem = this.refs.item0;
        const itemSize = isHorizontal ? firstItem.clientWidth : firstItem.clientHeight;

        this.setState({
            itemSize: itemSize,
            wrapperSize: isHorizontal ? itemSize * this.props.children.length : itemSize
        });
    }

    setMountState = () => {
        this.setState({hasMount: true});
        this.updateSizes();
    }

    handleClickItem = (index, item) => {
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
            swiping: true
        });
        this.clearAutoPlay();
    }

    onSwipeEnd = () => {
        this.resetPosition();
        this.setState({
            swiping: false
        });
        this.autoPlay();
    }

    onSwipeMove = (delta) => {
        const isHorizontal = this.props.axis === 'horizontal';

        const initialBoundry = 0;

        const currentPosition = - this.state.selectedItem * 100;
        const finalBoundry = - (this.props.children.length - 1) * 100;

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

        const position = currentPosition + (100 / (this.state.itemSize / handledDelta)) + '%';

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

    resetPosition = () => {
        const currentPosition = - this.state.selectedItem * 100 + '%';
        this.setPosition(currentPosition);
    }

    setPosition = (position) => {
        const list = ReactDOM.findDOMNode(this.refs.itemList);
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
    }

    decrement = (positions) => {
        this.moveTo(this.state.selectedItem - (typeof positions === 'Number' ? positions : 1));
    }

    increment = (positions) => {
        this.moveTo(this.state.selectedItem + (typeof positions === 'Number' ? positions : 1));
    }

    moveTo = (position) => {
        const lastPosition = this.props.children.length  - 1;

        if (position < 0 ) {
          position = this.props.infiniteLoop ?  lastPosition : 0;
        }

        if (position > lastPosition) {
          position = this.props.infiniteLoop ? 0 : lastPosition;
        }

        this.selectItem({
            // if it's not a slider, we don't need to set position here
            selectedItem: position
        });

        // don't reset auto play when stop on hover is enabled, doing so will trigger a call to auto play more than once
        // and will result in the interval function not being cleared correctly.
        if (this.props.autoPlay && this.state.isMouseEntered === false) {
            this.resetAutoPlay();
        }
    }

    changeItem = (e) => {
        const newIndex = e.target.value;

        this.selectItem({
            selectedItem: newIndex
        });
    }

    selectItem = (state) => {
        this.setState(state);
        this.handleOnChange(state.selectedItem, this.props.children[state.selectedItem]);
    }

    getInitialImage = () => {
        const selectedItem = this.props.selectedItem;
        const item = this.refs[`item${selectedItem}`];
        const images = item && item.getElementsByTagName('img');
        return images && images[selectedItem];
    }

    getVariableImageHeight = (position) => {
        const item = this.refs[`item${position}`];
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

    renderItems () {
        return React.Children.map(this.props.children, (item, index) => {
            const hasMount = this.state.hasMount;
            const itemClass = klass.ITEM(true, index === this.state.selectedItem);

            return (
                <li ref={"item" + index} key={"itemKey" + index} className={itemClass}
                    onClick={ this.handleClickItem.bind(this, index, item) }>
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
                {React.Children.map(this.props.children, (item, index) => {
                    return <li className={klass.DOT(index === this.state.selectedItem)} onClick={this.changeItem} value={index} key={index} />;
                })}
            </ul>
        );
    }

    renderStatus () {
        if (!this.props.showStatus) {
            return null
        }

        return <p className="carousel-status">{this.props.statusFormatter(this.state.selectedItem + 1, this.props.children.length)}</p>;
    }

    renderThumbs () {
        if (!this.props.showThumbs || this.props.children.length === 0) {
            return null
        }

        return (
            <Thumbs onSelectItem={this.handleClickThumb} selectedItem={this.state.selectedItem} transitionTime={this.props.transitionTime}>
                {this.props.children}
            </Thumbs>
        );
    }

    render () {
        if (!this.props.children || this.props.children.length === 0) {
            return null;
        }

        const itemsLength = this.props.children.length;

        const isHorizontal = this.props.axis === 'horizontal';

        const canShowArrows = this.props.showArrows && itemsLength > 1;

        // show left arrow?
        const hasPrev = canShowArrows && (this.state.selectedItem > 0 || this.props.infiniteLoop);
        // show right arrow
        const hasNext = canShowArrows && (this.state.selectedItem < itemsLength - 1 || this.props.infiniteLoop);
        // obj to hold the transformations and styles
        let itemListStyles = {};

        const currentPosition = - this.state.selectedItem * 100 + '%';
        // if 3d is available, let's take advantage of the performance of transform
        const transformProp = CSSTranslate(currentPosition, this.props.axis);

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
            }
        }

        let swiperProps = {
            selectedItem: this.state.selectedItem,
            className: klass.SLIDER(true, this.state.swiping),
            onSwipeMove: this.onSwipeMove,
            onSwipeStart: this.onSwipeStart,
            onSwipeEnd: this.onSwipeEnd,
            style: itemListStyles,
            tolerance: this.props.swipeScrollTolerance,
            ref: 'itemList'
        };

        const containerStyles = {};

        if (isHorizontal) {
            swiperProps.onSwipeLeft = this.increment;
            swiperProps.onSwipeRight = this.decrement;

            if (this.props.dynamicHeight) {
                const itemHeight = this.getVariableImageHeight(this.state.selectedItem);
                swiperProps.style.height = itemHeight || 'auto';
                containerStyles.height = itemHeight || 'auto';
            }

        } else {
            swiperProps.onSwipeUp = this.decrement;
            swiperProps.onSwipeDown = this.increment;
            swiperProps.style.height = this.state.itemSize;
            containerStyles.height = this.state.itemSize;
        }

        return (
            <div className={this.props.className} ref="carouselWrapper">
                <div className={klass.CAROUSEL(true)} style={{width: this.props.width}}>
                    <button type="button" className={klass.ARROW_PREV(!hasPrev)} onClick={this.decrement} />
                    <div className={klass.WRAPPER(true, this.props.axis)} style={containerStyles} ref="itemsWrapper">
                        <Swipe tagName="ul" {...swiperProps} allowMouseEvents={this.props.emulateTouch}>
                            { this.renderItems() }
                        </Swipe>
                    </div>
                    <button type="button" className={klass.ARROW_NEXT(!hasNext)} onClick={this.increment} />

                    { this.renderControls() }
                    { this.renderStatus() }
                </div>
                { this.renderThumbs() }
            </div>
        );

    }
}

export default Carousel;
