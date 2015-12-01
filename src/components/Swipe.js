// TODO: create a swipe component to wrap the carousel so we don't need to setState anymore o/
// The component should not allow to swipe to any side if it's on the edges
var React = require('react');
var has3d = require('../has3d')();

module.exports = React.createClass({
    propTypes: {
        tagName: React.PropTypes.string.isRequired,
        onSwipeLeft: React.PropTypes.func.isRequired,
        onSwipeRight: React.PropTypes.func.isRequired,
        onSwipeStart: React.PropTypes.func.isRequired,
        onSwipeMove: React.PropTypes.func.isRequired,
        onSwipeEnd: React.PropTypes.func.isRequired
    },

    getDefaultProps() {
        return {
            tagName: 'div',
            onSwipeLeft() {},
            onSwipeRight() {},
            onSwipeStart() {},
            onSwipeMove() {},
            onSwipeEnd() {}
        }
    },

    _handleSwipeStart (e) {
        this.touchStart = e.touches[0].pageX;
        this.swiping = true;

        this.props.onSwipeStart();
    },

    _handleSwipeMove (e) {
        var deltaX = e.touches[0].pageX - this.touchStart;
        
        this.props.onSwipeMove(deltaX);

        this.touchPosition = deltaX;
    },

    _handleSwipeEnd (e) {
        this.touchStart = null;
        this.swiping = false;

        if (this.touchPosition < 0) {
            this.props.onSwipeLeft(1);

        } else if (this.touchPosition > 0) {
            this.props.onSwipeRight(1);
        }

        this.props.onSwipeEnd();
         
        this.touchPosition = null; 
    },

    render () {
        return (
            <this.props.tagName 
                onTouchMove={this._handleSwipeMove} 
                onTouchStart={this._handleSwipeStart} 
                onTouchEnd={this._handleSwipeEnd}
                className={this.props.className}
                style={this.props.style}>

                {this.props.children}

            </this.props.tagName>
        );  
    }
});