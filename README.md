# React Responsive Carousel

[![npm version](https://badge.fury.io/js/react-responsive-carousel.svg)](https://badge.fury.io/js/react-responsive-carousel)
[![Build Status](https://travis-ci.org/leandrowd/react-responsive-carousel.svg?branch=master)](https://travis-ci.org/leandrowd/react-responsive-carousel)

#### Demo
<http://leandrowd.github.io/react-responsive-carousel/>

#### Installing as a package
`npm install react-responsive-carousel --save`

#### Usage

```javascript
var React = require('react');
var ReactDOM = require('react-dom');
var Carousel = require('react-responsive-carousel').Carousel;

var DemoCarousel = React.createClass({
    render() {
        return (
            <Carousel axis="horizontal|vertical" showThumbs={true|false} showArrows={true|false} onChange={onChange} onClickItem={onClickItem} onClickThumb={onClickThumb}>
                <div>
                    <img src="assets/1.jpeg" />
                    <p className="legend">Legend 1</p>
                </div>
                <div>
                    <img src="assets/2.jpeg" />
                    <p className="legend">Legend 2</p>
                </div>
                <div>
                    <img src="assets/3.jpeg" />
                    <p className="legend">Legend 3</p>
                </div>
            </Carousel>
        );
    }
});
ReactDOM.render(<DemoCarousel />, document.querySelector('.demo-carousel'));

// Don't forget to include the css in your page
// <link rel="stylesheet" href="carousel.css"/>
```

| Attributes | Type | Default | Description |
| :--------- | :--: | :-----: | ----------- |
| showArrows | `boolean` | `true` | show prev and next arrows |
| showStatus | `boolean` | `true` | show index of the current item. i.e: (1/8) |
| showIndicators | `boolean` | `true` | show little dots at the bottom with links for changing the item |
| showThumbs | `boolean` | `true` | show thumbnails of the images |
| selectedItem | `number` | `0` | selects an item though props / defines the initial selected item |
| axis       | `string`  | `horizontal` | changes orientation - accepts `horizontal` and `vertical` |
| onChange   | `function` | - | Fired when changing positions |
| onClickItem   | `function` | - | Fired when an item is clicked |
| onClickThumb   | `function` | - | Fired when a thumb it clicked |


#### Contributing
Please, feel free to contribute. You may file an issue or submit a pull request!

##### Setting up development environment
- `git clone git@github.com:leandrowd/react-responsive-carousel.git`
- `npm install`
- `npm start`
- Open your favourite browser on `localhost:8000` - livereload will be enabled

##### Running tests
- `npm test`

##### Publishing to npm
- `npm run publish-to-npm`

##### Pubishing to gh-pages
- `npm run publish-to-gh-pages`

### Examples
#### webpack + es6 setup
<https://github.com/leandrowd/demo-react-responsive-carousel-es6>
