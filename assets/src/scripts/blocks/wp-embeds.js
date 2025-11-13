wp.domReady( function () {
	var allowedEmbedBlocks = [ 'youtube', 'vimeo' ];

	var embedBlockVariations = wp.blocks.getBlockVariations( 'core/embed' );
	if ( embedBlockVariations ) {
		embedBlockVariations.forEach( function ( blockVariation ) {
			if ( allowedEmbedBlocks.indexOf( blockVariation.name ) === -1 ) {
				wp.blocks.unregisterBlockVariation(
					'core/embed',
					blockVariation.name
				);
			}
		} );
	}
} );
