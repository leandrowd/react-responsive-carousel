var classNames = require('classnames');

module.exports = {
	CAROUSEL:function (isSlider) {
		return classNames({
			"carousel": true,
			"carousel-slider": isSlider
		});
	}, 

	WRAPPER:function (isSlider) {
		return classNames({
			"thumbs-wrapper": !isSlider,
			"slider-wrapper": isSlider
		});
	},

	SLIDER:function (isSlider, isSwiping){
		return classNames({
			"thumbs": !isSlider,
			"slider": isSlider,
			"swiping": isSwiping
		});
	},

	ITEM:function (isSlider, index, selectedItem, hasMount) {
		return classNames({
			"thumb": !isSlider,
			"slide": isSlider,
            "selected": index === selectedItem && hasMount
		});
	},

	ARROW_LEFT:function (disabled) {
		return classNames({
			"control-arrow control-left": true,
			"control-disabled": disabled
		});
	},

	ARROW_RIGHT:function (disabled) {
		return classNames({
			"control-arrow control-right": true,
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
