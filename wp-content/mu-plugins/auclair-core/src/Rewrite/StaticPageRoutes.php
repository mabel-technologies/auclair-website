<?php
/**
 * Top-priority rewrite rules for static `page`s nested one level under
 * `/help/`, which would otherwise be swallowed by the `help_category`
 * taxonomy's `help/%slug%` catch-all (taxonomy/post-type permastructs are
 * matched before WordPress's generic page fallback rule).
 *
 * @package AuclairCore
 */

namespace AuclairCore\Rewrite;

use TenupFramework\Module;
use TenupFramework\ModuleInterface;

/**
 * Registers explicit `help/{slug}` -> page rewrite rules, one per slug in
 * self::SLUGS, ahead of the `help_category` archive rule.
 */
class StaticPageRoutes implements ModuleInterface {

	use Module;

	/**
	 * Page slugs living directly under `/help/` that must win over the
	 * `help_category` term-archive catch-all.
	 *
	 * @var string[]
	 */
	const SLUGS = [ 'raise-a-ticket', 'ticket-submitted' ];

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
		add_action( 'init', [ $this, 'add_rules' ], 20 );
	}

	/**
	 * Add the top-priority rewrite rules.
	 *
	 * @return void
	 */
	public function add_rules() {
		foreach ( self::SLUGS as $slug ) {
			add_rewrite_rule(
				'^help/' . preg_quote( $slug, '/' ) . '/?$',
				'index.php?pagename=help/' . $slug,
				'top'
			);
		}
	}
}
