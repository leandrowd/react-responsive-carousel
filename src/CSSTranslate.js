var has3d = require('./has3d')();

module.exports = function (position, axis) {
    var positionCss = (axis === 'horizontal') ? [position, 0] : [0, position];
    var transitionProp = has3d ? 'translate3d' : 'translate';
    
    if (has3d) {
        // adds z position
        positionCss.push(0);
    }

    var translatedPosition = '(' + positionCss.join(',') + ')';

    return transitionProp + translatedPosition;
};