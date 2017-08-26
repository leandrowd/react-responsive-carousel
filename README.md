# React Responsive Carousel

#### Help wanted - please read: https://github.com/leandrowd/react-responsive-carousel/issues/160

[![npm version](https://badge.fury.io/js/react-responsive-carousel.svg)](https://badge.fury.io/js/react-responsive-carousel)
[![Build Status](https://travis-ci.org/leandrowd/react-responsive-carousel.svg?branch=master)](https://travis-ci.org/leandrowd/react-responsive-carousel)

Powerful, lightweight and fully customizable carousel component for React apps. 

### Features

- Responsive
- Mobile friendly
- Swipe to slide
- Mouse emulating touch 
- Server side rendering
- Keyboard navigation
- Custom animation duration
- Auto play
- Custom auto play interval
- Infinite loop
- Horizontal or Vertical directions
- Supports images, videos, text content or anything you want. Each direct child represents one slide!
- Supports any flux library (use `selectedItem` prop to set from the app state, and `onChange` callback to get the new position)
- Show/hide anything (thumbs, indicators, arrows, status)

### Demo
<http://leandrowd.github.io/react-responsive-carousel/>

Check it out these [cool demos](http://react-responsive-carousel.js.org/storybook/) created using [storybook](https://getstorybook.io/). The source code for each example is available [here](https://github.com/leandrowd/react-responsive-carousel/blob/master/stories/index.js)

### Installing as a package
`npm install react-responsive-carousel --save`

### Usage

```javascript
var React = require('react');
var ReactDOM = require('react-dom');
var Carousel = require('react-responsive-carousel').Carousel;

var DemoCarousel = React.createClass({
    render() {
        return (
            <Carousel axis="horizontal|vertical" showThumbs={true|false} showArrows={true|false} onChange={onChange} onClickItem={onClickItem} onClickThumb={onClickThumb} dynamicHeight emulateTouch>
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

// Using webpack
// import styles from 'react-responsive-carousel/lib/styles/carousel.min.css';

// Using html tag:
// <link rel="stylesheet" href="<NODE_MODULES_FOLDER>/react-responsive-carousel/lib/styles/carousel.min.css"/>

```

| Attributes            | Type          | Default | Description |
| :---------            | :--:          | :-----: | :----------- |
| showArrows            | `boolean`     | `true` | show prev and next arrows |
| showStatus            | `boolean`     | `true` | show index of the current item. i.e: (1/8) |
| showIndicators        | `boolean`     | `true` | show little dots at the bottom with links for changing the item |
| showThumbs            | `boolean`     | `true` | show thumbnails of the images |
| infiniteLoop          | `boolean`     | `false` | infinite loop sliding  |
| selectedItem          | `number`      | `0` | selects an item though props / defines the initial selected item |
| axis                  | `string`      | `horizontal` | changes orientation - accepts `horizontal` and `vertical` |
| onChange              | `function`    | - | Fired when changing positions |
| onClickItem           | `function`    | - | Fired when an item is clicked |
| onClickThumb          | `function`    | - | Fired when a thumb it clicked |
| width                 | `string`      | - | Allows to set a fixed width |
| useKeyboardArrows     | `boolean`     | `false` | Adds support to next and prev through keyboard arrows |
| autoPlay              | `boolean`     | `false` | Auto play |
| stopOnHover           | `boolean`     | `true` | Stop auto play while mouse is over the carousel |
| interval              | `number`      | `5000` | Interval of auto play |
| transitionTime        | `number`      | `350` | Duration of slide transitions (in miliseconds) |
| swipeScrollTolerance  | `number`      | `5` | Allows scroll when the swipe movement occurs in a different direction than the carousel axis and within the tolerance - Increase for loose - Decrease for strict | 
| dynamicHeight         | `boolean`     | `false` | Adjusts the carousel height if required. -- Do not work with vertical axis -- |
| emulateTouch          | `boolean`     | `false` | Allows mouse to simulate swipe |
| statusFormatter       | `func`        | (current, total) => `${current} of ${total}` | Allows custom formatting of the status indicator |  


=======================

### Contributing
Feel free to submit a PR or raise issues. When submitting a PR, please:
- add the required tests and an example of usage to `stories/index.js`
- don't submit changes to the `/lib` folder as it will be generated again after the merge.
- ensure you have the editorConfig plugin or the same code style settings as defined in `.editorConfig` to avoid excess of spaces in diffs

=======================

### Setting up development environment
- `git clone git@github.com:leandrowd/react-responsive-carousel.git`
- `npm install`
- `npm start`
- Open your favourite browser on `localhost:8000` - livereload will be enabled and tests will run on each change

> The fastest dev environment is on node 6. If you have `nvm` installed, just run `nvm use 6`. Tests in travis will run on node 4 and 6

#### Running only tests
- `npm test`

#### Running storybook
- `npm run storybook`

=======================

### Only after merged back to master

#### Publish to npm
- `npm run publish-to-npm`

#### Pubish to gh-pages
- `npm run publish-to-gh-pages`

=======================

### Examples
#### webpack + es6 setup
<https://github.com/leandrowd/demo-react-responsive-carousel-es6>

#### Storybook
<http://react-responsive-carousel.js.org/storybook/>

=======================

[CHANGELOG](https://github.com/leandrowd/react-responsive-carousel/blob/master/CHANGELOG.md) - [TROUBLESHOOTING](https://github.com/leandrowd/react-responsive-carousel/blob/master/TROUBLESHOOTING.md)
