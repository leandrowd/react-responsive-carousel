var React = require('react/addons');
var classSet = React.addons.classSet;

module.exports = {
	CAROUSEL:function (isSlider) {
		return classSet({
			"carousel": true,
			"carousel-slider": isSlider
		});
	}, 

	WRAPPER:function (isSlider) {
		return classSet({
			"thumbs-wrapper": !isSlider,
			"slider-wrapper": isSlider
		});
	},

	SLIDER:function (isSlider){
		return classSet({
			"thumbs": !isSlider,
			"slider": isSlider
		});
	},

	ITEM:function (isSlider, index, selectedItem) {
		return classSet({
			"thumb": !isSlider,
			"slide": isSlider,
			"selected": index === selectedItem
		});
	},

	ARROW_LEFT:function (disabled) {
		return classSet({
			"control-arrow control-left": true,
			"control-disabled": disabled
		});
	},

	ARROW_RIGHT:function (disabled) {
		return classSet({
			"control-arrow control-right": true,
			"control-disabled": disabled
		})
	},

	DOT:function (selected) {
		return classSet({
			"dot": true,
			'selected': selected
		})
	}
}