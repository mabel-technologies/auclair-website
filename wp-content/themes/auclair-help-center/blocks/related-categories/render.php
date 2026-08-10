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
	$term = null;
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
				'attrs'     => [ 'termId' => $sibling->term_id ],
			]
		); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- render_block() output is trusted block markup.
	}
	?>
</div>
