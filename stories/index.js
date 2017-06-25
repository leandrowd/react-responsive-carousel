import React, { Component } from 'react';
import { storiesOf, action } from '@kadira/storybook';
import { Carousel } from '../src/index';

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

const addChildren = (ammount = 1, options = {}) => {
	let current = 0;
	const children = [];
	while ( current < ammount ) {
		children.push(createCarouselItemImage(current, options));
	}

	return children
};

const baseChildren = <div>{ [1,2,3,4,5].map(createCarouselItemImage) }</div>;

export class LazyLoadedCarousel extends Component {
    constructor (props) {
        super(props);

        this.state = {
            slides: null
        };

        this.loadSlides = this.loadSlides.bind(this);
    }

    loadSlides() {
        this.setState({
            slides: baseChildren.props.children
        });
    }

    render() {
        return (
            <div>
                <p>Click the button to asynchronously load the slides</p>
                <button onClick={this.loadSlides} style={{padding: '10px', margin: '10px', fontSize: '1.5em'}}>Load slides</button>
                <Carousel>
                    { this.state.slides }
                </Carousel>
            </div>
        );
    }
}

export class ExternalControlledCarousel extends Component {
    constructor (props) {
        super(props);

        this.state = {
            currentSlide: 0
        };
    }

    next = () => {
        this.setState({
            currentSlide: this.state.currentSlide + 1
        });
    }

    prev = () => {
        this.setState({
            currentSlide: this.state.currentSlide - 1
        });
    }

    render() {
        const buttonStyle = {fontSize: 20, padding: '5px 20px', margin: '5px 0px'};
        const containerStyle = {margin: '5px 0 20px'};
        return (
            <div>
                <div style={containerStyle}>
                    <p style={containerStyle}>
                        Use the buttons below to change the selected item in the carousel
                        <br/>

                        <small><i>Note that the external controls might not respect the carousel boundaries but the carousel won't go past it.</i></small>
                    </p>
                    <p>External slide value: {this.state.currentSlide}</p>
                    <button onClick={this.prev} style={buttonStyle}>Prev</button>
                    <button onClick={this.next} style={buttonStyle}>Next</button>
                </div>
                <Carousel selectedItem={this.state.currentSlide}>
                    { baseChildren.props.children }
                </Carousel>
            </div>
        );
    }
}

storiesOf('Carousel')
  .addWithInfo('PropTypes',  'All the allowed props and default values', () =>
    <div/>,
    { source: false, inline: true, propTables: [Carousel]})
  .addWithInfo('defaults',() => (
    <Carousel>
        { baseChildren.props.children }
    </Carousel>
  ), { source: true, inline: true, propTables: false})
  .addWithInfo('lazy loaded',
    `
    Code example:
    ~~~js
    class LazyLoadedCarousel extends Component {
        constructor (props) {
            super(props);

            this.state = {
                slides: null
            };

            this.loadSlides = this.loadSlides.bind(this);
        }

        loadSlides() {
            this.setState({
                slides: baseChildren.props.children
            });
        }

        render() {
            return (
                <div>
                    <button onClick={this.loadSlides}>Load slides</button>
                    <Carousel>
                        { this.state.slides }
                    </Carousel>
                </div>
            );
        }
    }
    ~~~
            `,
    () => (
    <LazyLoadedCarousel />
  ), { source: true, inline: true, propTables: false})
  .addWithInfo('handlers',
    <div>
    <p>Handlers will be called with the index of the element plus the element. i.e:</p>
    <code>
        function myHandler(index, element)
    </code>
    </div>
    ,() => (
    <Carousel onClickThumb={action('click thumb')} onClickItem={action('click item')} onChange={action('change')}>
        { baseChildren.props.children }
    </Carousel>
  ), { source: true, inline: true, propTables: false})
  .addWithInfo('custom transition time (1000ms)', () => (
    <Carousel transitionTime={1000}>
        { baseChildren.props.children }
    </Carousel>
  ), { source: true, inline: true, propTables: false})
  .addWithInfo('emulate touch', () => (
    <Carousel emulateTouch>
        { baseChildren.props.children }
    </Carousel>
  ), { source: true, inline: true, propTables: false})
  .addWithInfo('no arrows', () => (
    <Carousel showArrows={false}>
        { baseChildren.props.children }
    </Carousel>
  ), { source: true, inline: true, propTables: false})
  .addWithInfo('custom status', () => (
    <Carousel statusFormatter={(current, total) => `Current slide: ${current} / Total: ${total}`}>
        { baseChildren.props.children }
    </Carousel>
  ), { source: true, inline: true, propTables: false})
  .addWithInfo('axis horizontal + keyboard support', () => (
    <Carousel useKeyboardArrows>
        { baseChildren.props.children }
    </Carousel>
  ), { source: true, inline: true, propTables: false})
  .addWithInfo('axis vertical + keyboard support', () => (
    <Carousel axis="vertical" useKeyboardArrows>
        { baseChildren.props.children }
    </Carousel>
  ), { source: true, inline: true, propTables: false})
  .addWithInfo('no arrows + infinite loop + auto play', () => (
    <Carousel showArrows={false} infiniteLoop autoPlay>
        { baseChildren.props.children }
    </Carousel>
  ), { source: true, inline: true, propTables: false})
  .addWithInfo('no arrows + infinite loop + emulateTouch', () => (
    <Carousel showArrows={false} infiniteLoop emulateTouch>
        { baseChildren.props.children }
    </Carousel>
  ), { source: true, inline: true, propTables: false})
  .addWithInfo('no status', () => (
    <Carousel showStatus={false}>
        { baseChildren.props.children }
    </Carousel>
  ), { source: true, inline: true, propTables: false})
  .addWithInfo('no indicators', () => (
    <Carousel showIndicators={false}>
        { baseChildren.props.children }
    </Carousel>
  ), { source: true, inline: true, propTables: false})
  .addWithInfo('no thumbs', () => (
    <Carousel showThumbs={false}>
        { baseChildren.props.children }
    </Carousel>
  ), { source: true, inline: true, propTables: false})
  .addWithInfo('no status, no indicators', () => (
    <Carousel showStatus={false}  showIndicators={false}>
        { baseChildren.props.children }
    </Carousel>
  ), { source: true, inline: true, propTables: false})
  .addWithInfo('fixed width', () => (
    <Carousel width="700px">
        { baseChildren.props.children }
    </Carousel>
  ), { source: true, inline: true, propTables: false})
  .addWithInfo('dynamic height images', () => (
    <Carousel showArrows={false} dynamicHeight={true}>
        <div><img src="http://placehold.it/350x150" /></div>
        <div><img src="http://placehold.it/255x150" /></div>
        <div><img src="http://placehold.it/295x150" /></div>
        <div><img src="http://placehold.it/310x150" /></div>
        <div><img src="http://placehold.it/575x250" /></div>
        <div><img src="http://placehold.it/450x150" /></div>
    </Carousel>
  ), { source: true, inline: true, propTables: false})
  .addWithInfo('auto play', () => (
    <Carousel autoPlay={true} interval={1000} infiniteLoop={true}>
        { baseChildren.props.children }
    </Carousel>
  ), { source: true, inline: true, propTables: false})
  .addWithInfo('auto play stopping on hover', () => (
    <Carousel autoPlay={true} stopOnHover={true} infiniteLoop={true}>
        { baseChildren.props.children }
    </Carousel>
  ), { source: true, inline: true, propTables: false})
  .addWithInfo('initial selected', () => (
    <Carousel selectedItem={3}>
        { baseChildren.props.children }
    </Carousel>
  ), { source: true, inline: true, propTables: false})
  .addWithInfo('vertical axis', () => (
    <Carousel axis="vertical">
        { baseChildren.props.children }
    </Carousel>
  ), { source: true, inline: true, propTables: false})
  .addWithInfo('youtube', () => (
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
  ), { source: true, inline: true, propTables: false})
  .addWithInfo('with external controls', () => (
    <ExternalControlledCarousel />
  ), { source: true, inline: true, propTables: false})
  .addWithInfo('presentation mode', () => (
    <Carousel showThumbs={ false } showStatus={ false } useKeyboardArrows className="presentation-mode">
		<div key="content-0" className="my-slide primary">
			<h1>Presentation mode</h1>
		</div>
		<div key="content-1" className="my-slide secondary">
			<h2>It's just a couple of new styles...</h2>
		</div>
		<div key="content-2" className="my-slide content">
			<p>...and the carousel can be used to present something!</p>
		</div>
		<div key="content-3" className="my-slide content">
			<img src="/assets/meme.png" />
		</div>
		<div key="content-4" className="my-slide content">
			<p>See the <a href="./examples/presentation/presentation.scss">source code</a>...</p>
		</div>
		<div key="content-5" className="my-slide secondary complex">
			<h2>It supports:</h2>
			<ul>
				<li>Headers (h1 - h6)</li>
				<li>Paragraphs (p)</li>
				<li>Images and videos (Youtube, Vimeo)</li>
				<li>Lists
					<ol>
						<li>Ordered lists (ol)</li>
						<li>Bullet points (ul)</li>
					</ol>
				</li>
			</ul>
		</div>
		<div key="content-6" className="my-slide secondary complex">
			<h2>Pre baked slides:</h2>
			<ul>
				<li>Primary - for titles</li>
				<li>Secondary - for subtitles</li>
				<li>Content</li>
			</ul>
		</div>
		<div key="content-7" className="my-slide content">
			<iframe width="560" height="315" src="https://www.youtube.com/embed/n0F6hSpxaFc" />
		</div>
		<div key="content-8" className="my-slide content">
			<iframe src="https://player.vimeo.com/video/105955605" width="640" height="360" />
		</div>
		<div key="content-9" className="my-slide primary">
			<h1>Lorem Ipsum</h1>
		</div>
		<div key="content-10" className="my-slide secondary">
			<h2>What is Lorem Ipsum?</h2>
		</div>
		<div key="content-11" className="my-slide content">
			<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the <strong>1500s</strong>, when an unknown printer took a galley of type and scrambled it to make a type specimen book. </p>
		</div>
		<div key="content-12" className="my-slide content">
			<blockquote>It has survived not only <em>five centuries</em>, but also the leap into electronic typesetting, remaining essentially unchanged. </blockquote>
		</div>
		<div key="content-13" className="my-slide content">
			<p>It was popularised in the <strong>1960s</strong> with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
		</div>
		<div key="content-14" className="my-slide secondary">
            <h2>Where does it come from?</h2>
		</div>
		<div key="content-15" className="my-slide content">
			<p>Contrary to popular belief, Lorem Ipsum is not simply random text.</p>
		</div>
		<div key="content-16" className="my-slide content">
			<p>It has roots in a piece of classical Latin literature from <strong>45 BC</strong>, making it over <strong>2000</strong> years old.</p>
		</div>
		<div key="content-17" className="my-slide primary">
			<h1>Thanks...</h1>
		</div>
    </Carousel>
  ), { source: true, inline: true, propTables: false});
