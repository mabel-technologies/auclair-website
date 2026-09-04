<?php
/**
 * Category Grid block render.
 *
 * @package AuclairHelpCenter
 *
 * @var array $attributes Block attributes.
 */

use AuclairCore\Taxonomies\HelpCategory;

$taxonomy = ! empty( $attributes['taxonomy'] ) ? $attributes['taxonomy'] : HelpCategory::NAME;
$include  = ! empty( $attributes['include'] ) ? array_map( 'absint', $attributes['include'] ) : [];
$columns  = ! empty( $attributes['columns'] ) ? (int) $attributes['columns'] : 4;

$query_args = [
	'taxonomy'   => $taxonomy,
	'hide_empty' => false,
];

if ( ! empty( $include ) ) {
	$query_args['include'] = $include;
}

// Ordered by the `order` term meta, keeping terms that have no such row —
// see HelpCategory::ordered_terms().
$terms = HelpCategory::ordered_terms( $query_args );

if ( is_wp_error( $terms ) || empty( $terms ) ) {
	return;
}

$wrapper_attributes = get_block_wrapper_attributes(
	[
		'class' => 'auclair-category-grid',
		'style' => '--auclair-grid-columns:' . (int) $columns . ';',
	]
);
?>
<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- pre-escaped. ?>>
	<?php
	foreach ( $terms as $term ) {
		echo render_block(
			[
				'blockName' => 'auclair/category-card',
				'attrs'     => [
					'termId'   => $term->term_id,
					'animate'  => false,
					'featured' => true,
				],
			]
		); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- render_block() output is trusted block markup.
	}
	?>
</div>
