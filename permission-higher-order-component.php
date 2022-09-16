<?php
/**
 * Plugin Name:       Permission Higher Order Component
 * Description:       Proof of Concept Higher Order Component that adds a disable editing checkbox to all blocks that will prevent certain user roles from editing the block when checked.
 * Requires at least: 5.9
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            Matt Watson
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       permission-higher-order-component
 *
 * @package           permission-higher-order-component
 */

const PLUGIN_PREFIX = 'permission_hoc';
const PLUGIN_SLUG   = 'permission-higher-order-component';
const ROOT_DIR      = __DIR__;
const ROOT_FILE     = __FILE__;

/**
 * Enqueue Block Editor Assets.
 *
 * @throws \Error Throws an error if the assets are not compiled.
 *
 * @return void
 */
function permission_hoc_permission_hoc_enqueue_block_editor_assets() : void {

	$block_editor_asset_path = ROOT_DIR . '/build/index.asset.php';

	if ( ! file_exists( $block_editor_asset_path ) ) {
		throw new \Error(
			esc_html__( 'You need to run `npm start` or `npm run build` in the root of the plugin "permission-higher-order-component" first.', 'permission-higher-order-component' )
		);
	}

	$block_editor_scripts = '/build/index.js';
	$script_asset         = include $block_editor_asset_path;

	/**
	 * Settings.
	 *
	 * Settings have a filter so other parts of the plugin can append settings.
	 */
	$block_settings = apply_filters( PLUGIN_PREFIX . '_block_settings', permission_hoc_permission_hoc_get_block_settings() );

	wp_enqueue_script(
		PLUGIN_SLUG . '-block-editor',
		plugins_url( $block_editor_scripts, ROOT_FILE ),
		$script_asset['dependencies'],
		$script_asset['version'],
		false
	);

	wp_localize_script(
		PLUGIN_SLUG . '-block-editor',
		'permissionBlockSettings',
		$block_settings
	);

	wp_set_script_translations(
		PLUGIN_SLUG . '-block-editor',
		'permission-higher-order-component',
		ROOT_DIR . '\languages'
	);
}
add_action( 'admin_enqueue_scripts', __NAMESPACE__ . '\\permission_hoc_permission_hoc_enqueue_block_editor_assets', 10 );

/**
 * Get Block Settings.
 *
 * Settings for the block.
 */
function permission_hoc_permission_hoc_get_block_settings() : array {
	$user = wp_get_current_user();
	// Currently gets user roles, we might want permissions instead?
	return [
		'currentUserRoles' => (array) $user->roles,
	];
}

/**
 * Disable Code Editor.
 *
 * Disable the Code Editor.
 *
 * @param array $settings Settings.
 *
 * @return array
 */
function permission_hoc_permission_hoc_disable_code_editor_for_users( $settings ) {
	/**
	 * This will globally remove the code editor view for everyone. We might want to do this
	 * based on role, or event only if a block on the page is locked down.
	 */
	$settings['codeEditingEnabled'] = 0;
	return $settings;
}
add_filter( 'block_editor_settings_all', 'permission_hoc_permission_hoc_disable_code_editor_for_users', 100 );
