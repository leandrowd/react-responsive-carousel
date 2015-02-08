(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/** @jsx React.DOM */
var React = require('react/addons');
var Carousel = require('./Carousel');

module.exports = React.createClass({displayName: "exports",
	
	propsTypes: {
		images: React.PropTypes.array.isRequired
	},

	getInitialState:function () {
		return {
			currentImage: 0
		}
	},

	selectItem:function (selectedItem) {
		this.setState({
			currentImage: selectedItem
		});
	},

	render:function () {
		var $__0=    this.props,images=$__0.images;
		var $__1=    this.state,current=$__1.current;
		var mainImage = (images && images[current] && images[current].url);

		return (
			React.createElement("div", {className: "image-gallery"}, 
				React.createElement(Carousel, {type: "slider", items: images, selectedItem: this.state.currentImage, onChange: this.selectItem, onSelectItem:  this.selectItem}), 
				React.createElement(Carousel, {items: images, selectedItem: this.state.currentImage, onSelectItem:  this.selectItem})
			)
		);
	}
});


},{"./Carousel":9,"react/addons":8}],2:[function(require,module,exports){
var RequestFrame = require('raf')
var Dimensions = require('ainojs-dimensions')
var EventMixin = require('ainojs-events')

// shortcuts
var document = window.document
var abs = Math.abs

// short event bindings
var bind = function(elem, type, handler) {
  elem.addEventListener(type, handler, false)
}
var unbind = function(elem, type, handler) {
  elem.removeEventListener(type, handler, false)
}

// track velocity
var tracker = []

var Finger = function(elem, options) {

  if ( !(this instanceof Finger) )
    return new Finger(elem, options)

  // test for basic js support
  if ( 
    !document.addEventListener || 
    !Array.prototype.forEach || 
    !('contains' in document.body) ||
    !Function.prototype.bind ||
    !document.body.children
  ) return

  // default options
  this.config = {
    start: 0,
    duration: 600, // will decrease on smaller screens
    dbltap: true, // set to false for faster tap event if doubletap is not needed
    easing: function(x,t,b,c,d) {
      return -c * ((t=t/d-1)*t*t*t - 1) + b // easeOutQuart
    },
    bounceEasing: function (x, t, b, c, d, s) {
      if (s == undefined) s = 2.0158;
      return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
    }
  }

  this.inner = elem.children[0]

  if ( !this.inner )
    return

  // extend options
  if ( options ) {
    for(var key in options) {
      this.config[key] = options[key]
    }
  }

  this.container = elem
  this.to = this.pos = 0
  this.touching = false
  this.start = {}
  this.index = this.projection = this.config.start
  this.anim = 0
  this.tap = 0
  this.clearTap = function() {
    if ( this.tap ) {
      window.clearTimeout(this.tap.timer)
      this.tap = 0
    }
  }.bind(this)

  // bind events
  bind(elem, 'touchstart', this.ontouchstart.bind(this))
  bind(window, 'resize', this.setup.bind(this))
  bind(window, 'orientationchange', this.setup.bind(this))
  bind(document, 'touchmove', this.ontouchmove.bind(this))
  bind(document, 'touchend', this.ontouchend.bind(this))

  // mixin events
  EventMixin.call(this)

  this.setup()
}

Finger.prototype.setup = function() {
  this.width = Dimensions( this.container ).width
  this.length = Math.ceil( Dimensions( this.inner ).width / this.width )
  if ( this.index !== 0 ) {
    this.index = this.validateIndex( this.index )
    this.pos = this.to = -this.width*this.index
  }
  this.loop()
}

Finger.prototype.destroy = function() {
  unbind(this.container, 'touchstart', this.ontouchstart)
  unbind(window, 'resize', this.setup)
  unbind(window, 'orientationchange', this.setup)
  unbind(document, 'touchmove', this.ontouchmove)
  unbind(document, 'touchend', this.ontouchend)
}

Finger.prototype.validateIndex = function(index) {
  return Math.min(this.length-1, Math.max(0, index))
}

Finger.prototype.ontouchstart = function(e) {

  var touch = e.touches

  this.start = {
    pageX: touch[0].pageX,
    pageY: touch[0].pageY,
    time:  +new Date(),
    pos:   this.pos || 0,
    prevent: function() { e.preventDefault() },
    distance: 0,
    target: e.target
  }

  this.isScrolling = null
  this.touching = true
  this.deltaX = 0
  this.offset = 0

  if ( this.anim ) {
    this.to = this.pos
    this.offset = (this.pos + (this.width*this.index))
    this.anim = 0
  }

  this.loop()
}

Finger.prototype.ontouchmove = function(e) {

  if ( !this.touching )
    return

  // don’t swipe if zoomed
  if ( document.documentElement && Dimensions(document.documentElement).width / window.innerWidth > 1 )
    return

  var touch = e.touches

  // ensure swiping with one touch and not pinching
  if( touch && touch.length > 1 || e.scale && e.scale !== 1 ) return

  this.deltaX = touch[0].pageX - this.start.pageX + this.offset
  
  var dx = abs(touch[0].pageX - this.start.pageX)
  var dy = abs(touch[0].pageY - this.start.pageY)

  // determine if scrolling test has run - one time test
  if ( this.isScrolling === null ) {
    this.isScrolling = !!(
      this.isScrolling || dx < dy
    )
  }

  // save distance for tap event
  this.start.distance = Math.max( dx, dy )

  // clear old taps on move
  if ( this.start.distance > 2 ) {
    this.clearTap()
  }

  // if user is not trying to scroll vertically
  if (!this.isScrolling) {

    // prevent native scrolling
    e.preventDefault()
    this.start.prevent()

    // increase resistance if first or last slide
    this.deltaX /= ( (!this.index && this.deltaX > 0 || this.index == this.length - 1 && this.deltaX < 0 ) ?
       ( abs(this.deltaX) / this.width + 1.8 )  : 1 )
    this.to = this.deltaX - this.index * this.width

    // track the valocity
    var touch = e.touches

    tracker.push({
      pageX: touch[0].pageX - this.start.pageX,
      time: +new Date() - this.start.time
    })

    tracker = tracker.slice(-5)
  }

  e.stopPropagation()
}

Finger.prototype.ontouchend = function(e) {

  if ( !this.touching )
    return

  this.touching = false

  // detect taps
  if ( this.start.distance < 2 && this.inner.contains( this.start.target ) ) {
    if ( !this.tap ) {
      if ( this.config.dbltap ) {
        this.tap = {
          time: +new Date(),
          pageX: this.start.pageX,
          pageY: this.start.pageY,
          timer: window.setTimeout(function() {
            this.trigger('tap', { target: this.start.target })
            this.tap = 0
          }.bind(this), 300)
        }
      } else {
        this.trigger('tap', { target: this.start.target })
      }
    } else {
      var tapDistance = Math.max(
        abs(this.tap.pageX - this.start.pageX),
        abs(this.tap.pageY - this.start.pageY)
      )
      if ( tapDistance < 100 )
        this.trigger('dbltap', { target: this.start.target })
      this.clearTap()
    }
  } else
    this.clearTap()

  // determine if slide attempt triggers next/prev slide
  var isValidSlide = +new Date() - this.start.time < 250 &&
        abs(this.deltaX) > 40 ||
        abs(this.deltaX) > this.width/2,

      isPastBounds = !this.index && this.deltaX > 0 ||
        this.index == this.length - 1 && this.deltaX < 0

  // if not scrolling vertically
  if ( !this.isScrolling ) {
    this.projection += ( isValidSlide && !isPastBounds ? 
      ((this.deltaX-this.offset) < 0 ? 1 : -1) : 0 )
    this.animateTo( this.projection )
  } else if ( this.offset )
    this.animateTo( this.index )
}

Finger.prototype.animateTo = function( index ) {
  index = this.validateIndex(index)
  this.to = -( index*this.width )
  this.index = this.projection = index
  this.loop()
},

Finger.prototype.jumpTo = function( index ) {
  index = this.validateIndex( index )
  if ( index !== this.index )
    this.trigger('complete', { index: index }, this)
  this.to = this.pos = -( index*this.width )
  this.index = this.projection = index
  this.loop()
},

Finger.prototype.loop = function() {

  var distance = this.to - this.pos

  // if distance is short or the user is touching, do a 1-1 animation
  if ( this.touching || abs(distance) <= 1 ) {
    this.pos = this.to
    if ( this.anim ) {
      this.index = this.projection = abs(Math.round(this.pos/this.width))
      this.trigger('complete', {index: this.index }, this)
    }
    this.anim = 0
  } else {

    if ( !this.anim ) {

      // save animation parameters
      // extract velocity first
      var velocity = 0.6
      var travel = this.width
      if ( tracker.length ) {
        var last = tracker[tracker.length-1]
        travel = (last.pageX - tracker[0].pageX)
        velocity = travel / (last.time - tracker[0].time)
        tracker = []
      }

      // detect bounce
      var isEdge = abs(this.start.pos) == abs(this.index*this.width)
      var bounce = !isEdge && abs(velocity) > 2.5 && abs(travel) / this.width > 0.35
      var duration = this.config.duration
      if ( !isEdge )
        duration *= Math.min(1.2, Math.max(0.6, abs(distance/768))) // factorize 768

      this.anim = { 
        position: this.pos, 
        distance: distance,
        time: +new Date(), 
        duration: duration,
        easing: bounce ? this.config.bounceEasing : this.config.easing
      }
    }
    // apply easing
    this.pos = this.anim.easing(null, +new Date() - this.anim.time, this.anim.position, this.anim.distance, this.anim.duration)
  }

  this.trigger('frame', {
    value: -this.pos/this.width,
    position: this.pos
  }, this)

  if ( this.touching || this.anim )
    RequestFrame(this.loop.bind(this))
}

module.exports = Finger
},{"ainojs-dimensions":3,"ainojs-events":4,"raf":5}],3:[function(require,module,exports){
var comp = window.getComputedStyle

var getValue = function(elem, what) {
  var low = what.toLowerCase()
  var val = Math.ceil( ("getBoundingClientRect" in elem) ?
    elem.getBoundingClientRect()[ low ] :
    elem[ 'offset'+what ]
  )

  if ( (typeof val == 'undefined' || isNaN(val)) && comp )
    val = comp(elem, null)[ low ].replace('px','')

  return parseInt(val, 10)
}

module.exports = function(elem) {
  return {
    width: getValue(elem, 'Width'),
    height: getValue(elem, 'Height')
  }
}
},{}],4:[function(require,module,exports){
var Events = function() {
  
  var handlers = []

  this.on = function( type, handler ) {
    handlers.push({
      type: type,
      handler: handler
    })
    return this
  }

  this.off = function( type, handler ) {
    var i = handlers.length
    var ev
    while ( i-- ) {
      ev = handlers[i]
      if ( ev === undefined || ( ev.type == type && ( !handler || handler == ev.handler ) ) )
        handlers.splice(i, 1)
    }
    return this
  }

  this.once = function( type, handler ) {
    var fn = function() {
      handler.call( this )
      this.off( type, fn )
    }.bind(this)
    return this.on( type, fn )
  }

  this.trigger = function( type, params, context ) {
    context = context || this
    var i = 0
    var len = handlers.length
    var ev
    var obj = { type: type }
    if ( typeof params == 'object' ) {
      for( var prop in params )
        obj[prop] = params[prop]
    }
    for ( ; i < len; i++ ) {
      ev = handlers[i]
      if ( ev && ev.type == type )
        ev.handler.call(context, obj)
    }
    return this
  }
  return this
}

module.exports = Events
},{}],5:[function(require,module,exports){
var now = require('performance-now')
  , global = typeof window === 'undefined' ? {} : window
  , vendors = ['moz', 'webkit']
  , suffix = 'AnimationFrame'
  , raf = global['request' + suffix]
  , caf = global['cancel' + suffix] || global['cancelRequest' + suffix]
  , isNative = true

for(var i = 0; i < vendors.length && !raf; i++) {
  raf = global[vendors[i] + 'Request' + suffix]
  caf = global[vendors[i] + 'Cancel' + suffix]
      || global[vendors[i] + 'CancelRequest' + suffix]
}

// Some versions of FF have rAF but not cAF
if(!raf || !caf) {
  isNative = false

  var last = 0
    , id = 0
    , queue = []
    , frameDuration = 1000 / 60

  raf = function(callback) {
    if(queue.length === 0) {
      var _now = now()
        , next = Math.max(0, frameDuration - (_now - last))
      last = next + _now
      setTimeout(function() {
        var cp = queue.slice(0)
        // Clear queue here to prevent
        // callbacks from appending listeners
        // to the current frame's queue
        queue.length = 0
        for(var i = 0; i < cp.length; i++) {
          if(!cp[i].cancelled) {
            try{
              cp[i].callback(last)
            } catch(e) {
              setTimeout(function() { throw e }, 0)
            }
          }
        }
      }, Math.round(next))
    }
    queue.push({
      handle: ++id,
      callback: callback,
      cancelled: false
    })
    return id
  }

  caf = function(handle) {
    for(var i = 0; i < queue.length; i++) {
      if(queue[i].handle === handle) {
        queue[i].cancelled = true
      }
    }
  }
}

module.exports = function(fn) {
  // Wrap in a new function to prevent
  // `cancel` potentially being assigned
  // to the native rAF function
  if(!isNative) {
    return raf.call(global, fn)
  }
  return raf.call(global, function() {
    try{
      fn.apply(this, arguments)
    } catch(e) {
      setTimeout(function() { throw e }, 0)
    }
  })
}
module.exports.cancel = function() {
  caf.apply(global, arguments)
}

},{"performance-now":6}],6:[function(require,module,exports){
(function (process){
// Generated by CoffeeScript 1.6.3
(function() {
  var getNanoSeconds, hrtime, loadTime;

  if ((typeof performance !== "undefined" && performance !== null) && performance.now) {
    module.exports = function() {
      return performance.now();
    };
  } else if ((typeof process !== "undefined" && process !== null) && process.hrtime) {
    module.exports = function() {
      return (getNanoSeconds() - loadTime) / 1e6;
    };
    hrtime = process.hrtime;
    getNanoSeconds = function() {
      var hr;
      hr = hrtime();
      return hr[0] * 1e9 + hr[1];
    };
    loadTime = getNanoSeconds();
  } else if (Date.now) {
    module.exports = function() {
      return Date.now() - loadTime;
    };
    loadTime = Date.now();
  } else {
    module.exports = function() {
      return new Date().getTime() - loadTime;
    };
    loadTime = new Date().getTime();
  }

}).call(this);

/*
//@ sourceMappingURL=performance-now.map
*/

}).call(this,require('_process'))
},{"_process":7}],7:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canMutationObserver = typeof window !== 'undefined'
    && window.MutationObserver;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    var queue = [];

    if (canMutationObserver) {
        var hiddenDiv = document.createElement("div");
        var observer = new MutationObserver(function () {
            var queueList = queue.slice();
            queue.length = 0;
            queueList.forEach(function (fn) {
                fn();
            });
        });

        observer.observe(hiddenDiv, { attributes: true });

        return function nextTick(fn) {
            if (!queue.length) {
                hiddenDiv.setAttribute('yes', 'no');
            }
            queue.push(fn);
        };
    }

    if (canPost) {
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],8:[function(require,module,exports){
module.exports = require('./lib/ReactWithAddons');

},{}],9:[function(require,module,exports){
/** @jsx React.DOM */
var React = require('react/addons');
var classSet = React.addons.classSet;

var klass = {
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

var outerWidth = function(el)  {
	var width = el.offsetWidth;
	var style = getComputedStyle(el);

	width += parseInt(style.marginLeft) + parseInt(style.marginRight);
	return width;
}	;

var test3d = function()  {
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
    document.body.insertBefore(el, null);

    for (var t in transforms) {
        if (el.style[t] !== undefined) {
            el.style[t] = "translate3d(1px,1px,1px)";
            has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
        }
    }

    document.body.removeChild(el);

    return (has3d !== undefined && has3d.length > 0 && has3d !== "none");
}

var has3d = test3d();

// helper lib to do the swipe work
var Finger = require('ainojs-finger');

module.exports = React.createClass({displayName: "exports",
	
	propsTypes: {
		items: React.PropTypes.array.isRequired
	},

	getDefaultProps:function () {
		return {
			selectedItem: 0,
			// Carousel is the default type
			type: 'carousel'
		}
	}, 

	getInitialState:function () {
		return {
			// index of the image to be shown.
			selectedItem: this.props.selectedItem,

			// Index of the thumb that will appear first.
			// If you are using type = slider, this has 
			// the same value of the selected item.
			firstItem: 0
		}
	}, 

	componentWillMount:function() {
        window.addEventListener("resize", this.updateDimensions);
    },

	componentWillUnmount:function() {
		window.removeEventListener("resize", this.updateDimensions);
        
        // unbinding swipe component
		if (this.isSlider) {
			this.finger.off('frame', this.onSwipeMove);
			this.finger.off('complete', this.onSwipeEnd);
			this.finger.destroy();
		}

    },

	componentWillReceiveProps:function (props, state) {
		if (props.selectedItem !== this.state.selectedItem) {
			var firstItem = props.selectedItem;
			
			if (props.selectedItem >= this.lastPosition) {
				firstItem =  this.lastPosition;
			} 

			if (!this.showArrows) {
				firstItem = 0;
			}

			this.setState({
				selectedItem: props.selectedItem,
				firstItem: firstItem
			});
		}
	},

	componentDidMount:function (nextProps) {
		// when the component is rendered we need to calculate 
		// the container size to adjust the responsive behaviour
		this.updateDimensions();

		// swipe is only applied to slider because the of the current lib
		// TODO: implement the swipe behaviour for the carousel too.
		if (this.isSlider) {
			var finger = new Finger(this.refs.itemsWrapper.getDOMNode());
			
			// this was breaking the tests, some weird behaviour of jest
			if ('on' in finger) {
				finger.on('frame', this.onSwipeMove);
				finger.on('complete', this.onSwipeEnd);
			}

			this.finger = finger;
		}
	}, 

	updateDimensions:function () {
		this.calculateSpace(this.props.items.length);
		
		// the component should be rerended after calculating space
		this.forceUpdate();
	},

	// Calculate positions for carousel
	calculateSpace:function (total) {
		total = total || this.props.items.length;
		this.isSlider = this.props.type === "slider";
		
		this.wrapperSize = this.refs.itemsWrapper.getDOMNode().clientWidth;
		this.itemSize = this.isSlider ? this.wrapperSize : outerWidth(this.refs.item0.getDOMNode());
		this.visibleItems = Math.floor(this.wrapperSize / this.itemSize);	
		
		this.lastElement = this.refs['item' + (total - 1)];//.getDOMNode();
		this.lastElementPosition = this.itemSize * total;
		
		// exposing variables to other methods on this component
		this.showArrows = this.visibleItems < total;
		
		// Index of the last visible element that can be the first of the carousel
		this.lastPosition = (total - this.visibleItems);
	}, 

	handleClickItem:function (index, item) {
		var handler = this.props.onSelectItem;

		if (typeof handler === 'function') {
			handler(index, item);
		}	

		if (index !== this.state.selectedItem) {
			this.setState({
				selectedItem: index
			});
		}
	}, 

	triggerOnChange:function (item) {
		var handler = this.props.onChange;

		if (typeof handler === 'function') {
			handler(item);
		}	
	}, 

	slideRight:function (){
		this.moveTo(this.state.firstItem - 1)
	},

	slideLeft:function (){
		this.moveTo(this.state.firstItem + 1)
	},

	onSwipeMove:function (e) {
		var elementStyle = this.refs.itemList.getDOMNode().style;

		// if 3d isn't available we will use left to move
		if (has3d) {
			[
				'WebkitTransform',
				'MozTransform',
				'MsTransform',
				'OTransform',
				'transform',
				'msTransform'
			].forEach(function(propertie)  {return elementStyle[propertie] = 'translate3d(' + e.position + 'px, 0, 0)';});
		} else {
			elementStyle.left = e.position + 'px';
		}
	},

	onSwipeEnd:function (e) {
		this.moveTo(e.index);
	},

	moveTo:function (position) {
		// position can't be lower than 0
		position = position < 0 ? 0 : position;

		// position can't be higher than last postion
		position = position >= this.lastPosition ? this.lastPosition : position;
		
		this.setState({
			firstItem: position,
			// if it's not a slider, we don't need to set position here
			selectedItem: this.isSlider ? position : this.state.selectedItem
		});
		this.triggerOnChange(position);
	},


	getTotalWidth:function () {
		if (this.isMounted()) {
			return this.lastElementPosition + outerWidth(this.lastElement.getDOMNode());
		} else {
			return 'auto';
		}
	},

	getNextPosition:function () {
		if (this.isMounted()) {
			var nextPosition = this.refs['item' + this.state.firstItem].getDOMNode().offsetLeft;
			return - nextPosition;	
		} else {
			return 0;
		}
	},

	changeItem:function (e) {
		var newIndex = e.target.value;
		this.setState({
			selectedItem: newIndex,
			firstItem: newIndex
		})
	},

	renderItems:function () {
		var isSlider = (this.props.type === "slider");

		return this.props.items.map(function(item, index)  {
			var itemClass = klass.ITEM(isSlider, index, this.state.selectedItem);
			var imageSchema = {};
			
			return (
				React.createElement("li", {key: index, ref: "item" + index, className: itemClass, 
					style: {width: this.isSlider && this.itemSize}, 
					onClick:  this.handleClickItem.bind(this, index, item) }, 
					React.createElement("img", {src: item.url})
				)
			);
		}.bind(this));
					
	},

	renderControls:function () {
		if (!this.props.showControls) {
			return null
		}
		
		return (
			React.createElement("ul", {className: "control-dots"}, 
				this.props.items.map( function(item, index)  {
					return React.createElement("li", {className: klass.DOT(index === this.state.selectedItem), onClick: this.changeItem, value: index});
				}.bind(this))
			)
		);
	},

	renderStatus:function () {
		if (!this.props.showStatus) {
			return null
		}
		return React.createElement("p", {className: "carousel-status"}, this.state.selectedItem, " of ", this.props.items.length);
	}, 

	render:function () {
		if (this.props.items.length === 0) {
			return null;
		}
		
		var total = this.props.items.length;
		var showArrows = this.visibleItems < total;
		var isSlider = (this.props.type === "slider");

		var hasPrev = showArrows && this.state.firstItem > 0;
		var hasNext = showArrows && this.state.firstItem < this.lastPosition;
		
				
		var itemListStyles = {};
		// if 3d isn't available we will use left to move
		if (has3d) {
			var transformProp = 'translate3d(' + this.getNextPosition() + 'px, 0, 0)';
			itemListStyles = {
				'WebkitTransform': transformProp,
				   'MozTransform': transformProp,
				    'MsTransform': transformProp,
				     'OTransform': transformProp,
				      'transform': transformProp,
				    'msTransform': transformProp
			}
		} else {
			itemListStyles = {
				left: this.getNextPosition()
			}
		}

		itemListStyles.width = this.itemSize * total;
		
		var itemListProps = {
			className: klass.SLIDER(isSlider),
			style: itemListStyles
		}
	
		return (
			React.createElement("div", {className: klass.CAROUSEL(isSlider)}, 
				React.createElement("button", {className: klass.ARROW_LEFT(!hasPrev), onClick: this.slideRight}), 
				
				React.createElement("div", {className: klass.WRAPPER(isSlider), ref: "itemsWrapper"}, 
					React.createElement("ul", React.__spread({},  itemListProps, {ref: "itemList"}), 
						 this.renderItems() 
					)
				), 

				React.createElement("button", {className: klass.ARROW_RIGHT(!hasNext), onClick: this.slideLeft}), 
				
				 this.renderControls(), 
				 this.renderStatus() 
			)
		);
		
	}
});


},{"ainojs-finger":2,"react/addons":8}]},{},[1]);
