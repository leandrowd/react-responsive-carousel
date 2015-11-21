# React Responsive Carousel (React 0.14)

## Demos and docs:
[http://leandrowd.github.io/react-responsive-carousel/](http://leandrowd.github.io/react-responsive-carousel/)

* Note: If you need support for IE8 or older versions of React, install version 0.1.6

## Installing as a package
`npm install react-responsive-carousel --save`

## Getting started
- Possible properties: 
	- (Array) items
	- (Boolean) showControls
	- (Boolean) showStatus
	- (Function) onChange
		- Triggered when the carousel move
	- (Function) onSelectItem
		- Triggered when an item is selected

- Usage: 

### Slider with controls

```javascript
var React = require('react');
var ReactDOM = require('react-dom');
var Carousel = require('react-responsive-carousel').Carousel;

var DemoSliderControls = function(){
	return (
		<Carousel type="slider" showControls={true} showStatus={true}>
			<img src="assets/1.jpeg" />
			<img src="assets/2.jpeg" />
			<img src="assets/3.jpeg" />
			<img src="assets/4.jpeg" />
			<img src="assets/5.jpeg" />
			<img src="assets/6.jpeg" />
			<img src="assets/7.jpeg" />
		</Carousel>
	);
};

ReactDOM.render(<DemoSliderControls />, document.querySelector('.demo-slider-controls'));

// Don't forget to include the css in your page 
// <link rel="stylesheet" href="carousel.css"/>
```



### Carousel

```javascript
var React = require('react');
var ReactDOM = require('react-dom');
var ImageGallery = require('react-responsive-carousel').ImageGallery;

var DemoGallery = function() {
	return (
		<ImageGallery showControls={true} showStatus={true}>
			<img src="assets/1.jpeg" />
			<img src="assets/2.jpeg" />
			<img src="assets/3.jpeg" />
			<img src="assets/4.jpeg" />
			<img src="assets/5.jpeg" />
			<img src="assets/6.jpeg" />
		</ImageGallery>
	);
};

ReactDOM.render(<DemoGallery />, document.querySelector('.demo-gallery'));

// Don't forget to include the css in your page
// <link rel="stylesheet" href="imageGallery.css"/>
// <link rel="stylesheet" href="carousel.css"/>
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

```javascript
var React = require('react');
var ReactDOM = require('react-dom');
var Carousel = require('react-responsive-carousel').Carousel;

var DemoCarousel = function() {
	return (
		<Carousel>
			<img src="assets/1.jpeg" />
			<img src="assets/2.jpeg" />
			<img src="assets/3.jpeg" />
			<img src="assets/4.jpeg" />
			<img src="assets/5.jpeg" />
			<img src="assets/6.jpeg" />
			<img src="assets/7.jpeg" />
		</Carousel>
	);
};

ReactDOM.render(<DemoCarousel />, document.querySelector('.demo-carousel'));

// Don't forget to include the css in your page
// <link rel="stylesheet" href="carousel.css"/>
```

### How to build your own gallery

So simple, just add one carousel[type=slider] and another carousel sending the same parameters for both:

- Javascript / Jsx:

```javascript
var React = require('react');
var Carousel = require('./Carousel');

module.exports = React.createClass({
	
	getDefaultProps () {
		return {
			selectedItem: 0
		}
	},

	getInitialState () {
		return {
			selectedItem: this.props.selectedItem
		}
	},

	selectItem (selectedItem) {
		this.setState({
			selectedItem: selectedItem
		});
	},

	render () {
		return (
			<div className="image-gallery">
				<Carousel type="slider" selectedItem={this.state.selectedItem} showControls={this.props.showControls} showStatus={this.props.showStatus} onChange={this.selectItem} onSelectItem={ this.selectItem }>
					{ this.props.children }
				</Carousel>
				<Carousel selectedItem={this.state.selectedItem} onSelectItem={ this.selectItem }>
					{ this.props.children }
				</Carousel>
			</div>
		);
	}
});
```

## Running locally
To run it on your local environment just: 

- `git clone git@github.com:leandrowd/react-responsive-carousel.git`
- `npm install`
- `gulp`
- Open your favourite browser on `localhost:8000`

To generate the npm package run `gulp package`. It will transpile the jsx to js and copy the css into the lib folder.

## Contributing
Please, feel free to contributing. You may file an issue or submit a pull request!
