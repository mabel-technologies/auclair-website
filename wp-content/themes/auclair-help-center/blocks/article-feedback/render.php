<?php
/**
 * Article Feedback block render.
 *
 * @package AuclairHelpCenter
 *
 * @var array $attributes Block attributes.
 */

use AuclairCore\PostTypes\KbArticle;
use function AuclairHelpCenter\get_thumb_icon_svg;

$post_id = ! empty( $attributes['postId'] ) ? (int) $attributes['postId'] : 0;

if ( ! $post_id && is_singular( KbArticle::NAME ) ) {
	$post_id = get_the_ID();
}

if ( ! $post_id ) {
	return;
}

$up_label    = ! empty( $attributes['upLabel'] ) ? $attributes['upLabel'] : __( 'Yes, thanks', 'auclair' );
$down_label  = ! empty( $attributes['downLabel'] ) ? $attributes['downLabel'] : __( 'Not really', 'auclair' );
$thanks_up   = ! empty( $attributes['thanksUp'] ) ? $attributes['thanksUp'] : __( 'Thanks — glad it helped.', 'auclair' );
$thanks_down = ! empty( $attributes['thanksDown'] ) ? $attributes['thanksDown'] : __( 'Thanks for letting us know — we’ll work on it.', 'auclair' );

// Cookie key mirrors AuclairCore\Rest\VoteEndpoint::remember_vote() — read here
// so a returning visitor sees the already-voted state on first paint, not just
// after a client-side round trip.
$cookie_key   = 'auclair_voted_' . $post_id;
$already_vote = isset( $_COOKIE[ $cookie_key ] ) ? sanitize_key( wp_unslash( $_COOKIE[ $cookie_key ] ) ) : ''; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.MissingUnslash -- unslashed above.
$already_vote = in_array( $already_vote, [ 'up', 'down' ], true ) ? $already_vote : '';

$context = [
	'postId'        => $post_id,
	'nonce'         => wp_create_nonce( 'wp_rest' ),
	'endpoint'      => esc_url_raw( rest_url( 'auclair/v1/vote' ) ),
	'voted'         => (bool) $already_vote,
	'submitting'    => false,
	'error'         => '',
	'thanksUp'      => $thanks_up,
	'thanksDown'    => $thanks_down,
	// Transient — the thanks message only appears right after a vote is cast
	// in this visit (auto-hides itself a few seconds later, see view.ts) and
	// does not reappear on a later page load just because `voted` is still
	// true from a remembered cookie.
	'showThanks'    => false,
	'thanksMessage' => '',
];

$wrapper_attributes = get_block_wrapper_attributes( [ 'class' => 'auclair-article-feedback' ] );
?>
<div
	<?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- pre-escaped. ?>
	data-wp-interactive="auclair"
	data-wp-context="<?php echo esc_attr( wp_json_encode( $context ) ); ?>"
>
	<p class="auclair-article-feedback__question"><?php esc_html_e( 'Was this article helpful?', 'auclair' ); ?></p>
	<div class="auclair-article-feedback__response">
		<div class="auclair-article-feedback__buttons">
			<button
				type="button"
				class="auclair-article-feedback__button"
				data-wp-on--click="actions.castVote"
				data-wp-bind--disabled="context.voted"
				data-vote-value="up"
			>
				<?php echo get_thumb_icon_svg( 'up' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- trusted, static icon markup. ?>
				<span><?php echo esc_html( $up_label ); ?></span>
			</button>
			<button
				type="button"
				class="auclair-article-feedback__button"
				data-wp-on--click="actions.castVote"
				data-wp-bind--disabled="context.voted"
				data-vote-value="down"
			>
				<?php echo get_thumb_icon_svg( 'down' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- trusted, static icon markup. ?>
				<span><?php echo esc_html( $down_label ); ?></span>
			</button>
		</div>
		<p
			class="auclair-article-feedback__thanks"
			data-wp-bind--hidden="!context.showThanks"
			data-wp-text="context.thanksMessage"
			hidden
		></p>
		<p class="auclair-article-feedback__error" data-wp-bind--hidden="!context.error" data-wp-text="context.error" hidden></p>
	</div>
</div>
