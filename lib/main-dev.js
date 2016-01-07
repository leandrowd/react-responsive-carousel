var React = require('react');
var ReactDOM = require('react-dom');
var Carousel = require('./components/Carousel');

function onChange() {
    console.log('onChange', arguments);
}

function onClickItem() {
    console.log('onClickItem', arguments);
}

function onClickThumb() {
    console.log('onClickThumb', arguments);
}

// Begin DemoSliderControls
var DemoCarousel = React.createClass({displayName: "DemoCarousel",
    render:function() {
        return (
            React.createElement(Carousel, {showArrows: true, onChange: onChange, onClickItem: onClickItem, onClickThumb: onClickThumb}, 
                React.createElement("div", null, 
                    React.createElement("img", {src: "assets/1.jpeg"}), 
                    React.createElement("p", {className: "legend"}, "Legend 1")
                ), 
                React.createElement("div", null, 
                    React.createElement("img", {src: "assets/2.jpeg"}), 
                    React.createElement("p", {className: "legend"}, "Legend 2")
                ), 
                React.createElement("div", null, 
                    React.createElement("img", {src: "assets/3.jpeg"}), 
                    React.createElement("p", {className: "legend"}, "Legend 3")
                ), 
                React.createElement("div", null, 
                    React.createElement("img", {src: "assets/4.jpeg"}), 
                    React.createElement("p", {className: "legend"}, "Legend 4")
                ), 
                React.createElement("div", null, 
                    React.createElement("img", {src: "assets/5.jpeg"}), 
                    React.createElement("p", {className: "legend"}, "Legend 5")
                ), 
                React.createElement("div", null, 
                    React.createElement("img", {src: "assets/6.jpeg"}), 
                    React.createElement("p", {className: "legend"}, "Legend 6")
                )
            )
        );
    }
});
ReactDOM.render(React.createElement(DemoCarousel, null), document.querySelector('.demo-carousel'));

// Begin DemoSliderControls
var DemoCarouselVertical = React.createClass({displayName: "DemoCarouselVertical",
    render:function() {
        return (
            React.createElement(Carousel, {axis: "vertical", showArrows: true, onChange: onChange, onClickItem: onClickItem, onClickThumb: onClickThumb}, 
                React.createElement("div", null, 
                    React.createElement("img", {src: "assets/1.jpeg"}), 
                    React.createElement("p", {className: "legend"}, "Legend 1")
                ), 
                React.createElement("div", null, 
                    React.createElement("img", {src: "assets/2.jpeg"}), 
                    React.createElement("p", {className: "legend"}, "Legend 2")
                ), 
                React.createElement("div", null, 
                    React.createElement("img", {src: "assets/3.jpeg"}), 
                    React.createElement("p", {className: "legend"}, "Legend 3")
                ), 
                React.createElement("div", null, 
                    React.createElement("img", {src: "assets/4.jpeg"}), 
                    React.createElement("p", {className: "legend"}, "Legend 4")
                ), 
                React.createElement("div", null, 
                    React.createElement("img", {src: "assets/5.jpeg"}), 
                    React.createElement("p", {className: "legend"}, "Legend 5")
                ), 
                React.createElement("div", null, 
                    React.createElement("img", {src: "assets/6.jpeg"}), 
                    React.createElement("p", {className: "legend"}, "Legend 6")
                )
            )
        );
    }
});
ReactDOM.render(React.createElement(DemoCarouselVertical, null), document.querySelector('.demo-carousel-vertical'));

// Begin DemoSliderControls
var DemoCleanCarousel = React.createClass({displayName: "DemoCleanCarousel",
    render:function() {
        return (
            React.createElement(Carousel, {showThumbs: false, showArrows: false, showStatus: false, onChange: onChange, onClickItem: onClickItem}, 
                React.createElement("div", null, 
                    React.createElement("img", {src: "assets/1.jpeg"}), 
                    React.createElement("p", {className: "legend"}, "Legend 1")
                ), 
                React.createElement("div", null, 
                    React.createElement("img", {src: "assets/2.jpeg"}), 
                    React.createElement("p", {className: "legend"}, "Legend 2")
                ), 
                React.createElement("div", null, 
                    React.createElement("img", {src: "assets/3.jpeg"}), 
                    React.createElement("p", {className: "legend"}, "Legend 3")
                ), 
                React.createElement("div", null, 
                    React.createElement("img", {src: "assets/4.jpeg"}), 
                    React.createElement("p", {className: "legend"}, "Legend 4")
                ), 
                React.createElement("div", null, 
                    React.createElement("img", {src: "assets/5.jpeg"}), 
                    React.createElement("p", {className: "legend"}, "Legend 5")
                ), 
                React.createElement("div", null, 
                    React.createElement("img", {src: "assets/6.jpeg"}), 
                    React.createElement("p", {className: "legend"}, "Legend 6")
                )
            )
        );
    }
});
ReactDOM.render(React.createElement(DemoCleanCarousel, null), document.querySelector('.demo-clean-carousel'));

