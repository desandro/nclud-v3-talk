/**
 * Trendy button
 * A button class for desktop and touch devices
 * requires Modernizr v2.5+
**/

/*jshint asi: false, curly: true, devel: true, eqeqeq: true, forin: false, newcap: true, noempty: true, strict: true, undef: true, browser: true */

;( function( window, document, Modernizr, undefined ) {

'use strict';
// convienent vars

// -------------------------- DOM Utility -------------------------- //

// from bonzo.js, by Dustin Diaz - https://github.com/ded/bonzo

// use classList API if available
var supportClassList = 'classList' in document.createElement('div');

function classReg(c) {
  return new RegExp("(^|\\s+)" + c + "(\\s+|$)");
}

var hasClass = supportClassList ? function (el, c) {
  return el.classList.contains(c);
} : function (el, c) {
  return classReg(c).test(el.className);
};

var addClass = supportClassList ? function (el, c) {
  el.classList.add(c);
} : function (el, c) {
  if ( !hasClass(el, c) ) {
    el.className = el.className + ' ' + c;
  }
};

var removeClass = supportClassList ? function (el, c) {
  el.classList.remove(c);
} : function (el, c) {
  el.className = el.className.replace(classReg(c), ' ');
};


// -------------------------- TrendyButton -------------------------- //

function TrendyButton( elem, options ) {
  this.element = elem;
  // add class
  addClass( elem, 'trendy-button' );

  // get options
  this.options = {};
  // copy defaults to options
  for ( var prop in TrendyButton.defaults ) {
    this.options[ prop ] = TrendyButton.defaults[ prop ];
  }
  // overwrite defaults with options passed in
  for ( prop in options ) {
    this.options[ prop ] = options[ prop ];
  }

  // add event listeners
  if ( Modernizr.touch ) {
    this.element.addEventListener( 'touchstart', this, false );
  } else {
    this.element.addEventListener( 'mousedown', this, false );
  }
  
}

TrendyButton.defaults = {
  bufferX: 100,
  bufferY: 60
};

// ----- methods ----- //

// i.e. trigger mouseupHandler after mouseup event
TrendyButton.prototype.handleEvent = function( event ) {
  var handlerMethod = event.type + 'Handler';
  if ( this[ handlerMethod ] ) {
    this[ handlerMethod ]( event );
  }
};

TrendyButton.prototype.setIsActive = function( isActive ) {
  this.isActive = isActive;
  // add/remove is-active class
  if ( isActive ) {
    addClass( this.element, 'is-active' );
  } else {
    removeClass( this.element, 'is-active' );
  }
};


// ----- mouse events ----- //

TrendyButton.prototype.mousedownHandler = function( event ) {
  this.setIsActive( true );
  window.addEventListener( 'mouseup', this, false );
  event.preventDefault();
};

TrendyButton.prototype.mouseupHandler = function( event ) {
  if ( event.target === this.element ) {
    this.tap();
  }
  this.setIsActive( false );
  window.removeEventListener( 'mouseup', this, false );
};

// ----- touch events ----- //

TrendyButton.prototype.touchstartHandler = function( event ) {
  // bail out if there's already a touch involved
  if ( this.touch ) { return; }
  // set first changed touch as the touch for this button
  var firstTouch = event.changedTouches[0];
  this.touch = {};
  // copy over all props from firstTouch
  for ( var prop in firstTouch ) {
    this.touch[ prop ] = firstTouch[ prop ];
  }

  this.setIsActive( true );
  window.addEventListener( 'touchmove', this, false );
  window.addEventListener( 'touchend', this, false );
  // window.addEventListener( 'touchcancel', this, false );
  event.preventDefault();
};

// get the touch from an event that matches
TrendyButton.prototype.getMatchedTouch = function( event ) {
  var touch, matchedTouch;
  // iterate through touches
  for ( var i=0, len = event.changedTouches.length; i < len; i++ ) {
    touch = event.changedTouches[i];
    // get matched touch
    if ( touch.identifier === this.touch.identifier ) {
      matchedTouch = touch;
      break;
    }
  }
  return matchedTouch;
};


TrendyButton.prototype.touchmoveHandler = function( event ) {
  var matchedTouch = this.getMatchedTouch( event );
  // bail out if no matched touch
  if ( !matchedTouch ) { return; }

  var isInsideHorz = Math.abs( matchedTouch.pageX - this.touch.pageX ) < this.options.bufferX;
  var isInsideVert = Math.abs( matchedTouch.pageY - this.touch.pageY ) < this.options.bufferY;
  var isInside = isInsideHorz && isInsideVert;

  // toggle isActive if need be
  if ( this.isActive && !isInside ) {
    // if this was active, but touch move outside, set not active
    this.setIsActive( false );
  } else if ( !this.isActive && isInside ) {
    // if this was active, but touch move outside, set active
    this.setIsActive( true );
  }

};

TrendyButton.prototype.touchendHandler = function( event ) {
  var matchedTouch = this.getMatchedTouch( event );
  // bail out if no matched touch
  if ( !matchedTouch ) { return; }

  if ( this.isActive ) {
    this.tap();
  }
  this.setIsActive( false );
  // remove touch for button
  delete this.touch;
  window.removeEventListener( 'touchmove', this, false );
  window.removeEventListener( 'touchend', this, false );

};

// ----- success! ----- //

TrendyButton.prototype.tap = function() {
  console.log('button tapped!');
  // trigger onTap callback
  if ( typeof this.options.onTap === 'function' ) {
    this.options.onTap();
  }
};



// put in global namespace
window.TrendyButton = TrendyButton;

})( window, window.document, window.Modernizr );
