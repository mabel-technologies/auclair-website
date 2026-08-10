<?php
/**
 * Category Card block render.
 *
 * @package AuclairHelpCenter
 *
 * @var array $attributes Block attributes.
 */

use function AuclairHelpCenter\get_icon_svg;
use AuclairCore\Taxonomies\HelpCategory;

$term_id = ! empty( $attributes['termId'] ) ? (int) $attributes['termId'] : 0;
$term    = $term_id ? get_term( $term_id, HelpCategory::NAME ) : null;

if ( ! $term || is_wp_error( $term ) ) {
	return;
}

$icon        = get_term_meta( $term_id, 'icon', true );
$icon        = $icon ? $icon : 'life-buoy';
$accent      = ! empty( $attributes['accent'] ) ? $attributes['accent'] : get_term_meta( $term_id, 'accent', true );
$accent      = $accent ? $accent : '#E9CA75';
$animate     = ! isset( $attributes['animate'] ) || $attributes['animate'];
$card_class  = 'auclair-category-card' . ( $animate ? ' auclair-ring-hover' : '' );

$wrapper_attributes = get_block_wrapper_attributes(
	[
		'class' => $card_class,
		'style' => '--auclair-ring-accent:' . esc_attr( $accent ) . ';',
	]
);
?>
<a href="<?php echo esc_url( get_term_link( $term ) ); ?>" <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- pre-escaped. ?>>
	<span class="auclair-category-card__icon-wrap" style="--auclair-icon-accent:<?php echo esc_attr( $accent ); ?>;">
		<span class="auclair-category-card__glow"></span>
		<span class="auclair-category-card__icon" style="background:color-mix(in srgb, <?php echo esc_attr( $accent ); ?> 9%, transparent); color:<?php echo esc_attr( $accent ); ?>;">
			<?php echo get_icon_svg( $icon, 20 ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- trusted, static icon markup. ?>
		</span>
	</span>
	<span class="auclair-category-card__row">
		<span class="auclair-category-card__body">
			<span class="auclair-category-card__title"><?php echo esc_html( $term->name ); ?></span>
			<span class="auclair-category-card__count">
				<?php
				printf(
					/* translators: %s: number of articles. */
					esc_html( _n( '%s article', '%s articles', $term->count, 'auclair' ) ),
					esc_html( number_format_i18n( $term->count ) )
				);
				?>
			</span>
		</span>
		<span class="auclair-category-card__chevron">
			<?php echo get_icon_svg( 'chevron-right', 18 ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- trusted, static icon markup. ?>
		</span>
	</span>
</a>
