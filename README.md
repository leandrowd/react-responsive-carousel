# React Responsive Carousel

# Help wanted

Things here are running very slowly as I have a lot of other stuff to take care at the moment so please don't be upset if I don't answer your question or if a PR sits unreviewed for a few days or weeks. Anyone interested in helping it move faster can help by submitting or reviewing PR's and answering each other's questions. (https://github.com/leandrowd/react-responsive-carousel/issues/160)

[![npm version](https://badge.fury.io/js/react-responsive-carousel.svg)](https://badge.fury.io/js/react-responsive-carousel)
[![Build Status](https://travis-ci.org/leandrowd/react-responsive-carousel.svg?branch=master)](https://travis-ci.org/leandrowd/react-responsive-carousel)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fleandrowd%2Freact-responsive-carousel.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fleandrowd%2Freact-responsive-carousel?ref=badge_shield)

Powerful, lightweight and fully customizable carousel component for React apps.

### Features

-   Responsive
-   Mobile friendly
-   Swipe to slide
-   Mouse emulating touch
-   Server side rendering
-   Keyboard navigation
-   Custom animation duration
-   Auto play
-   Custom auto play interval
-   Infinite loop
-   Horizontal or Vertical directions
-   Supports images, videos, text content or anything you want. Each direct child represents one slide!
-   Supports any flux library (use `selectedItem` prop to set from the app state, and `onChange` callback to get the new position)
-   Show/hide anything (thumbs, indicators, arrows, status)

### Important links:

-   [Codesandbox playground](https://codesandbox.io/s/github/leandrowd/react-responsive-carousel/tree/master/codesandbox/default)
-   [Storybook](http://react-responsive-carousel.js.org/storybook/)
-   [Changelog](https://github.com/leandrowd/react-responsive-carousel/blob/master/CHANGELOG.md)
-   [Before contributing](https://github.com/leandrowd/react-responsive-carousel/blob/master/CONTRIBUTING.md)
-   [Troubleshooting](https://github.com/leandrowd/react-responsive-carousel/blob/master/TROUBLESHOOTING.md)

### Demo

<http://leandrowd.github.io/react-responsive-carousel/>

Check it out these [cool demos](http://react-responsive-carousel.js.org/storybook/index.html) created using [storybook](https://getstorybook.io/). The source code for each example is available [here](https://github.com/leandrowd/react-responsive-carousel/blob/master/stories/index.js)

Customize it yourself:

-   Codesandbox: <https://codesandbox.io/s/lp602ljjj7>

### Installing as a package

`yarn add react-responsive-carousel`

### Usage

```javascript
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import "react-responsive-carousel/lib/styles/carousel.min.css";
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

=======================

### Contributing

The [contributing guide](https://github.com/leandrowd/react-responsive-carousel/blob/master/CONTRIBUTING.md) contains details on how to create pull requests and setup your dev environment. Please read it before contributing!

=======================

### Raising issues

When raising an issue, please add as much details as possible. Screenshots, video recordings, or anything else that can make it easier to reproduce the bug you are reporting.

-   A new option is to create an example with the code that causes the bug. Fork this [example from codesandbox](https://codesandbox.io/s/github/leandrowd/react-responsive-carousel/tree/master/codesandbox/default) and add your code there. Don't forget to fork, save and add the link for the example to the issue.

=======================

## License

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fleandrowd%2Freact-responsive-carousel.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fleandrowd%2Freact-responsive-carousel?ref=badge_large)
```
