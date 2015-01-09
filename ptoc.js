( function ( $ ) {

    $( function () {
	var $toc = $( '#toc' ),
	    $window = $( window ),
	    $mwPanel = $( '#mw-panel' ),
	    tocLimit = $toc.offset().top + $toc.height(),
	    $floatTOC = $toc
	    .clone()
	    .attr( 'id', '')
	    .addClass( 'floatTOC' )
	    .appendTo( 'body' )
	    .css( 'height', $window.height() )
	    .hide(),
	    headingsOffset = [];

	// Get all heading positions
	$('.mw-headline').each( function() {
	    headingsOffset.push( [ $(this).attr( 'id' ), $( this ).offset().top ] );
	} );

	// For the window scroll event
	var scroller = function () {
	    var scrollTop = $window.scrollTop();
	    if ( scrollTop > tocLimit ) {
		$floatTOC.show();
		$mwPanel.hide();

		// Highlight current
		$floatTOC.find( 'a' ).css( 'font-weight', 'normal' )
		var highlight = "";
		$.each( headingsOffset, function ( i, v ) {
		    if ( scrollTop < v[ 1 ]) {
			highlight = headingsOffset[ i -1 ][ 0 ];
			return false;
		    }
		} );
		$floatTOC.find( 'a[href="#' + highlight + '"]' ).css( 'font-weight', 'bold' );

	    } else {
		$floatTOC.hide();
		$mwPanel.show();
	    }
	}

	$window.on( 'scroll', $.throttle( 250, scroller ) );
    } );

} ) ( jQuery );
