module.exports = function has3d() {
    if (!window.getComputedStyle) {
        return false;
    }

    var el = document.createElement('p'), 
        has3d,
        transforms = {
            'webkitTransform':'-webkit-transform',
            'OTransform':'-o-transform',
            'msTransform':'-ms-transform',
            'MozTransform':'-moz-transform',
            'transform':'transform'
        };

    // Add it to the body to get the computed style.
    var body;
    if(!document.body)
    {
        body = document.createElement('body');
        document.children[0].appendChild(body);
    }
    document.body.insertBefore(el, null);

    for (var t in transforms) {
        if (el.style[t] !== undefined) {
            el.style[t] = "translate3d(1px,1px,1px)";
            has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
        }
    }

    document.body.removeChild(el);

    if(body)
    {
        document.children[0].removeChild(body);
    }

    return (has3d !== undefined && has3d.length > 0 && has3d !== "none");
}