# React Responsive Carousel

#### Help wanted - please read: https://github.com/leandrowd/react-responsive-carousel/issues/160

[![npm version](https://badge.fury.io/js/react-responsive-carousel.svg)](https://badge.fury.io/js/react-responsive-carousel)
[![Build Status](https://travis-ci.org/leandrowd/react-responsive-carousel.svg?branch=master)](https://travis-ci.org/leandrowd/react-responsive-carousel)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fleandrowd%2Freact-responsive-carousel.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fleandrowd%2Freact-responsive-carousel?ref=badge_shield)

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

### Important links:
- [Before contributing](https://github.com/leandrowd/react-responsive-carousel/blob/master/CONTRIBUTING.md)
- [Customizable example](https://codesandbox.io/s/lp602ljjj7)
- [Demos](http://react-responsive-carousel.js.org/storybook/)
- [Changelog](https://github.com/leandrowd/react-responsive-carousel/blob/master/CHANGELOG.md)
- [Troubleshooting](https://github.com/leandrowd/react-responsive-carousel/blob/master/TROUBLESHOOTING.md)


### Demo
<http://leandrowd.github.io/react-responsive-carousel/>

Check it out these [cool demos](http://react-responsive-carousel.js.org/storybook/index.html) created using [storybook](https://getstorybook.io/). The source code for each example is available [here](https://github.com/leandrowd/react-responsive-carousel/blob/master/stories/index.js)

Customize it yourself:
- Codesandbox: <https://codesandbox.io/s/lp602ljjj7>

### Installing as a package
`npm install react-responsive-carousel --save`

### Usage

```javascript
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Carousel } from 'react-responsive-carousel';

class DemoCarousel extends Component {
    render() {
        return (
            <Carousel>
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
| thumbWidth            | `number`      | `undefined` | optionally specify pixel width (as an integer) of a thumbnail (including any padding) to avoid calculating values (helps with server-side renders or page cache issues) |
| infiniteLoop          | `boolean`     | `false` | infinite loop sliding  |
| selectedItem          | `number`      | `0` | selects an item though props / defines the initial selected item |
| axis                  | `string`      | `horizontal` | changes orientation - accepts `horizontal` and `vertical` |
| verticalSwipe         | `string`      | `standard` | changes vertical swipe scroll direction - accepts `standard` and `natural` |
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
| swipeable             | `boolean`     | `true` | Enables swiping gestures |
| dynamicHeight         | `boolean`     | `false` | Adjusts the carousel height if required. -- Do not work with vertical axis -- |
| emulateTouch          | `boolean`     | `false` | Allows mouse to simulate swipe |
| statusFormatter       | `func`        | (current, total) => `${current} of ${total}` | Allows custom formatting of the status indicator |  
| centerMode            | `boolean`     | `false` | Enables centered view with partial prev/next slides. Only works with horizontal axis. |
| centerSlidePercentage | `number`      | `80` | optionally specify percentage width (as an integer) of the slides in `centerMode` |


=======================

### Contributing
Check the [contributing guide](https://github.com/leandrowd/react-responsive-carousel/blob/master/CONTRIBUTING.md)

=======================

### Raising issues
When raising an issue, please add as much details as possible. Screenshots, video recordings, or anything else that can make it easier to reproduce the bug you are reporting.

* A new option is to create an example with the code that causes the bug. Fork this [example from codesandbox](https://codesandbox.io/s/lp602ljjj7) and add your code there. Don't forget to fork, save and add the link for the example to the issue.

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

#### Codesandbox
<https://codesandbox.io/s/lp602ljjj7>

=======================

## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fleandrowd%2Freact-responsive-carousel.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fleandrowd%2Freact-responsive-carousel?ref=badge_large)
