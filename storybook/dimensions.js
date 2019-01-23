export const outerWidth = (el) => {
	let width = el.offsetWidth;
	const style = getComputedStyle(el);

	width += parseInt(style.marginLeft) + parseInt(style.marginRight);
	return width;
};
