import { InspectorControls } from '@wordpress/block-editor';
import { createHigherOrderComponent } from '@wordpress/compose';
import { PanelBody, SelectControl } from '@wordpress/components';
import { Disabled } from '@wordpress/components';
import { __ } from '@wordpress/i18n'

export default createHigherOrderComponent( ( BlockEdit ) => {
    return ( props ) => {
        const { currentUserRoles } = window.permissionBlockSettings;
        const { attributes: { blockDisabledByRole }, setAttributes } = props;

        /**
         * We would likely want to make this a checkbox list of roles and/or permissions.
         */
        const inspectorControls = (
            <InspectorControls>
                <PanelBody
                    className=" permission-higher-order-component-settings"
                    title={ __( 'Settings', ' permission-higher-order-component' ) }
                >
                    { /* Not an extensive list of roles, but placed here as an example */ }
                    <SelectControl
                        help={ __( 'Choose a role that cannot edit this block.', ' permission-higher-order-component' ) }
                        label={ __( 'Role', ' permission-higher-order-component' ) }
                        options={ [
                            { label: __( 'Please Select...', ' permission-higher-order-component' ), value: '' },
                            { label: 'Administrator', value: 'administrator' },
                            { label: 'Editor', value: 'editor' },
                        ] }
                        value={ blockDisabledByRole }
                        onChange={ ( blockDisabledByRole ) => setAttributes( { blockDisabledByRole } ) }
                    />
                </PanelBody>
            </InspectorControls>
        );

        /**
         * Currently very simple disable by a single role, but this could be expanded further.
         */
        if ( blockDisabledByRole !== '' && currentUserRoles.includes( blockDisabledByRole ) ) {
            return (
                <Disabled>
                    <BlockEdit { ...props } />
                </Disabled>
            );
        }

        /**
         * This will show the inspector controls to everyone that is not locked down, we
         * would probably want to lock this ability down globally to certain users.
         */
        return (
            <>
                { inspectorControls }
                <BlockEdit { ...props } />
            </>
        );

    };
}, 'withIsBlockDisabledByRole' );