<?php
/**
 * Related Queries block render.
 *
 * @package AuclairHelpCenter
 *
 * @var array $attributes Block attributes.
 */

use AuclairCore\PostTypes\KbArticle;
use AuclairCore\Taxonomies\HelpCategory;
use function AuclairHelpCenter\get_icon_svg;

$post_id = ! empty( $attributes['postId'] ) ? (int) $attributes['postId'] : 0;

if ( ! $post_id && is_singular( KbArticle::NAME ) ) {
	$post_id = get_the_ID();
}

if ( ! $post_id ) {
	return;
}

$limit  = ! empty( $attributes['limit'] ) ? (int) $attributes['limit'] : 4;
$source = ! empty( $attributes['source'] ) ? $attributes['source'] : 'same-category';
$items  = [];

if ( 'manual' === $source && ! empty( $attributes['posts'] ) ) {
	foreach ( $attributes['posts'] as $related_id ) {
		$related_post = get_post( (int) $related_id );

		if ( $related_post ) {
			$items[] = [
				'title' => get_the_title( $related_post ),
				'url'   => get_permalink( $related_post ),
			];
		}
	}
} else {
	$related_ids = get_post_meta( $post_id, 'related', true );
	$related_ids = is_array( $related_ids ) ? array_map( 'absint', $related_ids ) : [];
	$related_ids = array_diff( array_filter( $related_ids ), [ $post_id ] );

	if ( ! empty( $related_ids ) ) {
		$related_posts = get_posts(
			[
				'post_type'      => KbArticle::NAME,
				'post__in'       => array_slice( $related_ids, 0, $limit ),
				'orderby'        => 'post__in',
				'posts_per_page' => $limit,
			]
		);
	} else {
		$terms          = get_the_terms( $post_id, HelpCategory::NAME );
		$related_posts  = [];

		if ( ! empty( $terms ) && ! is_wp_error( $terms ) ) {
			$related_posts = get_posts(
				[
					'post_type'      => KbArticle::NAME,
					'posts_per_page' => $limit,
					'post__not_in'   => [ $post_id ],
					'orderby'        => 'menu_order title',
					'tax_query'      => [ // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query -- small, curated result set.
						[
							'taxonomy' => HelpCategory::NAME,
							'field'    => 'term_id',
							'terms'    => $terms[0]->term_id,
						],
					],
				]
			);
		}
	}

	foreach ( $related_posts as $related_post ) {
		$items[] = [
			'title' => get_the_title( $related_post ),
			'url'   => get_permalink( $related_post ),
		];
	}
}

if ( empty( $items ) ) {
	return;
}

$wrapper_attributes = get_block_wrapper_attributes( [ 'class' => 'auclair-related-queries' ] );

// The block editor's live preview (ServerSideRender, via the block-renderer
// REST endpoint) renders this heading itself as an inline-editable RichText
// field positioned above this same markup — suppress the PHP-rendered
// heading only in that context so it isn't shown twice. On every real page
// load (REST_REQUEST unset) this renders normally.
$is_editor_preview = defined( 'REST_REQUEST' ) && REST_REQUEST;
?>
<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- pre-escaped. ?>>
	<?php if ( ! $is_editor_preview ) : ?>
		<h2 class="auclair-related-queries__heading"><?php echo esc_html( $attributes['heading'] ?? __( 'Related queries', 'auclair' ) ); ?></h2>
	<?php endif; ?>
	<ul class="auclair-related-queries__list">
		<?php foreach ( $items as $index => $item ) : ?>
			<?php if ( $index > 0 ) : ?>
				<li class="auclair-related-queries__divider" role="presentation"></li>
			<?php endif; ?>
			<li class="auclair-related-queries__item">
				<a href="<?php echo esc_url( $item['url'] ); ?>">
					<span><?php echo esc_html( $item['title'] ); ?></span>
					<?php echo get_icon_svg( 'chevron-right', 20 ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- trusted, static icon markup. ?>
				</a>
			</li>
		<?php endforeach; ?>
	</ul>
</div>
