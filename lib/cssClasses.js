'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

exports.default = {
    ROOT: function ROOT(customClassName) {
        return (0, _classnames2.default)(_defineProperty({
            'carousel-root': true
        }, customClassName, !!customClassName));
    },

    CAROUSEL: function CAROUSEL(isSlider) {
        return (0, _classnames2.default)({
            carousel: true,
            'carousel-slider': isSlider
        });
    },

    WRAPPER: function WRAPPER(isSlider, axis) {
        return (0, _classnames2.default)({
            'thumbs-wrapper': !isSlider,
            'slider-wrapper': isSlider,
            'axis-horizontal': axis === 'horizontal',
            'axis-vertical': axis !== 'horizontal'
        });
    },

    SLIDER: function SLIDER(isSlider, isSwiping) {
        return (0, _classnames2.default)({
            thumbs: !isSlider,
            slider: isSlider,
            animated: !isSwiping
        });
    },

    ITEM: function ITEM(isSlider, selected) {
        return (0, _classnames2.default)({
            thumb: !isSlider,
            slide: isSlider,
            selected: selected
        });
    },

    ARROW_PREV: function ARROW_PREV(disabled) {
        return (0, _classnames2.default)({
            'control-arrow control-prev': true,
            'control-disabled': disabled
        });
    },

    ARROW_NEXT: function ARROW_NEXT(disabled) {
        return (0, _classnames2.default)({
            'control-arrow control-next': true,
            'control-disabled': disabled
        });
    },

    DOT: function DOT(selected) {
        return (0, _classnames2.default)({
            dot: true,
            selected: selected
        });
    }
};