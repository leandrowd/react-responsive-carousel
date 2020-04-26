import React, { CSSProperties } from 'react';
import { action } from '@storybook/addon-actions';
import { Carousel } from '../src/index';

import { withKnobs, boolean, number } from '@storybook/addon-knobs';

// carousel styles
import '../src/main.scss';
import '../src/carousel.scss';
import '../src/examples/presentation/presentation.scss';

const createCarouselItemImage = (index, options = {}) => (
    <div key={index}>
        <img src={`/assets/${index}.jpeg`} />
        <p className="legend">Legend {index}</p>
    </div>
);

const baseChildren = <div>{[1, 2, 3, 4, 5].map(createCarouselItemImage)}</div>;

const tooglesGroupId = 'Toggles';
const valuesGroupId = 'Values';
const mainGroupId = 'Main';

const getConfigurableProps = () => ({
    showArrows: boolean('showArrows', true, tooglesGroupId),
    showStatus: boolean('showStatus', true, tooglesGroupId),
    showIndicators: boolean('showIndicators', true, tooglesGroupId),
    infiniteLoop: boolean('infiniteLoop', true, tooglesGroupId),
    showThumbs: boolean('showThumbs', true, tooglesGroupId),
    useKeyboardArrows: boolean('useKeyboardArrows', true, tooglesGroupId),
    autoPlay: boolean('autoPlay', true, tooglesGroupId),
    stopOnHover: boolean('stopOnHover', true, tooglesGroupId),
    swipeable: boolean('swipeable', true, tooglesGroupId),
    dynamicHeight: boolean('dynamicHeight', true, tooglesGroupId),
    emulateTouch: boolean('emulateTouch', true, tooglesGroupId),
    thumbWidth: number('thumbWidth', 100, {}, valuesGroupId),
    selectedItem: number('selectedItem', 0, {}, valuesGroupId),
    interval: number('interval', 3000, {}, valuesGroupId),
    transitionTime: number('transitionTime', 150, {}, valuesGroupId),
    swipeScrollTolerance: number('swipeScrollTolerance', 5, {}, valuesGroupId),
});

export default {
    title: '01 - Basic',
    decorators: [withKnobs],
    component: Carousel,
};

export const base = () => <Carousel {...getConfigurableProps()}>{baseChildren.props.children}</Carousel>;

export const vertical = () => (
    <Carousel axis="vertical" {...getConfigurableProps()}>
        {baseChildren.props.children}
    </Carousel>
);

export const centerMode = () => (
    <Carousel
        infiniteLoop
        centerMode
        centerSlidePercentage={number('centerSlidePercentage', 80, {}, mainGroupId)}
        {...getConfigurableProps()}
    >
        {baseChildren.props.children}
    </Carousel>
);

export const handlers = () => (
    <Carousel onClickThumb={action('click thumb')} onClickItem={action('click item')} onChange={action('change')}>
        {baseChildren.props.children}
    </Carousel>
);

export const withCustomStatusArrowsAndIndicators = () => {
    const arrowStyles: CSSProperties = {
        position: 'absolute',
        zIndex: 2,
        top: 'calc(50% - 15px)',
        width: 30,
        height: 30,
        cursor: 'pointer',
    };

    const indicatorStyles: CSSProperties = {
        background: '#fff',
        width: 8,
        height: 8,
        display: 'inline-block',
        margin: '0 8px',
    };

    return (
        <Carousel
            statusFormatter={(current, total) => `Current slide: ${current} / Total: ${total}`}
            renderArrowPrev={(onClickHandler, hasPrev, label) =>
                hasPrev && (
                    <button type="button" onClick={onClickHandler} title={label} style={{ ...arrowStyles, left: 15 }}>
                        -
                    </button>
                )
            }
            renderArrowNext={(onClickHandler, hasNext, label) =>
                hasNext && (
                    <button type="button" onClick={onClickHandler} title={label} style={{ ...arrowStyles, right: 15 }}>
                        +
                    </button>
                )
            }
            renderIndicator={(onClickHandler, isSelected, index, label) => {
                if (isSelected) {
                    return (
                        <li
                            style={{ ...indicatorStyles, background: '#000' }}
                            aria-label={`Selected: ${label} ${index + 1}`}
                            title={`Selected: ${label} ${index + 1}`}
                        />
                    );
                }
                return (
                    <li
                        style={indicatorStyles}
                        onClick={onClickHandler}
                        onKeyDown={onClickHandler}
                        value={index}
                        key={index}
                        role="button"
                        tabIndex={0}
                        title={`${label} ${index + 1}`}
                        aria-label={`${label} ${index + 1}`}
                    />
                );
            }}
        >
            {baseChildren.props.children}
        </Carousel>
    );
};

export const fixedWidth = () => <Carousel width="700px">{baseChildren.props.children}</Carousel>;
export const noChildren = () => <Carousel />;
export const noImages = () => (
    <Carousel>
        <div key="slide1" style={{ padding: 20, height: 150 }}>
            Text 01
        </div>
        <div key="slide2" style={{ padding: 20, height: 150 }}>
            Text 02
        </div>
    </Carousel>
);

export const dynamicHeightImages = () => (
    <Carousel showArrows={false} dynamicHeight={true}>
        <div key="slide1">
            <img src="http://placehold.it/350x150" />
        </div>
        <div key="slide2">
            <img src="http://placehold.it/255x150" />
        </div>
        <div key="slide3">
            <img src="http://placehold.it/295x150" />
        </div>
        <div key="slide4">
            <img src="http://placehold.it/310x150" />
        </div>
        <div key="slide5">
            <img src="http://placehold.it/575x250" />
        </div>
        <div key="slide6">
            <img src="http://placehold.it/450x150" />
        </div>
    </Carousel>
);
