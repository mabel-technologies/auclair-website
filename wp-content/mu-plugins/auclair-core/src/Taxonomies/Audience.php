<?php
/**
 * Audience taxonomy.
 *
 * @package AuclairCore
 */

namespace AuclairCore\Taxonomies;

use TenupFramework\Taxonomies\AbstractTaxonomy;

/**
 * `audience` — on `kb_article`. Scopes an article to a plan or role without
 * duplicating categories.
 */
class Audience extends AbstractTaxonomy {

	const NAME = 'audience';

	/**
	 * Default terms created on first registration.
	 *
	 * @var string[]
	 */
	const DEFAULT_TERMS = [ 'Listener', 'Creator', 'Artist', 'Free (Radio)', 'Premium' ];

	/**
	 * Get the taxonomy name.
	 *
	 * @return string
	 */
	public function get_name() {
		return self::NAME;
	}

	/**
	 * Get the singular taxonomy label.
	 *
	 * @return string
	 */
	public function get_singular_label() {
		return esc_html__( 'Audience', 'auclair' );
	}

	/**
	 * Get the plural taxonomy label.
	 *
	 * @return string
	 */
	public function get_plural_label() {
		return esc_html__( 'Audiences', 'auclair' );
	}

	/**
	 * Get the options for the taxonomy.
	 *
	 * @return array
	 */
	public function get_options() {
		$options = parent::get_options();

		$options['rewrite'] = false;

		return $options;
	}

	/**
	 * Can the class be registered?
	 *
	 * @return bool
	 */
	public function can_register() {
		return true;
	}

	/**
	 * Seed default audience terms, once.
	 *
	 * @return void
	 */
	public function after_register() {
		if ( get_option( 'auclair_seeded_' . self::NAME ) ) {
			return;
		}

		foreach ( self::DEFAULT_TERMS as $term ) {
			if ( ! term_exists( $term, self::NAME ) ) {
				wp_insert_term( $term, self::NAME );
			}
		}

		update_option( 'auclair_seeded_' . self::NAME, true, false );
	}
}
