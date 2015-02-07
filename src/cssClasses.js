var React = require('react/addons');
var classSet = React.addons.classSet;

module.exports = {
	CAROUSEL (isSlider) {
		return classSet({
			"carousel": true,
			"carousel-slider": isSlider
		});
	}, 

	WRAPPER (isSlider) {
		return classSet({
			"thumbs-wrapper": !isSlider,
			"slider-wrapper": isSlider
		});
	},

	SLIDER (isSlider){
		return classSet({
			"thumbs": !isSlider,
			"slider": isSlider
		});
	},

	ITEM (isSlider, index, selectedItem) {
		return classSet({
			"thumb": !isSlider,
			"slide": isSlider,
			"selected": index === selectedItem
		});
	},

	ARROW_LEFT (disabled) {
		return classSet({
			"control-arrow control-left": true,
			"control-disabled": disabled
		});
	},

	ARROW_RIGHT (disabled) {
		return classSet({
			"control-arrow control-right": true,
			"control-disabled": disabled
		})
	},

	DOT (selected) {
		return classSet({
			"dot": true,
			'selected': selected
		})
	}
}