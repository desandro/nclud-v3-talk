
/*jshint asi: false, curly: true, devel: true, eqeqeq: true, forin: false, newcap: true, noempty: true, strict: true, undef: true, browser: true */
/*global jQuery: false */


( function( window, $, undefined ) {

'use strict';


// ========================= config ===============================
  
var presoItems, 
    itemIndex = -1,
    previousItemIndex;

var isPresoEnabled = false;
var $body;
var $window = $(window);

function getH2Top( $h2 ) {
  return $h2.position().top + parseInt( $h2.css('margin-top'), 10 );
}

function switchItemIndex( delta ) {
  if ( !isPresoEnabled ) { return; }

  itemIndex += delta;
  itemIndex = Math.max( -1, Math.min( presoItems.length - 1, itemIndex ) );
  // don't proceed if not a new index
  if ( itemIndex === previousItemIndex ) {
    return;
  }

  var currentItem = presoItems[ itemIndex ];
  var $currentItem =  $( currentItem ),
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

  scrollToPresoItem( currentItem );


}

function scrollToPresoItem( item ) {

  if ( !item ) { return; }

  var $item = $( item );

  // scroll
  var isH2 = item.nodeName.toLowerCase() === 'h2';
  var scrollY;
  if ( isH2 ) {
    scrollY = getH2Top( $item );
  } else {
    // get nearest h2, iterating back through presoItems
    var elem;
    var elemI = itemIndex;
    while ( elemI > -1 ) {
      elemI--;
      elem = presoItems[ elemI ];
      if ( elem.nodeName.toLowerCase() === 'h2' ) {
        break;
      }
    }

    var prevH2Y = getH2Top( $( elem ) );
    var itemY = $item.position().top + ( $item.outerHeight( true ) - $window.height() ) / 2;

    scrollY = Math.max( prevH2Y, itemY );

  }


  $body.animate({
    scrollTop: scrollY
  }, {
    queue: false
  });

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

  $body = $('body');

  presoItems = $('#content')[0].querySelectorAll('h2, h3, li, p, pre, blockquote, iframe');
    
  for (var i=0, len = presoItems.length; i < len; i++) {
    var item = presoItems[i];
    presoItems[i].className = 'preso-item hidden';
  }
    

  var $html = $('html');


  $('#is-presenting-toggler').click( function() {
    // console.log( this.value );
    isPresoEnabled = !isPresoEnabled;
    var swap = isPresoEnabled ? 'add' : 'remove';
    
    $html[ swap + 'Class' ]('preso-enabled');
    document[ swap + 'EventListener' ]( 'keyup', handleKeyup, false );
  });

  $('#font-size-adjuster').on( 'change', function() {
    // console.log( this.value );
    $('#content').css({ fontSize: this.value + 'px' });
  });

}
  
window.addEventListener( 'load', init, false);


})( window, jQuery );
