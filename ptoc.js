mw.loader.using( 'jquery.throttle-debounce', function () {
	$( function () {
		var $window, $mwPanel, $floatTOC, scrollHandler,
			tocLimit, headingOffsets, headingThreshold,
			$toc = $( '#toc' );

		if ( !$toc.length ) {
			return;
		}

		$window = $( window );
		$mwPanel = $( '#mw-panel' );
		headingThreshold = $window.height() / 5.0;
		$floatTOC = $toc
			.clone()
			.removeAttr( 'id' )
			.addClass( 'floatTOC' )
			.appendTo( 'body' )
			.css( {
				visibility: 'hidden',
				opacity: 0
			} );

		// Show the ToC ul even if its hidden
		$floatTOC.find( 'ul' ).show();
		
		// Put !important to the checkbox
		$floatTOC.find( 'input.toctogglecheckbox' ).css("display", "none !important");

		// Hijack links so that we can scroll to the content
		$floatTOC.find( 'a' ).click( function ( e ) {
			$( 'html, body' ).animate( {
				scrollTop: $( this.hash.replace( /\./g, '\\.' ) ).offset().top - headingThreshold
			} );
			return false;
		} );


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
				$floatTOC.css( {
					visibility: 'visible',
					opacity: 1
				} );
				$mwPanel.hide();

				// Highlight current
				var highlight = false;
				// Current section is above the first heading below the top of the screen
				$.each( headingOffsets, function ( i, v ) {
					// Skip first as there's no previous heading before the first
					if ( i !== 0 && ( scrollTop + headingThreshold ) < v[ 1 ] ) {
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
				$floatTOC.css( {
					visibility: 'hidden',
					opacity: 0
				} );
				$mwPanel.show();
			}
		}

		$window.on( 'scroll', $.throttle( 250, scrollHandler ) );
	} );
} );
