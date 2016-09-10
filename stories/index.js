import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import { Carousel } from '../src/index';

// carousel styles
import '../src/main.scss';
// import '../lib/styles/carousel.css';

const createCarouselItem = index => (
    <div key={index}>
        <img src={`assets/${index}.jpeg`} />
        <p className="legend">Legend {index}</p>
    </div>
);

const baseChildren = <div>{ [1,2,3,4,5].map(createCarouselItem) }</div>;

storiesOf('Button', module)
  .add('defaults', () => (
    <Carousel>
        { baseChildren.props.children }
    </Carousel>
  ))
  .add('no arrows', () => (
    <Carousel showArrows={false}>
        { baseChildren.props.children }
    </Carousel>
  ))
  .add('no status', () => (
    <Carousel showStatus={false}>
        { baseChildren.props.children }
    </Carousel>
  ))
  .add('no indicators', () => (
    <Carousel showIndicators={false}>
        { baseChildren.props.children }
    </Carousel>
  ))
  .add('no thumbs', () => (
    <Carousel showThumbs={false}>
        { baseChildren.props.children }
    </Carousel>
  ))
  .add('no status, no indicators', () => (
    <Carousel showStatus={false}  showIndicators={false}>
        { baseChildren.props.children }
    </Carousel>
  ))
  .add('initial selected', () => (
    <Carousel selectedItem={3}>
        { baseChildren.props.children }
    </Carousel>
  ))
  .add('vertical axis', () => (
    <Carousel axis="vertical">
        { baseChildren.props.children }
    </Carousel>
  ));
