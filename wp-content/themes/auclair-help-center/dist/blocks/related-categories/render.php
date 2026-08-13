<?php
/**
 * Related Categories block render.
 *
 * @package AuclairHelpCenter
 *
 * @var array $attributes Block attributes.
 */

use AuclairCore\Taxonomies\HelpCategory;

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
	$sample = get_terms(
		[
			'taxonomy'   => HelpCategory::NAME,
			'hide_empty' => false,
			'number'     => 1,
			'meta_key'   => 'order', // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key -- single-row lookup.
			'orderby'    => 'meta_value_num',
			'order'      => 'ASC',
		]
	);
	$term = ! empty( $sample ) && ! is_wp_error( $sample ) ? $sample[0] : null;
}

if ( ! $term || is_wp_error( $term ) ) {
	return;
}

$limit   = ! empty( $attributes['limit'] ) ? (int) $attributes['limit'] : 3;
$exclude = ! empty( $attributes['exclude'] ) ? array_map( 'absint', $attributes['exclude'] ) : [];
$exclude[] = $term->term_id;

$siblings = get_terms(
	[
		'taxonomy'   => HelpCategory::NAME,
		'hide_empty' => false,
		'parent'     => $term->parent,
		'exclude'    => $exclude,
		'number'     => $limit,
		'meta_key'   => 'order', // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key -- small, curated term set.
		'orderby'    => 'meta_value_num',
		'order'      => 'ASC',
	]
);

if ( is_wp_error( $siblings ) || empty( $siblings ) ) {
	return;
}

$wrapper_attributes = get_block_wrapper_attributes( [ 'class' => 'auclair-related-categories' ] );
?>
<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- pre-escaped. ?>>
	<?php
	foreach ( $siblings as $sibling ) {
		echo render_block(
			[
				'blockName' => 'auclair/category-card',
				'attrs'     => [
					'termId'  => $sibling->term_id,
					'animate' => false,
				],
			]
		); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- render_block() output is trusted block markup.
	}
	?>
</div>
