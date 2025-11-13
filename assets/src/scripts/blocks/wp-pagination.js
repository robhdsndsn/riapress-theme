wp.domReady(() => {
    const { addFilter } = wp.hooks;
    const { Fragment, createElement } = wp.element;
    const { BlockControls } = wp.blockEditor;
    const { ToolbarGroup, ToolbarButton } = wp.components;
    const { __ } = wp.i18n;

    /**
     * Add Bold button to pagination block toolbar using CSS class approach
     */
    const addBoldToolbarToPagination = (BlockEdit) => {
        return (props) => {
            const { name, attributes, setAttributes, isSelected } = props;
            
            // Only add to pagination previous/next/numbers blocks when selected
            const isPaginationTextBlock = [
                'core/query-pagination-previous', 
                'core/query-pagination-next',
                'core/query-pagination-numbers'
            ].includes(name);

            if (!isPaginationTextBlock || !isSelected) {
                return createElement(BlockEdit, props);
            }

            // Check if bold class is applied
            const currentClassName = attributes.className || '';
            const isBold = currentClassName.includes('is-bold');

            /**
             * Toggle bold class
             */
            const toggleBold = () => {
                let newClassName;
                
                if (isBold) {
                    // Remove bold class
                    newClassName = currentClassName.replace(/\bis-bold\b/g, '').replace(/\s+/g, ' ').trim();
                } else {
                    // Add bold class
                    newClassName = currentClassName ? `${currentClassName} is-bold` : 'is-bold';
                }
                
                setAttributes({ className: newClassName });
            };

            return createElement(
                Fragment,
                {},
                // Add the toolbar controls
                createElement(
                    BlockControls,
                    { group: 'inline' },
                    createElement(
                        ToolbarGroup,
                        {},
                        createElement(
                            ToolbarButton,
                            {
                                icon: 'editor-bold',
                                title: __('Bold'),
                                onClick: toggleBold,
                                isActive: isBold,
                                shortcut: 'Ctrl+B'
                            }
                        )
                    )
                ),
                // Render the original block
                createElement(BlockEdit, props)
            );
        };
    };

    // Apply the filter to add toolbar controls
    addFilter(
        'editor.BlockEdit',
        'riapress/pagination-bold-toolbar',
        addBoldToolbarToPagination,
        20
    );
});