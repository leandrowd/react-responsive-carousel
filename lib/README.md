# React Responsive Carousel (WIP)


## Demo

http://leandrowd.github.io/react-responsive-carousel/


## Installing as a package

`npm install react-responsive-carousel --save`


## Running locally

To run it on your local environment just: 

- `git clone git@github.com:leandrowd/react-responsive-carousel.git`
- `npm install`
- `gulp`
- Open your favourite browser on `localhost:8000`

To generate the npm package run `gulp package`. It will transpile the jsx to js and copy the css into the lib folder.


## Contributing

Please, feel free to contributing. You may file an issue or submit a pull request!


## Getting started

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



### How to build your own gallery

So simple, just add one carousel[type=slider] and another carousel sending the same parameters for both:

- Javascript / Jsx:

```javascript
/** @jsx React.DOM */
var React = require('react/addons');
var Carousel = require('./Carousel');

module.exports = React.createClass({
	
	propsTypes: {
		images: React.PropTypes.array.isRequired
	},

	getInitialState () {
		return {
			currentImage: 0
		}
	},

	selectItem (selectedItem) {
		this.setState({
			currentImage: selectedItem
		});
	},

	render () {
		var { images } = this.props;
		var { current } = this.state;
		var mainImage = (images && images[current] && images[current].url);

		return (
			<div className="image-gallery">
				<Carousel 
					type="slider" 
					items={ images } 
					selectedItem={this.state.currentImage} 
					onChange={this.selectItem} 
					onSelectItem={ this.selectItem } />

				<Carousel 
					items={ images } 
					selectedItem={this.state.currentImage} 
					onSelectItem={ this.selectItem } />
			</div>
		);
	}
});
```

