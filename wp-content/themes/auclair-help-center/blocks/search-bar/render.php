<?php
/**
 * Search Bar block render.
 *
 * @package AuclairHelpCenter
 *
 * @var array $attributes Block attributes.
 */

use function AuclairHelpCenter\get_icon_svg;

$placeholder = ! empty( $attributes['placeholder'] ) ? $attributes['placeholder'] : __( 'Search queries or topics', 'auclair' );
$action      = ! empty( $attributes['action'] ) ? $attributes['action'] : '/help/search/?q=%s';

$context = [
	'action' => $action,
];

$wrapper_attributes = get_block_wrapper_attributes();
?>
<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- pre-escaped. ?>>
	<div
		class="auclair-search-bar"
		data-wp-interactive="auclair"
		data-wp-context="<?php echo esc_attr( wp_json_encode( $context ) ); ?>"
	>
		<span class="auclair-search-bar__icon" aria-hidden="true">
			<?php echo get_icon_svg( 'search', 20 ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- trusted, static icon markup. ?>
		</span>
		<input
			type="text"
			class="auclair-search-bar__input"
			placeholder="<?php echo esc_attr( $placeholder ); ?>"
			data-wp-bind--value="state.searchQuery"
			data-wp-on--input="actions.setSearchQuery"
			data-wp-on--keydown="actions.handleSearchKeydown"
			aria-label="<?php esc_attr_e( 'Search for help', 'auclair' ); ?>"
		/>
		<button
			type="button"
			class="auclair-search-bar__clear"
			data-wp-on--mousedown="actions.clearSearch"
			data-wp-on--click="actions.clearSearch"
			aria-label="<?php esc_attr_e( 'Clear search', 'auclair' ); ?>"
		>
			<?php echo get_icon_svg( 'cancel-circle', 24 ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- trusted, static icon markup. ?>
		</button>
	</div>
</div>
