"use strict";

var classNames = require('classnames');

module.exports = {
    CAROUSEL: function CAROUSEL(isSlider) {
        return classNames({
            "carousel": true,
            "carousel-slider": isSlider
        });
    },
    WRAPPER: function WRAPPER(isSlider, axis) {
        return classNames({
            "thumbs-wrapper": !isSlider,
            "slider-wrapper": isSlider,
            "axis-horizontal": axis === "horizontal",
            "axis-vertical": axis !== "horizontal"
        });
    },
    SLIDER: function SLIDER(isSlider, isSwiping) {
        return classNames({
            "thumbs": !isSlider,
            "slider": isSlider,
            "animated": !isSwiping
        });
    },
    ITEM: function ITEM(isSlider, selected) {
        return classNames({
            "thumb": !isSlider,
            "slide": isSlider,
            "selected": selected
        });
    },
    ARROW_PREV: function ARROW_PREV(disabled) {
        return classNames({
            "control-arrow control-prev": true,
            "control-disabled": disabled
        });
    },
    ARROW_NEXT: function ARROW_NEXT(disabled) {
        return classNames({
            "control-arrow control-next": true,
            "control-disabled": disabled
        });
    },
    DOT: function DOT(selected) {
        return classNames({
            "dot": true,
            'selected': selected
        });
    }
};