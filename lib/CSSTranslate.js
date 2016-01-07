var has3d = require('./has3d');

module.exports = function (position, axis) {
    var _has3d = has3d();
    var positionCss = (axis === 'horizontal') ? [position, 0] : [0, position];
    var transitionProp = _has3d ? 'translate3d' : 'translate';
    
    if (_has3d) {
        // adds z position
        positionCss.push(0);
    }

    var translatedPosition = '(' + positionCss.join(',') + ')';

    return transitionProp + translatedPosition;
};