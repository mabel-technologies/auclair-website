<?php
/**
 * Logo Bar block render.
 *
 * @package AuclairHelpCenter
 *
 * @var array $attributes Block attributes.
 */

$home_url = ! empty( $attributes['homeUrl'] ) ? $attributes['homeUrl'] : '/';
$logo_url = get_theme_file_uri( 'assets/svg/auclair-logo.svg' );

$wrapper_attributes = get_block_wrapper_attributes( [ 'class' => 'auclair-logo-bar' ] );
?>
<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- pre-escaped. ?>>
	<a class="auclair-logo-bar__lockup" href="<?php echo esc_url( $home_url ); ?>">
		<img
			class="auclair-logo-bar__logo"
			src="<?php echo esc_url( $logo_url ); ?>"
			alt="<?php echo esc_attr__( 'AuClair, by AiSound', 'auclair' ); ?>"
			width="130"
			height="37"
		/>
	</a>
</div>
