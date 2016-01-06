var React = require('react');
var ReactDOM = require('react-dom');
var Carousel = require('./components/Carousel');

function onChange() {
    console.log('onChange', arguments);
}

function onSelectItem() {
    console.log('onSelectItem', arguments);
}

// Begin DemoSliderControls
var DemoSliderWithItems = React.createClass({displayName: "DemoSliderWithItems",
    render:function() {
        return (
            React.createElement(Carousel, {showArrows: false, onChange: onChange, onSelectItem: onSelectItem}, 
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
ReactDOM.render(React.createElement(DemoSliderWithItems, null), document.querySelector('.demo-gallery'));


// Begin DemoSliderControls
var DemoSlider2 = function() {
    return (
        React.createElement(Carousel, {showControls: "true", showStatus: "true", showThumbs: "true", onChange: onChange, onSelectItem: onSelectItem}, 
            React.createElement("img", {src: "assets/1.jpeg"}), 
            React.createElement("img", {src: "assets/2.jpeg"}), 
            React.createElement("img", {src: "assets/3.jpeg"}), 
            React.createElement("img", {src: "assets/4.jpeg"}), 
            React.createElement("img", {src: "assets/5.jpeg"}), 
            React.createElement("img", {src: "assets/6.jpeg"}), 
            React.createElement("img", {src: "assets/7.jpeg"})
        )
    );
};

var Gallery = function () {
    return (
        React.createElement(Carousel, {showControls: "true", showStatus: "true", onChange: onChange, onSelectItem: onSelectItem, className: "parent"}, 
            React.createElement("div", {className: "page-carousel"}, 
                React.createElement(DemoSliderWithItems, null)
            ), 
            React.createElement("div", {className: "page-carousel"}, 
                React.createElement(DemoSlider2, null)
            )
        )
    );
}

// Begin DemoCarousel
var DemoCarousel = function() {
    return (
        React.createElement(Carousel, null, 
            React.createElement("img", {src: "assets/1.jpeg"}), 
            React.createElement("img", {src: "assets/2.jpeg"}), 
            React.createElement("img", {src: "assets/3.jpeg"}), 
            React.createElement("img", {src: "assets/4.jpeg"}), 
            React.createElement("img", {src: "assets/5.jpeg"}), 
            React.createElement("img", {src: "assets/6.jpeg"}), 
            React.createElement("img", {src: "assets/7.jpeg"}), 
            React.createElement("img", {src: "assets/1.jpeg"}), 
            React.createElement("img", {src: "assets/2.jpeg"}), 
            React.createElement("img", {src: "assets/3.jpeg"}), 
            React.createElement("img", {src: "assets/4.jpeg"}), 
            React.createElement("img", {src: "assets/5.jpeg"}), 
            React.createElement("img", {src: "assets/6.jpeg"}), 
            React.createElement("img", {src: "assets/7.jpeg"}), 
            React.createElement("img", {src: "assets/1.jpeg"}), 
            React.createElement("img", {src: "assets/2.jpeg"}), 
            React.createElement("img", {src: "assets/3.jpeg"}), 
            React.createElement("img", {src: "assets/4.jpeg"}), 
            React.createElement("img", {src: "assets/5.jpeg"}), 
            React.createElement("img", {src: "assets/6.jpeg"}), 
            React.createElement("img", {src: "assets/7.jpeg"}), 
            React.createElement("img", {src: "assets/1.jpeg"}), 
            React.createElement("img", {src: "assets/2.jpeg"}), 
            React.createElement("img", {src: "assets/3.jpeg"}), 
            React.createElement("img", {src: "assets/4.jpeg"}), 
            React.createElement("img", {src: "assets/5.jpeg"}), 
            React.createElement("img", {src: "assets/6.jpeg"}), 
            React.createElement("img", {src: "assets/7.jpeg"})
        )
    );
};

// ReactDOM.render(<DemoCarousel />, document.querySelector('.demo-carousel'));
// End DemoCarousel