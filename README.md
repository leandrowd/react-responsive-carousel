# React Responsive Carousel (WIP)

## Installing

`npm install react-responsive-carousel --save`

## Getting started

### Image Gallery

- Javascript / Jsx:
```javascript
/** @jsx React.DOM */
var React = require('react');
var ImageGallery = require('./components/ImageGallery');

var DemoGallery = React.createClass({
	render() {
		return (
			<div className="demo-image-gallery">
				<ImageGallery images={ galleryImages } />
			</div>
		);
	}
});

React.render(<DemoGallery />, document.querySelector('.demo-gallery'));
```

- Css:
```css
<link rel="stylesheet" href="imageGallery.css"/>
<link rel="stylesheet" href="carousel.css"/>
```

- Props:
	- images

### Slider with controls

- Javascript / Jsx:

```javascript
/** @jsx React.DOM */
var React = require('react');
var Carousel = require('./components/Carousel');

var DemoSliderControls = React.createClass({
	render() {
		return (
			<div className="demo-slider">
				<Carousel 
					type="slider" 
					items={ sliderImages } 
					showControls={true} 
					showStatus={true} />
			</div>
		);
	}
});

React.render(<DemoSliderControls />, document.querySelector('.demo-slider-controls'));
```

- Css:

```css
<link rel="stylesheet" href="carousel.css"/>
```

- Props: 
	- (Array) items
	- (Boolean) showControls
	- (Boolean) showStatus
	- (Function) onChange
		- Triggered when the carousel move
	- (Function) onSelectItem
		- Triggered when an item is selected


### Carousel

- Javascript / Jsx:

```javascript
/** @jsx React.DOM */
var React = require('react');
var Carousel = require('./components/Carousel');

var DemoCarousel = React.createClass({
	render() {
		return (
			<div className="demo-carousel">
				<Carousel items={ carouselImages } />
			</div>
		);
	}
});

React.render(<DemoCarousel />, document.querySelector('.demo-carousel'));
```


- Css:

```css
<link rel="stylesheet" href="carousel.css"/>
```

- Props: 
	- (Array) items
	- (Boolean) showControls
	- (Boolean) showStatus
	- (Function) onChange
		- Triggered when the carousel move
	- (Function) onSelectItem
		- Triggered when an item is selected

### Browser Support

Although I have implemented css transformations for all the browsers and fallback to left when 3d isn't supported, I haven't had time to test in browsers other than chrome yet. I reckon than it should just work but minor issues can be found.

### TODO:

- [ ] Implement slides of content
- [ ] Improve documentation
- [ ] Improve tests
- [ ] Improve swipe
- [ ] Test cross-browser
- [ ] ...?


### Contributing

Feel free to contribute. Just Fork -> Change -> Pull request!