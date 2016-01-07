var classNames = require('classnames');

module.exports = {
	CAROUSEL:function (isSlider) {
		return classNames({
			"carousel": true,
			"carousel-slider": isSlider
		});
	}, 

	WRAPPER:function (isSlider, axis) {
		return classNames({
			"thumbs-wrapper": !isSlider,
			"slider-wrapper": isSlider,
			"axis-horizontal": axis === "horizontal",
			"axis-vertical": axis !== "horizontal"
		});
	},

	SLIDER:function (isSlider, isSwiping){
		return classNames({
			"thumbs": !isSlider,
			"slider": isSlider,
			"animated": !isSwiping
		});
	},

	ITEM:function (isSlider, selected) {
		return classNames({
			"thumb": !isSlider,
			"slide": isSlider,
            "selected": selected
		});
	},

	ARROW_PREV:function (disabled) {
		return classNames({
			"control-arrow control-prev": true,
			"control-disabled": disabled
		});
	},

	ARROW_NEXT:function (disabled) {
		return classNames({
			"control-arrow control-next": true,
			"control-disabled": disabled
		})
	},

	DOT:function (selected) {
		return classNames({
			"dot": true,
			'selected': selected
		})
	}
}
