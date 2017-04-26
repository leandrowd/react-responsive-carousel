export default (position, axis) => {
    const positionCss = (axis === 'horizontal') ? [position, 0, 0] : [0, position, 0];
    const transitionProp = 'translate3d';

    const translatedPosition = '(' + positionCss.join(',') + ')';

    return transitionProp + translatedPosition;
};
