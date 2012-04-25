/**
 * Trendy button
 * A button class for desktop and touch devices
 * requires Modernizr v2.5+
**/

;( function( window, document, Modernizr, undefined ) {

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
  elem.className += ' trendy-button';

  // get options
  this.options = {};
  for ( var prop in options ) {
    this.options[ prop ] = options[ prop ];
  }

  // add event listeners
  if ( Modernizr.touch ) {
    this.element.addEventListener( 'touchstart', this, false );
  } else {
    this.element.addEventListener( 'mousedown', this, false );
  }
  
}

// ----- methods ----- //

// i.e. trigger mouseupHandler after mouseup event
TrendyButton.prototype.handleEvent = function( event ) {
  var handlerMethod = event.type + 'Handler';
  if ( this[ handlerMethod ] ) {
    this[ handlerMethod ]( event );
  }
}

TrendyButton.prototype.setIsActive = function( isActive ) {
  this.isActive = isActive;
  // add/remove is-active class
  if ( isActive ) {
    addClass( this.element, 'is-active' );
  } else {
    removeClass( this.element, 'is-active' );
  }
}


// ----- mouse events ----- //

TrendyButton.prototype.mousedownHandler = function( event ) {
  this.setIsActive( true );
  window.addEventListener( 'mouseup', this, false );
  event.preventDefault();
};

TrendyButton.prototype.mouseupHandler = function( event ) {
  console.log('on mouse up');
  if ( event.target === this.element ) {
    this.tap();
  }
  this.setIsActive( false );
  window.removeEventListener( 'mouseup', this, false );
};

// ----- touch events ----- //

TrendyButton.prototype.touchstartHandler = function( event ) {
  // bail out if there's already a touch involved
  // if ( this.touchIdentifier ) { return; }
  // set first changed touch as the touch for this button
  // this.touchIdentifier = event.changedTouches[0].identifier;
  this.setIsActive( true );
  window.addEventListener( 'touchend', this, false );
  // window.addEventListener( 'touchmove', this, false );
  // window.addEventListener( 'touchcancel', this, false );
  event.preventDefault();
};

TrendyButton.prototype.touchendHandler = function( event ) {

  if ( event.target === this.element ) {
    this.tap();
  }
  this.setIsActive( false );
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
