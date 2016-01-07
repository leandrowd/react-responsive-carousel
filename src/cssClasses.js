var classNames = require('classnames');

module.exports = {
	CAROUSEL (isSlider) {
		return classNames({
			"carousel": true,
			"carousel-slider": isSlider
		});
	}, 

	WRAPPER (isSlider, axis) {
		return classNames({
			"thumbs-wrapper": !isSlider,
			"slider-wrapper": isSlider,
			"axis-horizontal": axis === "horizontal",
			"axis-vertical": axis !== "horizontal"
		});
	},

	SLIDER (isSlider, isSwiping){
		return classNames({
			"thumbs": !isSlider,
			"slider": isSlider,
			"animated": !isSwiping
		});
	},

	ITEM (isSlider, selected) {
		return classNames({
			"thumb": !isSlider,
			"slide": isSlider,
            "selected": selected
		});
	},

	ARROW_PREV (disabled) {
		return classNames({
			"control-arrow control-prev": true,
			"control-disabled": disabled
		});
	},

	ARROW_NEXT (disabled) {
		return classNames({
			"control-arrow control-next": true,
			"control-disabled": disabled
		})
	},

	DOT (selected) {
		return classNames({
			"dot": true,
			'selected': selected
		})
	}
}
