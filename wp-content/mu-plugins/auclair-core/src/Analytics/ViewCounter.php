<?php
/**
 * Article view counting.
 *
 * @package AuclairCore
 */

namespace AuclairCore\Analytics;

use TenupFramework\Module;
use TenupFramework\ModuleInterface;
use AuclairCore\PostTypes\KbArticle;

/**
 * Increments `view_count` when a single article is viewed.
 *
 * The meta was registered and read (admin column, Top queries, Top searches
 * chips) but nothing ever wrote it, so every "most viewed" query came back
 * empty. One counter here feeds all of them.
 */
class ViewCounter implements ModuleInterface {

	use Module;

	/**
	 * How long a visitor's view of one article is not counted again.
	 */
	const THROTTLE_SECONDS = HOUR_IN_SECONDS;

	/**
	 * Can the class be registered?
	 *
	 * @return bool
	 */
	public function can_register() {
		return ! is_admin();
	}

	/**
	 * Register hooks.
	 *
	 * @return void
	 */
	public function register() {
		add_action( 'template_redirect', [ $this, 'maybe_count_view' ] );
	}

	/**
	 * Count the current request as a view, when it is a real reader loading a
	 * single published article.
	 *
	 * @return void
	 */
	public function maybe_count_view() {
		if ( ! is_singular( KbArticle::NAME ) || is_preview() || is_feed() || wp_is_json_request() ) {
			return;
		}

		$post_id = get_queried_object_id();

		if ( ! $post_id || $this->is_throttled( $post_id ) ) {
			return;
		}

		$count = (int) get_post_meta( $post_id, 'view_count', true );
		update_post_meta( $post_id, 'view_count', $count + 1 );

		$this->throttle( $post_id );
	}

	/**
	 * Has this visitor already been counted for this article recently?
	 *
	 * Keyed on IP + user agent rather than a cookie so the count survives a
	 * page cache that strips Set-Cookie.
	 *
	 * @param int $post_id The article.
	 *
	 * @return bool
	 */
	protected function is_throttled( $post_id ) {
		return (bool) get_transient( $this->throttle_key( $post_id ) );
	}

	/**
	 * Remember this visitor's view so it is not counted again for a while.
	 *
	 * @param int $post_id The article.
	 *
	 * @return void
	 */
	protected function throttle( $post_id ) {
		set_transient( $this->throttle_key( $post_id ), 1, self::THROTTLE_SECONDS );
	}

	/**
	 * Transient key identifying this visitor's view of one article.
	 *
	 * @param int $post_id The article.
	 *
	 * @return string
	 */
	protected function throttle_key( $post_id ) {
		$ip    = isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : '';
		$agent = isset( $_SERVER['HTTP_USER_AGENT'] ) ? sanitize_text_field( wp_unslash( $_SERVER['HTTP_USER_AGENT'] ) ) : '';

		return 'auclair_view_' . md5( $post_id . '|' . $ip . '|' . $agent );
	}
}
