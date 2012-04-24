/**
 * Trendy button
 * A button class for desktop and touch devices
 * requires Modernizr v2.5+
**/

;( function( window, document, Modernizr, undefined ) {

// convienent vars



function TrendyButton( elem, options ) {
  this.element = elem;
  
  if ( Modernizr.touch ) {
    this.element.addEventListener( 'mousedown', this.onMousedown.bind( this ), false );
  } else {
    this.element.addEventListener( 'touchstart', this.onTouchstart.bind( this ), false );
  }
  
}

TrendyButton.prototype.onMousedown = function( event ) {
  console.log( event.type );
};

TrendyButton.prototype.onTouchstart = function( event ) {
  console.log( event.type );
};

})( window, window.document, window.Modernizr );
