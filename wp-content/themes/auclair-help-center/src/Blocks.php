<?php
/**
 * Gutenberg Blocks setup
 *
 * @package AuclairHelpCenter
 */

namespace AuclairHelpCenter;

use TenupFramework\Assets\GetAssetInfo;
use TenupFramework\Module;
use TenupFramework\ModuleInterface;

/**
 * Blocks module.
 *
 * @package AuclairHelpCenter
 */
class Blocks implements ModuleInterface {

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
			dist_path: AU_CLAIR_HELP_CENTER_THEME_DIST_PATH,
			fallback_version: AU_CLAIR_HELP_CENTER_THEME_VERSION
		);
		add_action( 'init', [ $this, 'register_theme_blocks' ], 10, 0 );
		add_action( 'init', [ $this, 'enqueue_theme_block_styles' ], 10, 0 );
		add_filter( 'block_categories_all', [ $this, 'register_block_category' ] );

		// Prevents third-party blocks from being suggested in the block inserter.
		remove_action( 'enqueue_block_editor_assets', 'wp_enqueue_editor_block_directory_assets' );
	}


	/**
	 * Automatically registers all blocks that are located within the includes/blocks directory
	 *
	 * @return void
	 */
	public function register_theme_blocks() {
		// Register all the blocks in the theme.
		if ( file_exists( AU_CLAIR_HELP_CENTER_THEME_BLOCK_DIST_DIR ) ) {
			$block_json_files = glob( AU_CLAIR_HELP_CENTER_THEME_BLOCK_DIST_DIR . '*/block.json' );
			$block_names      = [];

			if ( empty( $block_json_files ) ) {
				return;
			}

			foreach ( $block_json_files as $filename ) {
				$block_folder = dirname( $filename );
				$block        = register_block_type_from_metadata( $block_folder );

				if ( ! $block ) {
					continue;
				}

				$block_names[] = $block->name;
			}

			add_filter(
				'allowed_block_types_all',
				function ( array|bool $allowed_blocks ) use ( $block_names ): array|bool {
					if ( ! is_array( $allowed_blocks ) ) {
						return $allowed_blocks;
					}
					return array_merge( $allowed_blocks, $block_names );
				}
			);
		}
	}

	/**
	 * Register the "AuClair" block category.
	 *
	 * @param array<int, array<string, string>> $categories Existing block categories.
	 *
	 * @return array<int, array<string, string>>
	 */
	public function register_block_category( $categories ) {
		return array_merge(
			[
				[
					'slug'  => 'auclair',
					'title' => __( 'AuClair', 'auclair' ),
				],
			],
			$categories
		);
	}

	/**
	 * Enqueue block specific styles.
	 *
	 * @return void
	 */
	public function enqueue_theme_block_styles() {
		$stylesheets = glob( AU_CLAIR_HELP_CENTER_THEME_DIST_PATH . '/blocks/autoenqueue/**/*.css' );

		if ( empty( $stylesheets ) ) {
			return;
		}

		foreach ( $stylesheets as $stylesheet_path ) {
			$block_type = str_replace( AU_CLAIR_HELP_CENTER_THEME_DIST_PATH . '/blocks/autoenqueue/', '', $stylesheet_path );
			$block_type = str_replace( '.css', '', $block_type );

			wp_register_style(
				"auclair-help-center-{$block_type}",
				AU_CLAIR_HELP_CENTER_THEME_DIST_URL . 'blocks/autoenqueue/' . $block_type . '.css',
				$this->get_asset_info( 'blocks/autoenqueue/' . $block_type, 'dependencies' ),
				$this->get_asset_info( 'blocks/autoenqueue/' . $block_type, 'version' ),
			);

			wp_enqueue_block_style(
				$block_type,
				[
					'handle' => "auclair-help-center-{$block_type}",
					'path'   => $stylesheet_path,
				]
			);

			if ( file_exists( AU_CLAIR_HELP_CENTER_THEME_DIST_PATH . 'blocks/autoenqueue/' . $block_type . '.js' ) ) {
				wp_enqueue_script(
					$block_type,
					AU_CLAIR_HELP_CENTER_THEME_DIST_URL . 'blocks/autoenqueue/' . $block_type . '.js',
					$this->get_asset_info( 'blocks/autoenqueue/' . $block_type, 'dependencies' ),
					$this->get_asset_info( 'blocks/autoenqueue/' . $block_type, 'version' ),
					true
				);
			}
		}
	}
}
