import { select, subscribe, dispatch } from '@wordpress/data';
import domReady from '@wordpress/dom-ready';
import { addFilter } from '@wordpress/hooks';

import withIsBlockDisabledByRole from './components/withIsBlockDisabledByRole';

/**
 * Add additional `blockDisabledByRole` attribute to each block.
 */
addFilter(
    'blocks.registerBlockType',
    'permission-higher-order-component/block-disabled-by-role',
    ( settings ) => {
        const { attributes } = settings;
        return {
            ...settings,
            attributes: {
                ...attributes,
                blockDisabledByRole: {
                    default: '',
                    type: 'string',
                },
            },
        };
    }
);

/**
 * Add the Inspector Control and the Disabled component to each block.
 */
addFilter(
    'editor.BlockEdit',
    'permission-higher-order-component/block-disabled-by-role-inspector',
    withIsBlockDisabledByRole,
);

/**
 * Listen for when a block is selected, and disable various page elements based on
 * the selection.
 */
domReady( function () {
    const {
		getSelectedBlock
	} = select( 'core/block-editor' );

    const { getActiveGeneralSidebarName } = select( 'core/edit-post' );
    const { closeGeneralSidebar, openGeneralSidebar } = dispatch( 'core/edit-post' );
    const { currentUserRoles } = window.permissionBlockSettings;

    subscribe( () => {
		const selectedBlock = getSelectedBlock();
        const sideBar = getActiveGeneralSidebarName();
        let toolbar = document.querySelector('.block-editor-block-toolbar');
        const toolbarVisibility = toolbar?.style?.display;

        // Switch away from block toolbar if a disabled block is selected.
        if ( sideBar === 'edit-post/block' && selectedBlock && currentUserRoles.includes( selectedBlock.attributes?.blockDisabledByRole ) ) {
            closeGeneralSidebar( sideBar );
            openGeneralSidebar( 'edit-post/document' );
        }

        // Hide the block toolbar if a disabled block is selected.
        if ( toolbar && toolbarVisibility !== 'none' && selectedBlock && currentUserRoles.includes( selectedBlock.attributes?.blockDisabledByRole )  ) {
            toolbar.style.display = 'none';
        }
	} )
} );