
/*jshint asi: false, curly: true, devel: true, eqeqeq: true, forin: false, newcap: true, noempty: true, strict: true, undef: true, browser: true */
/*global jQuery: false */


( function( window, $, undefined ) {

'use strict';


// ========================= config ===============================
  
var presoItems, 
    itemIndex = -1,
    previousItemIndex;


function switchItemIndex( delta ) {
  itemIndex += delta;
  itemIndex = Math.max( -1, Math.min( presoItems.length - 1, itemIndex ) );
  // don't proceed if not a new index
  if ( itemIndex === previousItemIndex ) {
    return;
  }
    
  var $currentItem =  $( presoItems[ itemIndex ] ),
      $previousItem = $( presoItems[ previousItemIndex ] );
    
  if ( delta === 1 ) {
    // next
    $currentItem.removeClass('hidden');
  } else {
    // previous
    $previousItem.addClass('hidden');
  }

  $previousItem.removeClass('current');
  $currentItem.addClass('current');

  previousItemIndex = itemIndex;
}
  
function handleKeyup( event ) {
  if ( event.keyCode === 37 ) {
    // left / previous
    switchItemIndex( -1 );
  } else if ( event.keyCode === 39 ) {
    // right / next
    switchItemIndex( +1 );
  }
}
  
// ========================= init ===============================
  
function init() {
    
  presoItems = $('#content')[0].querySelectorAll('h2, h3, li, body > p, pre, blockquote');
    
  for (var i=0, len = presoItems.length; i < len; i++) {
    var item = presoItems[i];
    presoItems[i].className = 'preso-item hidden';
  }
    
  var isPresoEnabled = false;
  var $html = $('html');


  $('#is-presenting-toggler').change( 'click', function( ) {
    console.log( event.target.value );
    isPresoEnabled = !isPresoEnabled;
    var swap = isPresoEnabled ? 'add' : 'remove';
    
    $html[ swap + 'Class' ]('preso-enabled');
    document[ swap + 'EventListener' ]( 'keyup', handleKeyup, false );
  }, false );
    
}
  
window.addEventListener( 'load', init, false);


})( window, jQuery );
