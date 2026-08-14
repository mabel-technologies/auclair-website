<?php
/**
 * Top-priority rewrite rules for the Help Center's static `page`s, which
 * would otherwise be swallowed by the `help_category` term archives (those
 * are registered as root-level `/{slug}/` rules, ahead of WordPress's
 * generic page fallback rule).
 *
 * @package AuclairCore
 */

namespace AuclairCore\Rewrite;

use TenupFramework\Module;
use TenupFramework\ModuleInterface;

/**
 * Registers explicit `/{slug}` -> page rewrite rules, one per slug in
 * self::SLUGS, ahead of the `help_category` archive rules.
 */
class StaticPageRoutes implements ModuleInterface {

	use Module;

	/**
	 * Page slugs living at the site root that must win over the
	 * `help_category` term-archive rules.
	 *
	 * @var string[]
	 */
	const SLUGS = [ 'raise-a-ticket', 'ticket-submitted', 'search' ];

	/**
	 * Can this module be registered?
	 *
	 * @return bool
	 */
	public function can_register() {
		return true;
	}

	/**
	 * Register hooks.
	 *
	 * @return void
	 */
	public function register() {
		// Priority 20 — ahead of HelpCategory::add_rules() at 25, so these
		// rules are inserted into `extra_rules_top` first and match first.
		add_action( 'init', [ $this, 'add_rules' ], 20 );
		add_action( 'wp_loaded', [ $this, 'maybe_flush' ] );
	}

	/**
	 * Add the top-priority rewrite rules.
	 *
	 * @return void
	 */
	public function add_rules() {
		foreach ( self::SLUGS as $slug ) {
			add_rewrite_rule(
				'^' . preg_quote( $slug, '/' ) . '/?$',
				'index.php?pagename=' . $slug,
				'top'
			);
		}
	}

	/**
	 * Flush rewrite rules once, on the request after something that changes
	 * the generated rule set (currently: editing `help_category` terms).
	 *
	 * @return void
	 */
	public function maybe_flush() {
		if ( ! get_option( 'auclair_flush_rewrite' ) ) {
			return;
		}

		delete_option( 'auclair_flush_rewrite' );
		flush_rewrite_rules( false );
	}
}
