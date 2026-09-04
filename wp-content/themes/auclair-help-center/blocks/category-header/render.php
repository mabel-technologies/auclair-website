<?php
/**
 * Category Header block render.
 *
 * @package AuclairHelpCenter
 *
 * @var array $attributes Block attributes.
 */

use function AuclairHelpCenter\render_icon_tile;
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

$icon        = get_term_meta( $term->term_id, 'icon', true );
$icon        = $icon ? $icon : 'life-buoy';
$accent      = get_term_meta( $term->term_id, 'accent', true );
$accent      = $accent ? $accent : '#E9CA75';
$description = get_term_meta( $term->term_id, 'short_description', true );
$description = $description ? $description : $term->description;

$wrapper_attributes = get_block_wrapper_attributes( [ 'class' => 'auclair-category-header' ] );
?>
<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- pre-escaped. ?>>
	<?php echo render_icon_tile( $icon, $accent, 'large' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- trusted, self-generated markup. ?>
	<div class="auclair-category-header__text">
		<h1 class="auclair-category-header__title"><?php echo esc_html( $term->name ); ?></h1>
		<?php if ( $description ) : ?>
			<p class="auclair-category-header__description"><?php echo esc_html( $description ); ?></p>
		<?php endif; ?>
	</div>
</div>
