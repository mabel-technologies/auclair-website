<?php
/**
 * Assets module.
 *
 * @package AuclairCore
 */

namespace AuclairCore;

use TenupFramework\Assets\GetAssetInfo;
use TenupFramework\Module;
use TenupFramework\ModuleInterface;

/**
 * Assets module.
 *
 * @package AuclairCore
 */
class Assets implements ModuleInterface {

	use Module;
	use GetAssetInfo;

	/**
	 * Can this module be registered?
	 *
	 * @return bool
	 */
	public function can_register() {
		return true;
	}

	/**
	 * Register any hooks and filters.
	 *
	 * @return void
	 */
	public function register() {
		$this->setup_asset_vars(
			dist_path: AU_CLAIR_HELP_CENTER_PLUGIN_PATH . 'dist/',
			fallback_version: AU_CLAIR_HELP_CENTER_PLUGIN_VERSION
		);

		add_action( 'admin_enqueue_scripts', [ $this, 'admin_scripts' ] );
		add_action( 'admin_enqueue_scripts', [ $this, 'admin_styles' ] );
	}

	/**
	 * Enqueue scripts for admin.
	 *
	 * @return void
	 */
	public function admin_scripts() {
		wp_enqueue_script(
			'au_clair_help_center_plugin_admin',
			AU_CLAIR_HELP_CENTER_PLUGIN_URL . 'dist/js/admin.js',
			$this->get_asset_info( 'admin', 'dependencies' ),
			$this->get_asset_info( 'admin', 'version' ),
			true
		);
	}

	/**
	 * Enqueue styles for admin.
	 *
	 * @return void
	 */
	public function admin_styles() {
		wp_enqueue_style(
			'au_clair_help_center_plugin_admin',
			AU_CLAIR_HELP_CENTER_PLUGIN_URL . 'dist/css/admin.css',
			[],
			$this->get_asset_info( 'admin', 'version' ),
		);
	}
}
