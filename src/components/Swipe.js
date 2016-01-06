// TODO: create a swipe component to wrap the carousel so we don't need to setState anymore o/
// The component should not allow to swipe to any side if it's on the edges
var React = require('react');
var has3d = require('../has3d')();

module.exports = React.createClass({
    displayName: 'Swipe',
    propTypes: {
        tagName: React.PropTypes.string.isRequired,
        onSwipeUp: React.PropTypes.func.isRequired,
        onSwipeDown: React.PropTypes.func.isRequired,
        onSwipeLeft: React.PropTypes.func.isRequired,
        onSwipeRight: React.PropTypes.func.isRequired,
        onSwipeStart: React.PropTypes.func.isRequired,
        onSwipeMove: React.PropTypes.func.isRequired,
        onSwipeEnd: React.PropTypes.func.isRequired
    },

    getDefaultProps() {
        return {
            tagName: 'div',
            onSwipeUp() {},
            onSwipeDown() {},
            onSwipeLeft() {},
            onSwipeRight() {},
            onSwipeStart() {},
            onSwipeMove() {},
            onSwipeEnd() {}
        }
    },

    _handleSwipeStart (e) {
        var { pageX, pageY } = e.touches[0];
        this.touchStart = { pageX, pageY }; 
        
        this.props.onSwipeStart();
    },

    _handleSwipeMove (e) {
        e.preventDefault();
        var deltaX = e.touches[0].pageX - this.touchStart.pageX;
        var deltaY = e.touches[0].pageY - this.touchStart.pageY;

        this.swiping = true;
        
        this.props.onSwipeMove({x: deltaX, y: deltaY});

        this.touchPosition = { deltaX, deltaY };
    },

    _handleSwipeEnd (e) {
        if (this.swiping) {
            if (this.touchPosition.deltaX < 0) {
                this.props.onSwipeLeft(1);
            } else if (this.touchPosition.deltaX > 0) {
                this.props.onSwipeRight(1);
            }

            if (this.touchPosition.deltaY < 0) {
                this.props.onSwipeDown(1);
            } else if (this.touchPosition.deltaY > 0) {
                this.props.onSwipeUp(1);
            } 
        }

        this.props.onSwipeEnd();
        this.touchStart = null;
        this.swiping = false;
        this.touchPosition = null; 
    },

    render () {
        return (
            <this.props.tagName 
                onTouchMove={this._handleSwipeMove} 
                onTouchStart={this._handleSwipeStart} 
                onTouchEnd={this._handleSwipeEnd}
                {...this.props}>

                {this.props.children}

            </this.props.tagName>
        );  
    }
});