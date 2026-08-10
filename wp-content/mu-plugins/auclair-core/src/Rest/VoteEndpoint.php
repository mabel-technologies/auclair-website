<?php
/**
 * `auclair/v1/vote` REST endpoint — records helpful/not-helpful feedback
 * from the `auclair/article-feedback` block.
 *
 * @package AuclairCore
 */

namespace AuclairCore\Rest;

use TenupFramework\Module;
use TenupFramework\ModuleInterface;
use AuclairCore\PostTypes\KbArticle;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;

/**
 * Registers and handles `POST auclair/v1/vote`.
 */
class VoteEndpoint implements ModuleInterface {

	use Module;

	const COOKIE_PREFIX       = 'auclair_voted_';
	const IP_TRANSIENT_PREFIX = 'auclair_vote_ip_';
	const IP_TRANSIENT_TTL    = MONTH_IN_SECONDS;
	const COOKIE_TTL          = YEAR_IN_SECONDS;

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
		add_action( 'rest_api_init', [ $this, 'register_routes' ] );
	}

	/**
	 * Register the `auclair/v1/vote` route.
	 *
	 * @return void
	 */
	public function register_routes() {
		register_rest_route(
			'auclair/v1',
			'/vote',
			[
				'methods'             => 'POST',
				'callback'            => [ $this, 'handle_vote' ],
				'permission_callback' => '__return_true',
			]
		);
	}

	/**
	 * Handle a helpfulness vote.
	 *
	 * @param WP_REST_Request $request The incoming request.
	 *
	 * @return WP_REST_Response|WP_Error
	 */
	public function handle_vote( WP_REST_Request $request ) {
		$nonce = $request->get_header( 'X-WP-Nonce' );

		if ( ! $nonce || ! wp_verify_nonce( $nonce, 'wp_rest' ) ) {
			return new WP_Error( 'auclair_invalid_nonce', __( 'Your session has expired. Please refresh the page and try again.', 'auclair' ), [ 'status' => 403 ] );
		}

		$post_id = absint( $request->get_param( 'id' ) );
		$value   = sanitize_key( (string) $request->get_param( 'value' ) );

		if ( ! $post_id || KbArticle::NAME !== get_post_type( $post_id ) ) {
			return new WP_Error( 'auclair_invalid_article', __( 'That article could not be found.', 'auclair' ), [ 'status' => 404 ] );
		}

		if ( ! in_array( $value, [ 'up', 'down' ], true ) ) {
			return new WP_Error( 'auclair_invalid_vote', __( 'Invalid vote value.', 'auclair' ), [ 'status' => 400 ] );
		}

		if ( $this->has_already_voted( $post_id ) ) {
			return new WP_Error( 'auclair_already_voted', __( 'You have already voted on this article.', 'auclair' ), [ 'status' => 409 ] );
		}

		$meta_key = 'up' === $value ? 'vote_up' : 'vote_down';
		update_post_meta( $post_id, $meta_key, (int) get_post_meta( $post_id, $meta_key, true ) + 1 );

		$up    = (int) get_post_meta( $post_id, 'vote_up', true );
		$down  = (int) get_post_meta( $post_id, 'vote_down', true );
		$total = $up + $down;

		update_post_meta( $post_id, 'vote_score', $total > 0 ? round( ( $up / $total ) * 100, 1 ) : 0 );
		update_post_meta( $post_id, 'vote_last', current_time( 'mysql' ) );

		$this->remember_vote( $post_id, $value );

		return new WP_REST_Response( [ 'success' => true, 'value' => $value ], 200 );
	}

	/**
	 * Has this visitor already voted on this article, via cookie or IP transient?
	 *
	 * @param int $post_id The article post ID.
	 *
	 * @return bool
	 */
	protected function has_already_voted( $post_id ) {
		if ( ! empty( $_COOKIE[ self::COOKIE_PREFIX . $post_id ] ) ) {
			return true;
		}

		return (bool) get_transient( self::IP_TRANSIENT_PREFIX . $post_id . '_' . md5( $this->get_client_ip() ) );
	}

	/**
	 * Remember that this visitor voted, via both a per-article cookie and an
	 * IP-keyed transient (belt-and-braces against cookie clearing).
	 *
	 * @param int    $post_id The article post ID.
	 * @param string $value   'up' or 'down'.
	 *
	 * @return void
	 */
	protected function remember_vote( $post_id, $value ) {
		setcookie( self::COOKIE_PREFIX . $post_id, $value, time() + self::COOKIE_TTL, COOKIEPATH ? COOKIEPATH : '/', COOKIE_DOMAIN );
		set_transient( self::IP_TRANSIENT_PREFIX . $post_id . '_' . md5( $this->get_client_ip() ), $value, self::IP_TRANSIENT_TTL );
	}

	/**
	 * Get the submitter's IP address.
	 *
	 * @return string
	 */
	protected function get_client_ip() {
		return isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : '0.0.0.0'; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.MissingUnslash -- unslashed above.
	}
}
