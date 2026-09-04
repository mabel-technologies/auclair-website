<?php
/**
 * Article Group block render.
 *
 * Queries the current category's articles, buckets them by their `group`
 * meta (first-seen order, itself following `menu_order`), and renders one
 * heading + link list per bucket.
 *
 * @package AuclairHelpCenter
 *
 * @var array $attributes Block attributes.
 */

use function AuclairHelpCenter\get_icon_svg;
use AuclairCore\Taxonomies\HelpCategory;
use AuclairCore\PostTypes\KbArticle;

$term_id = ! empty( $attributes['termId'] ) ? (int) $attributes['termId'] : 0;

if ( $term_id ) {
	$term = get_term( $term_id, HelpCategory::NAME );
} elseif ( is_tax( HelpCategory::NAME ) ) {
	$term = get_queried_object();
} else {
	// Template-editing context (e.g. previewing this block in the Site
	// Editor's taxonomy-help_category template, which has no real queried
	// term): fall back to a representative sample category so the block
	// shows real content instead of rendering empty.
	$sample = HelpCategory::ordered_terms(
		[
			'taxonomy'   => HelpCategory::NAME,
			'hide_empty' => false,
			'number'     => 1,
		]
	);
	$term = ! empty( $sample ) && ! is_wp_error( $sample ) ? $sample[0] : null;
}

if ( ! $term || is_wp_error( $term ) ) {
	return;
}

$posts = get_posts(
	[
		'post_type'      => KbArticle::NAME,
		'posts_per_page' => -1,
		'orderby'        => 'menu_order title',
		'order'          => 'ASC',
		'tax_query'      => [ // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query -- single term lookup, small result set.
			[
				'taxonomy' => HelpCategory::NAME,
				'field'    => 'term_id',
				'terms'    => $term->term_id,
			],
		],
	]
);

if ( empty( $posts ) ) {
	return;
}

$groups = [];

foreach ( $posts as $post ) {
	$label = get_post_meta( $post->ID, 'group', true );
	$label = $label ? $label : __( 'Articles', 'auclair' );

	if ( ! isset( $groups[ $label ] ) ) {
		$groups[ $label ] = [];
	}

	$groups[ $label ][] = $post;
}

$wrapper_attributes = get_block_wrapper_attributes( [ 'class' => 'auclair-article-group' ] );
?>
<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- pre-escaped. ?>>
	<?php foreach ( $groups as $label => $group_posts ) : ?>
		<div class="auclair-article-group__group">
			<h2 class="auclair-article-group__label">
				<span class="auclair-article-group__bar" aria-hidden="true"></span>
				<?php echo esc_html( $label ); ?>
			</h2>
			<ul class="auclair-article-group__list">
				<?php foreach ( $group_posts as $post ) : ?>
					<li class="auclair-article-group__item">
						<a href="<?php echo esc_url( get_permalink( $post ) ); ?>">
							<span><?php echo esc_html( get_the_title( $post ) ); ?></span>
							<?php echo get_icon_svg( 'chevron-right', 16 ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- trusted, static icon markup. ?>
						</a>
					</li>
				<?php endforeach; ?>
			</ul>
		</div>
	<?php endforeach; ?>
</div>
