<?php
/**
 * Permanent redirects for the pre-migration `/help/...` URL space.
 *
 * The Help Center used to be a subsection of a larger site, so every route
 * carried a `/help/` prefix. On this site it *is* the whole site, and the
 * prefix has been dropped from the permastructs — this keeps the old URLs
 * (and anything still linking to them) working.
 *
 * @package AuclairCore
 */

namespace AuclairCore\Rewrite;

use TenupFramework\Module;
use TenupFramework\ModuleInterface;

/**
 * 301s `/help/{path}` to `/{path}`, and bare `/help/` to `/`.
 */
class LegacyHelpRedirect implements ModuleInterface {

	use Module;

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
		add_action( 'template_redirect', [ $this, 'maybe_redirect' ], 0 );
	}

	/**
	 * Redirect any request under the legacy `/help/` prefix to its
	 * root-level equivalent.
	 *
	 * @return void
	 */
	public function maybe_redirect() {
		$uri = isset( $_SERVER['REQUEST_URI'] )
			? esc_url_raw( wp_unslash( $_SERVER['REQUEST_URI'] ) )
			: '';

		if ( '' === $uri ) {
			return;
		}

		$path  = (string) wp_parse_url( $uri, PHP_URL_PATH );
		$query = (string) wp_parse_url( $uri, PHP_URL_QUERY );

		// Only the legacy prefix — `/helpful-tips/` must not match.
		if ( 'help' !== trim( $path, '/' ) && ! preg_match( '#^/help/#', $path ) ) {
			return;
		}

		$target = preg_replace( '#^/help(?=/|$)#', '', $path );
		$target = '' === $target ? '/' : $target;

		if ( '' !== $query ) {
			$target .= '?' . $query;
		}

		wp_safe_redirect( home_url( $target ), 301 );
		exit;
	}
}
