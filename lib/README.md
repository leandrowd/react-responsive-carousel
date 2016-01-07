# React Responsive Carousel

## Demo
<http://leandrowd.github.io/react-responsive-carousel/>


## Installing as a package

`npm install react-responsive-carousel --save`


## Contributing

Please, feel free to contributing. You may file an issue or submit a pull request!


## Development

To run it on your local environment just: 

- `git clone git@github.com:leandrowd/react-responsive-carousel.git`
- `npm install`
- `gulp`
- Open your favourite browser on `localhost:8000`

To generate the npm package run `gulp package`. It will transpile the jsx to js and copy the css into the lib folder.


## Getting started

### Slider with controls

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

## Properties

- (Boolean) showArrows (default: true, options: true, false)
- (Boolean) showStatus (default: true, options: true, false)
- (Boolean) showIndicators (default: true, options: true, false)
- (Boolean) showThumbs (default: true, options: true, false)
- (Number) selectedItem (default: 0, options: any number between the first and the last index)
- (String) axis (default: "horizontal" | options: "horizontal", "vertical")
- (Function) onChange (Triggered when the carousel move)
- (Function) onClickItem (Triggered when an item is clicked)
- (Function) onClickThumb (Triggered when a thumb is clicked)


## Last update:
- Adding free children;
- Adding vertical carousel;
- Adding free legend;
- Fixing problem with has3d being called before body was available;
- Updating to use ref callbacks;
- Renaming callbacks;
- Extracting swiper component;
- Extracting thumbs;
- Improving styles;