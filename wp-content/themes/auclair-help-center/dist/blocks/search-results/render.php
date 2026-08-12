<?php
/**
 * Search Results block render.
 *
 * Renders the initial query (server-side, from the `?q=` URL param) so the
 * first paint — and any no-JS visitor — shows real results, not an empty
 * shell. From then on, `view.ts` takes over: every keystroke re-fetches from
 * the `wp/v2/kb_article` REST search and replaces the results panel in
 * place, debounced, with no page reload.
 *
 * @package AuclairHelpCenter
 *
 * @var array $attributes Block attributes.
 */

use AuclairCore\PostTypes\KbArticle;
use function AuclairHelpCenter\get_icon_svg;
use function AuclairHelpCenter\get_help_home_url;

$placeholder = ! empty( $attributes['placeholder'] ) ? $attributes['placeholder'] : __( 'Search queries or topics', 'auclair' );
$limit       = ! empty( $attributes['limit'] ) ? (int) $attributes['limit'] : 12;

$query = isset( $_GET['q'] ) ? sanitize_text_field( wp_unslash( $_GET['q'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- read-only search query, not a state-changing request.

$results = [];

if ( '' !== $query ) {
	$posts = get_posts(
		[
			'post_type'      => KbArticle::NAME,
			'posts_per_page' => $limit,
			's'              => $query,
		]
	);

	foreach ( $posts as $post ) {
		$results[] = [
			'title' => get_the_title( $post ),
			'url'   => get_permalink( $post ),
		];
	}
}

$context = [
	'query'    => $query,
	'endpoint' => esc_url_raw( rest_url( 'wp/v2/kb_article' ) ),
	'limit'    => $limit,
	'homeUrl'  => esc_url_raw( get_help_home_url() ),
];

$wrapper_attributes = get_block_wrapper_attributes( [ 'class' => 'auclair-search-results' ] );
?>
<div
	<?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- pre-escaped. ?>
	data-wp-interactive="auclair"
	data-wp-context="<?php echo esc_attr( wp_json_encode( $context ) ); ?>"
>
	<div class="auclair-search-results__bar">
		<span class="auclair-search-results__icon" aria-hidden="true">
			<?php echo get_icon_svg( 'search', 20 ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- trusted, static icon markup. ?>
		</span>
		<input
			type="text"
			class="auclair-search-results__input"
			placeholder="<?php echo esc_attr( $placeholder ); ?>"
			value="<?php echo esc_attr( $query ); ?>"
			data-wp-on--input="actions.onQueryInput"
			aria-label="<?php esc_attr_e( 'Search queries or topics', 'auclair' ); ?>"
			autofocus
		/>
	</div>
	<div class="auclair-search-results__results">
		<?php if ( '' !== $query && ! empty( $results ) ) : ?>
			<div class="auclair-search-results__list">
				<?php foreach ( $results as $index => $result ) : ?>
					<div class="auclair-search-results__row">
						<a class="auclair-search-results__item" href="<?php echo esc_url( $result['url'] ); ?>">
							<span><?php echo esc_html( $result['title'] ); ?></span>
							<?php echo get_icon_svg( 'chevron-right', 20 ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- trusted, static icon markup. ?>
						</a>
						<?php if ( $index < count( $results ) - 1 ) : ?>
							<div class="auclair-search-results__divider"></div>
						<?php endif; ?>
					</div>
				<?php endforeach; ?>
			</div>
		<?php elseif ( '' !== $query ) : ?>
			<div class="auclair-search-results__empty">
				<p class="auclair-search-results__empty-title">
					<?php
					printf(
						/* translators: %s: the search query. */
						esc_html__( 'No results for "%s"', 'auclair' ),
						esc_html( $query )
					);
					?>
				</p>
				<p class="auclair-search-results__empty-text"><?php esc_html_e( 'Try a different word, or raise a ticket and our team will get back to you.', 'auclair' ); ?></p>
			</div>
		<?php endif; ?>
	</div>
</div>
