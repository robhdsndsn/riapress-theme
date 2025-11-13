wp.domReady(() => {
    wp.blocks.registerBlockStyle('core/heading', {
        name: 'collapsible',
        label: 'Collapsible'
    });

    wp.blocks.registerBlockStyle('core/heading', {
        name: 'screen-reader-text',
        label: 'Screen Reader Text'
    });
});
