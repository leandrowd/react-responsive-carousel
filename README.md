# React Responsive Carousel

[![npm version](https://badge.fury.io/js/react-responsive-carousel.svg)](https://badge.fury.io/js/react-responsive-carousel)
[![Build Status](https://travis-ci.org/leandrowd/react-responsive-carousel.svg?branch=master)](https://travis-ci.org/leandrowd/react-responsive-carousel)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fleandrowd%2Freact-responsive-carousel.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fleandrowd%2Freact-responsive-carousel?ref=badge_shield)

Powerful, lightweight and fully customizable carousel component for React apps.

### Important

I don't have any time available to keep maintaining this package. If you have any request, try to sort it within the comuninity. I'm able to merge pull requests that look safe from time to time but no commitment on timelines here. Feel free to fork it and publish under other name if you are in a hurry or to use another component.

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
    -   Custom animation handlers

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

### Props

| Name                                     | Value                        | Description                                                                                                                                                                                                           |
| ---------------------------------------- | ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| axis                                     | `'horizontal'`, `'vertical'` | Define the direction of the slider, defaults to `'horizontal'`.                                                                                                                                                       |
| autoFocus                                | `boolean`                    | Force focus on the carousel when it renders.                                                                                                                                                                          |
| autoPlay                                 | `boolean`                    | Change the slide automatically based on `interval` prop.                                                                                                                                                              |
| centerMode                               | `boolean`                    | Center the current item and set the slide width based on `centerSlidePercentage`.                                                                                                                                     |
| centerSlidePercentage                    | `number`                     | Define the width percentage relative to the carousel width when `centerMode` is `true`.                                                                                                                               |
| dynamicHeight                            | `boolean`                    | The height of the items will not be fixed.                                                                                                                                                                            |
| emulateTouch                             | `boolean`                    | Enable swipe on non-touch screens when `swipeable` is `true`.                                                                                                                                                         |
| infiniteLoop                             | `boolean`                    | Going after the last item will move back to the first slide.                                                                                                                                                          |
| interval                                 | `number`                     | Interval in milliseconds to automatically go to the next item when `autoPlay` is true, defaults to `3000`.                                                                                                            |
| labels                                   | `object`                     | Apply `aria-label` on carousel with an `object` with the properties `leftArrow`, `rightArrow` and `item`. The default is `{leftArrow: 'previous slide / item', rightArrow: 'next slide / item', item: 'slide item'}`. |
| onClickItem                              | `function`                   | Callback to handle a click event on a slide, receives the current index and item as arguments.                                                                                                                        |
| onClickThumb                             | `function`                   | Callback to handle a click event on a thumb, receives the current index and item as arguments.                                                                                                                        |
| onChange                                 | `function`                   | Callback to handle every time the selected item changes, receives the current index and item as arguments.                                                                                                            |
| onSwipeStart                             | `function`                   | Callback to handle when the swipe starts, receives a touch event as argument.                                                                                                                                         |
| onSwipeEnd                               | `function`                   | Callback to handle when the swipe ends, receives a touch event as argument.                                                                                                                                           |
| onSwipeMove                              | `function`                   | Callback triggered on every movement while swiping, receives a touch event as argument.                                                                                                                               |
| preventMovementUntilSwipeScrollTolerance | `boolean`                    | Don't let the carousel scroll until the user swipe to the value specified on `swipeScrollTolerance`.                                                                                                                  |
| renderArrowPrev                          | `function`                   | Render custom previous arrow. Receives a click handler, a `boolean` that shows if there's a previous item, and the accessibility label as arguments.                                                                  |
| renderArrowNext                          | `function`                   | Render custom previous arrow. Receives a click handler, a `boolean` that shows if there's a next item, and the accessibility label as arguments.                                                                      |
| renderIndicator                          | `function`                   | Render custom indicator. Receives a click handler, a `boolean` that shows if the item is selected, the item index, and the accessibility label as arguments.                                                          |
| renderItem                               | `function`                   | Render a custom item. Receives an item of the carousel, and an `object` with the `isSelected` property as arguments.                                                                                                  |
| renderThumbs                             | `function`                   | Render prop to show the thumbs, receives the carousel items as argument. Get the `img` tag of each item of the slider, and render it by default.                                                                      |
| selectedItem                             | `number`                     | Set the selected item, defaults to `0`.                                                                                                                                                                               |
| showArrows                               | `boolean`                    | Enable previous and next arrow, defaults to `true`.                                                                                                                                                                   |
| showStatus                               | `boolean`                    | Enable status of the current item to the total, defaults to `true`.                                                                                                                                                   |
| showIndicators                           | `boolean`                    | Enable indicators to select items, defaults to `true`.                                                                                                                                                                |
| showThumbs                               | `boolean`                    | Enable thumbs, defaults to `true`.                                                                                                                                                                                    |
| statusFormatter                          | `function`                   | Formatter that returns the status as a `string`, receives the current item and the total count as arguments. Defaults to `{currentItem} of {total}` format.                                                           |
| stopOnHover                              | `boolean`                    | The slide will not change by `autoPlay` on hover, defaults to `true`.                                                                                                                                                 |
| swipeable                                | `boolean`                    | Enable the user to swipe the carousel, defaults to `true`.                                                                                                                                                            |
| swipeScrollTolerance                     | `number`                     | How many pixels it's needed to change the slide when swiping, defaults to `5`.                                                                                                                                        |
| thumbWidth                               | `number`                     | Width of the thumb, defaults to `80`.                                                                                                                                                                                 |
| transitionTime                           | `number`                     | Duration of the animation of changing slides.                                                                                                                                                                         |
| useKeyboardArrows                        | `boolean`                    | Enable the arrows to move the slider when focused.                                                                                                                                                                    |
| verticalSwipe                            | `'natural'`, `'standard'`    | Set the mode of swipe when the axis is `'vertical'`. The default is `'standard'`.                                                                                                                                     |
| width                                    | `number` or `string`         | The width of the carousel, defaults to `100%`.                                                                                                                                                                        |

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

#### Custom Animations

By default, the carousel uses the traditional 'slide' style animation. There is also a built in fade animation, which can be used by passing `'fade'` to the `animationHandler` prop. \*note: the 'fade' animation does not support swiping animations, so you may want to set `swipeable` to `false`

If you would like something completely custom, you can pass custom animation handler functions to `animationHandler`, `swipeAnimationHandler`, and `stopSwipingHandler`. The animation handler functions accept props and state, and return styles for the contain list, default slide style, selected slide style, and previous slide style. Take a look at the fade animation handler for an idea of how they work:

```javascript
const fadeAnimationHandler: AnimationHandler = (props, state): AnimationHandlerResponse => {
    const transitionTime = props.transitionTime + 'ms';
    const transitionTimingFunction = 'ease-in-out';

    let slideStyle: React.CSSProperties = {
        position: 'absolute',
        display: 'block',
        zIndex: -2,
        minHeight: '100%',
        opacity: 0,
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        transitionTimingFunction: transitionTimingFunction,
        msTransitionTimingFunction: transitionTimingFunction,
        MozTransitionTimingFunction: transitionTimingFunction,
        WebkitTransitionTimingFunction: transitionTimingFunction,
        OTransitionTimingFunction: transitionTimingFunction,
    };

    if (!state.swiping) {
        slideStyle = {
            ...slideStyle,
            WebkitTransitionDuration: transitionTime,
            MozTransitionDuration: transitionTime,
            OTransitionDuration: transitionTime,
            transitionDuration: transitionTime,
            msTransitionDuration: transitionTime,
        };
    }

    return {
        slideStyle,
        selectedStyle: { ...slideStyle, opacity: 1, position: 'relative' },
        prevStyle: { ...slideStyle },
    };
};
```

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
