export default (function (position, axis) {
  var positionCss = axis === 'horizontal' ? [position, 0, 0] : [0, position, 0];
  var transitionProp = 'translate3d';
  var translatedPosition = '(' + positionCss.join(',') + ')';
  return transitionProp + translatedPosition;
});