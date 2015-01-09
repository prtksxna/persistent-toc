mw.loader.using( 'jquery.throttle-debounce', function () {
	$( function () {
		var $window, $mwPanel, $floatTOC, scrollHandler,
			tocLimit, headingOffsets,
			$toc = $( '#toc' );

		if ( !$toc.length ) {
			return;
		}

		$window = $( window );
		$mwPanel = $( '#mw-panel' );
		$floatTOC = $toc
			.clone()
			.removeAttr( 'id' )
			.addClass( 'floatTOC' )
			.appendTo( 'body' )
			.hide();

		tocLimit = $toc.offset().top + $toc.height();
		headingOffsets = [];

		// Get all heading positions
		$('.mw-headline').each( function () {
			headingOffsets.push( [ $( this ).attr( 'id' ), $( this ).offset().top ] );
		} );

		// For the window scroll event
		scrollHandler = function () {
			var $current,
			scrollTop = $window.scrollTop();

			if ( scrollTop > tocLimit ) {
				$floatTOC.show();
				$mwPanel.hide();

				// Highlight current
				var highlight = false;
				// Current section is above the first heading below the top of the screen
				$.each( headingOffsets, function ( i, v ) {
					// Skip first as there's no previous heading before the first
					if ( i !== 0 && scrollTop < v[ 1 ] ) {
						highlight = headingOffsets[ i - 1 ][ 0 ];
						return false;
					}
				} );

				if ( highlight ) {
					$current = $floatTOC.find( 'a[href="#' + highlight + '"]' );
					$floatTOC.find( 'a' ).not( $current ).css( 'font-weight', '' );
					$current.css( 'font-weight', 'bold' );
				}

			} else {
				$floatTOC.hide();
				$mwPanel.show();
			}
		}

		$window.on( 'scroll', $.throttle( 250, scrollHandler ) );
	} );
} );
