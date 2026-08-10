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
	'meta_key'   => 'order',
	'orderby'    => 'meta_value_num',
	'order'      => 'ASC',
];

if ( ! empty( $include ) ) {
	$query_args['include'] = $include;
}

$terms = get_terms( $query_args );

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
				'attrs'     => [ 'termId' => $term->term_id ],
			]
		); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- render_block() output is trusted block markup.
	}
	?>
</div>
