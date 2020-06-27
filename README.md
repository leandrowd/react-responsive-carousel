# React Responsive Carousel

[![npm version](https://badge.fury.io/js/react-responsive-carousel.svg)](https://badge.fury.io/js/react-responsive-carousel)
[![Build Status](https://travis-ci.org/leandrowd/react-responsive-carousel.svg?branch=master)](https://travis-ci.org/leandrowd/react-responsive-carousel)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fleandrowd%2Freact-responsive-carousel.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fleandrowd%2Freact-responsive-carousel?ref=badge_shield)

Powerful, lightweight and fully customizable carousel component for React apps.

### Features

-   Responsive
-   Mobile friendly
-   Swipe to slide
-   Mouse emulating touch
-   Server side rendering compatible
-   Keyboard navigation
-   Custom animation duration
-   Auto play w/ custom interval
-   Infinite loop
-   Horizontal or Vertical directions
-   Supports images, videos, text content or anything you want. Each direct child represents one slide!
-   Supports external controls
-   Highly customizable:
    -   Custom thumbs
    -   Custom arrows
    -   Custom indicators
    -   Custom status

### Important links:

-   [Codesandbox playground](https://codesandbox.io/s/github/leandrowd/react-responsive-carousel/tree/master/codesandbox/default)
-   [Storybook](http://react-responsive-carousel.js.org/storybook/)
-   [Changelog](https://github.com/leandrowd/react-responsive-carousel/blob/master/CHANGELOG.md)
-   [Before contributing](https://github.com/leandrowd/react-responsive-carousel/blob/master/CONTRIBUTING.md)
-   [Troubleshooting](https://github.com/leandrowd/react-responsive-carousel/blob/master/TROUBLESHOOTING.md)

### Demo

<http://leandrowd.github.io/react-responsive-carousel/>

Check it out these [cool demos](http://react-responsive-carousel.js.org/storybook/index.html) created using [storybook](https://storybook.js.org/). The source code for each example is available [here](https://github.com/leandrowd/react-responsive-carousel/blob/master/stories/)

Customize it yourself:

-   Codesandbox: <https://codesandbox.io/s/lp602ljjj7>

### Installing as a package

`yarn add react-responsive-carousel`

### Usage

```javascript
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
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

// Using webpack or parcel with a style loader
// import styles from 'react-responsive-carousel/lib/styles/carousel.min.css';

// Using html tag:
// <link rel="stylesheet" href="<NODE_MODULES_FOLDER>/react-responsive-carousel/lib/styles/carousel.min.css"/>
```

### Customizing

#### Items (Slides)

By default, each slide will be rendered as passed as children. If you need to customize them, use the prop `renderItem`.

```
renderItem: (item: React.ReactNode, options?: { isSelected: boolean }) => React.ReactNode;
```

#### Thumbs

By default, thumbs are generated extracting the images in each slide. If you don't have images on your slides or if you prefer a different thumbnail, use the method `renderThumbs` to return a new list of images to be used as thumbs.

```
renderThumbs: (children: React.ReactChild[]) => React.ReactChild[]
```

#### Arrows

By default, simple arrows are rendered on each side. If you need to customize them and the css is not enough, use the `renderArrowPrev` and `renderArrowNext`. The click handler is passed as argument to the prop and needs to be added as click handler in the custom arrow.

```
renderArrowPrev: (clickHandler: () => void, hasPrev: boolean, label: string) => React.ReactNode;
renderArrowNext: (clickHandler: () => void, hasNext: boolean, label: string) => React.ReactNode;
```

#### Indicators

By default, indicators will be rendered as those small little dots in the bottom part of the carousel. To customize them, use the `renderIndicator` prop.

```
renderIndicator: (
    clickHandler: (e: React.MouseEvent | React.KeyboardEvent) => void,
    isSelected: boolean,
    index: number,
    label: string
) => React.ReactNode;
```

#### Take full control of the carousel

If none of the previous options are enough, you can build your own controls for the carousel. Check an example at http://react-responsive-carousel.js.org/storybook/?path=/story/02-advanced--with-external-controls

### Videos

If your carousel is about videos, keep in mind that it's up to you to control which videos will play. Using the `renderItem` prop, you will get information saying if the slide is selected or not and can use that to change the video state. Only play videos on selected slides to avoid issues. Check an example at http://react-responsive-carousel.js.org/storybook/?path=/story/02-advanced--youtube-autoplay-with-custom-thumbs

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

```
