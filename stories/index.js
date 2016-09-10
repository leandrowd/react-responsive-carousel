import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import { Carousel } from '../src/index';

// carousel styles
import '../src/main.scss';
require('../src/carousel.scss');
// import '../lib/styles/carousel.css';

const createCarouselItemImage = (index, options = {}) => (
    <div key={index}>
        <img src={`assets/${index}.jpeg`} />
        <p className="legend">Legend {index}</p>
    </div>
);

const addChildren = (ammount = 1, options = {}) => {
		let current = 0;
		const children = [];
		while ( current < ammount ) {
			children.push(createCarouselItemImage(current, options));
		}

		return children
};

const baseChildren = <div>{ [1,2,3,4,5].map(createCarouselItemImage) }</div>;

storiesOf('Carousel', module)
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
  .add('fixed width', () => (
    <Carousel width="700">
        { baseChildren.props.children }
    </Carousel>
  ))
  .add('fixed height', () => (
    <Carousel height="700">
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
  ))
  .add('youtube', () => (
    <Carousel showThumbs={false}>
				<div key="youtube-1">
						<iframe width="560" height="315" src="https://www.youtube.com/embed/n0F6hSpxaFc" />
				</div>

				<div key="youtube-2">
						<iframe width="560" height="315" src="https://www.youtube.com/embed/C-y70ZOSzE0" />
				</div>

				<div key="youtube-3">
						<iframe width="560" height="315" src="https://www.youtube.com/embed/IyTv_SR2uUo" />
				</div>

				<div key="youtube-4">
						<iframe width="560" height="315" src="https://www.youtube.com/embed/3zrfGHQd4Bo" />
				</div>
    </Carousel>
  ))
  .add('presentation mode', () => (
    <Carousel showThumbs={ false } className="presentation-mode">
				<div key="content-1" className="my-slide primary">
						<h1>Lorem Ipsum</h1>
				</div>
				<div key="content-2" className="my-slide secondary">
						<h2>What is Lorem Ipsum?</h2>
				</div>
				<div key="content-3" className="my-slide content">
						<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the <strong>1500s</strong>, when an unknown printer took a galley of type and scrambled it to make a type specimen book. </p>
				</div>
				<div key="content-4" className="my-slide content">
						<p>It has survived not only <em>five centuries</em>, but also the leap into electronic typesetting, remaining essentially unchanged. </p>
				</div>
				<div key="content-5" className="my-slide content">
						<p>It was popularised in the <strong>1960s</strong> with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
				</div>

				<div key="content-6" className="my-slide secondary">
						<h2>Where does it come from?</h2>
				</div>
				<div key="content-7" className="my-slide content">
						<p>Contrary to popular belief, Lorem Ipsum is not simply random text.</p>
				</div>
				<div key="content-7" className="my-slide content">
						<img src="assets/meme.png" />
				</div>
				<div key="content-8" className="my-slide content">
						<p>It has roots in a piece of classical Latin literature from <strong>45 BC</strong>, making it over <strong>2000</strong> years old.</p>
				</div>
				<div key="content-9" className="my-slide content">
						<p><em>Richard McClintock</em>, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.</p>
				</div>
				<div key="content-10" className="my-slide content">
						<p>Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" <em>(The Extremes of Good and Evil)</em> by <em>Cicero</em>, written in <strong>45 BC</strong>.</p>
				</div>
				<div key="content-11" className="my-slide content">
						<p>This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32</p>
				</div>
    </Carousel>
  ));
