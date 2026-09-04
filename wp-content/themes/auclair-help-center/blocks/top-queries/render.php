<?php
/**
 * Top Queries block render.
 *
 * @package AuclairHelpCenter
 *
 * @var array $attributes Block attributes.
 */

use AuclairCore\PostTypes\KbArticle;
use function AuclairHelpCenter\get_icon_svg;

$source = ! empty( $attributes['source'] ) ? $attributes['source'] : 'sticky';
$limit  = ! empty( $attributes['limit'] ) ? (int) $attributes['limit'] : 10;
$picked = ! empty( $attributes['posts'] ) ? array_map( 'absint', $attributes['posts'] ) : [];
$items  = [];

// Hand-picked articles lead, in the order chosen; the source fills what's left.
foreach ( $picked as $post_id ) {
	$post = get_post( $post_id );

	if ( $post && KbArticle::NAME === $post->post_type && 'publish' === $post->post_status ) {
		$items[] = [
			'title' => get_the_title( $post ),
			'url'   => get_permalink( $post ),
		];
	}
}

$remaining = $limit - count( $items );

if ( $remaining <= 0 || 'manual' === $source ) {
	$items = array_slice( $items, 0, $limit );
} else {
	$query_args = [
		'post_type'      => KbArticle::NAME,
		'posts_per_page' => $remaining,
		'post__not_in'   => $picked,
	];

	if ( 'sticky' === $source ) {
		$query_args['meta_key'] = 'is_top_query';
		$query_args['orderby']  = 'meta_value_num';
		$query_args['order']    = 'DESC';
		$query_args['meta_query'] = [ // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query -- small, curated result set.
			[
				'key'     => 'is_top_query',
				'value'   => '1',
				'compare' => '=',
			],
		];
	} else {
		$query_args['meta_key'] = 'view_count';
		$query_args['orderby']  = 'meta_value_num';
		$query_args['order']    = 'DESC';
	}

	$posts = get_posts( $query_args );

	// Sticky source falls back to most-viewed if there aren't enough flagged articles.
	if ( 'sticky' === $source && count( $posts ) < $remaining ) {
		$existing_ids = array_merge( $picked, wp_list_pluck( $posts, 'ID' ) );
		$fallback     = get_posts(
			[
				'post_type'      => KbArticle::NAME,
				'posts_per_page' => $remaining - count( $posts ),
				'post__not_in'   => $existing_ids,
				'meta_key'       => 'view_count',
				'orderby'        => 'meta_value_num',
				'order'          => 'DESC',
			]
		);
		$posts        = array_merge( $posts, $fallback );
	}

	foreach ( $posts as $post ) {
		$items[] = [
			'title' => get_the_title( $post ),
			'url'   => get_permalink( $post ),
		];
	}
}

if ( empty( $items ) ) {
	return;
}

$classes             = 'auclair-top-queries' . ( ! empty( $attributes['boxed'] ) ? ' auclair-top-queries--boxed' : '' );
$wrapper_attributes = get_block_wrapper_attributes( [ 'class' => $classes ] );
?>
<ol <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- pre-escaped. ?>>
	<?php foreach ( $items as $item ) : ?>
		<li class="auclair-top-queries__item">
			<a href="<?php echo esc_url( $item['url'] ); ?>">
				<span><?php echo esc_html( $item['title'] ); ?></span>
				<?php echo get_icon_svg( 'chevron-right', 16 ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- trusted, static icon markup. ?>
			</a>
		</li>
	<?php endforeach; ?>
</ol>
