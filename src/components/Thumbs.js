import React, { Component } from 'react';
import ReactDOM from 'react-dom';
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
        selectedItem: PropTypes.number
    };

    static defaultProps = {
        selectedItem: 0,
        transitionTime: 350,
        axis: 'horizontal'
    };

    constructor(props) {
        super(props);

        this.state = {
            initialized: false,
            selectedItem: props.selectedItem,
            hasMount: false,
            firstItem: this.getFirstItem(props.selectedItem),
            images: []
        }
    }

    componentDidMount (nextProps) {
        if (!this.props.children) {
            return;
        }

        this.setupThumbs();
    }

    componentWillReceiveProps (props, state) {
        if (props.selectedItem !== this.state.selectedItem) {
            this.setState({
                selectedItem: props.selectedItem,
                firstItem: this.getFirstItem(props.selectedItem)
            });
        }
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.children && this.props.children && !this.state.initialized) {
            this.setupThumbs();
        }
    }

    componentWillUnmount() {
        this.destroyThumbs();
    }

    setupThumbs () {
        // as the widths are calculated, we need to resize
        // the carousel when the window is resized
        window.addEventListener("resize", this.updateSizes);
        // issue #2 - image loading smaller
        window.addEventListener("DOMContentLoaded", this.updateSizes);

        const images = this.getImages();

        if (!images) {
            return;
        }

        this.setState({
            initialized: true,
            images
        });

        // when the component is rendered we need to calculate
        // the container size to adjust the responsive behaviour
        this.updateSizes();
    }

    destroyThumbs () {
        // removing listeners
        window.removeEventListener("resize", this.updateSizes);
        window.removeEventListener("DOMContentLoaded", this.updateSizes);
    }

    updateSizes = () => {
        if (!this.state.initialized) {
            return;
        }

        const total = this.props.children.length;
        this.wrapperSize = this.itemsWrapper.clientWidth;
        this.itemSize = outerWidth(this.refs.thumb0);
        this.visibleItems = Math.floor(this.wrapperSize / this.itemSize);
        this.lastPosition = total - this.visibleItems;
        this.showArrows = this.visibleItems < total;
    }

    getImages() {
        const images = React.Children.map(this.props.children, (item, index) => {
            let img = item;

            // if the item is not an image, try to find the first image in the item's children.
            if (item.type !== "img") {
                img = React.Children.toArray(item.props.children).filter((children) => children.type === "img")[0];
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

    handleClickItem = (index, item) => {
        const handler = this.props.onSelectItem;

        if (typeof handler === 'function') {
            handler(index, item);
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
        const leftBoundry = 0;
        const list = ReactDOM.findDOMNode(this.itemList);
        const wrapperSize = list.clientWidth;
        const visibleItems = Math.floor(wrapperSize / this.itemSize);

        const currentPosition = - this.state.firstItem * this.itemSize;
        const lastLeftBoundry = - this.visibleItems * this.itemSize;


        // prevent user from swiping left out of boundaries
        if (currentPosition === leftBoundry && deltaX > 0) {
            deltaX = 0;
        }

        // prevent user from swiping right out of boundaries
        if (currentPosition === lastLeftBoundry && deltaX < 0) {
            deltaX = 0;
        }

        const position = currentPosition + (100 / (wrapperSize / deltaX)) + '%';

        // if 3d isn't available we will use left to move
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

    slideRight = (positions) => {
        this.moveTo(this.state.firstItem - (typeof positions === 'Number' ? positions : 1));
    }

    slideLeft = (positions) => {
        this.moveTo(this.state.firstItem + (typeof positions === 'Number' ? positions : 1));
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
        if (!this.showArrows) {
            return 0;
        }

        let firstItem = selectedItem;

        if (selectedItem >= this.lastPosition) {
            firstItem = this.lastPosition;
        }

        if (selectedItem < (this.state.firstItem + this.visibleItems)) {
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
                ref: `thumb${index}`,
                className: itemClass,
                onClick: this.handleClickItem.bind(this, index, this.props.children[index])
            };

            if (index === 0) {
                img = React.cloneElement(img, {
                    onLoad: this.setMountState
                });
            }

            return (
                <li {...thumbProps}>
                    { img }
                </li>
            );
        });
    }

    render () {
        if (!this.props.children || this.state.images.length === 0) {
            return null;
        }

        // show left arrow?
        const hasPrev = this.showArrows && this.state.firstItem > 0;
        // show right arrow
        const hasNext = this.showArrows && this.state.firstItem < this.lastPosition;
        // obj to hold the transformations and styles
        let itemListStyles = {};

        const currentPosition = - this.state.firstItem * this.itemSize + 'px';

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
                <div className={klass.WRAPPER(false)} ref={node => this.itemsWrapper = node}>
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
                        ref={node => this.itemList = node}>
                        { this.renderItems() }
                    </Swipe>
                    <button type="button" className={klass.ARROW_NEXT(!hasNext)} onClick={this.slideLeft} />
                </div>
            </div>
        );
    }
}

export default Thumbs;
