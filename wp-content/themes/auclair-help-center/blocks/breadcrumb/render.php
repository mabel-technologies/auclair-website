<?php
/**
 * Breadcrumb block render.
 *
 * @package AuclairHelpCenter
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Block save content (unused, dynamic block).
 * @var WP_Block $block      Block instance.
 */

use function AuclairHelpCenter\get_help_home_url;
use AuclairCore\Taxonomies\HelpCategory;
use AuclairCore\PostTypes\KbArticle;

$crumbs = [
	[
		'label' => __( 'Help center', 'auclair' ),
		'url'   => get_help_home_url(),
	],
];

if ( is_singular( KbArticle::NAME ) ) {
	$terms = get_the_terms( get_the_ID(), HelpCategory::NAME );

	if ( ! empty( $terms ) && ! is_wp_error( $terms ) ) {
		$crumbs[] = [
			'label' => $terms[0]->name,
			'url'   => get_term_link( $terms[0] ),
		];
	}

	$crumbs[] = [
		'label' => get_the_title(),
		'url'   => '',
	];
} elseif ( is_tax( HelpCategory::NAME ) ) {
	$crumbs[] = [
		'label' => single_term_title( '', false ),
		'url'   => '',
	];
} elseif ( is_page() ) {
	$crumbs[] = [
		'label' => get_the_title(),
		'url'   => '',
	];
}

if ( ! empty( $attributes['overrideLabel'] ) ) {
	$crumbs[ count( $crumbs ) - 1 ] = [
		'label' => $attributes['overrideLabel'],
		'url'   => $attributes['overrideUrl'] ? $attributes['overrideUrl'] : '',
	];
}

$back_index = count( $crumbs ) - 2;
$back_url   = $back_index >= 0 && ! empty( $crumbs[ $back_index ]['url'] ) ? $crumbs[ $back_index ]['url'] : $crumbs[0]['url'];

$wrapper_attributes = get_block_wrapper_attributes( [ 'class' => 'auclair-breadcrumb' ] );
?>
<nav <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() output is pre-escaped. ?> aria-label="<?php esc_attr_e( 'Breadcrumb', 'auclair' ); ?>">
	<?php if ( ! empty( $attributes['showBack'] ) && count( $crumbs ) > 1 ) : ?>
		<a class="auclair-breadcrumb__back" href="<?php echo esc_url( $back_url ); ?>">
			<?php echo AuclairHelpCenter\get_icon_svg( 'chevron-left', 16 ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- trusted, static icon markup. ?>
		</a>
	<?php endif; ?>
	<ol class="auclair-breadcrumb__trail">
		<?php foreach ( $crumbs as $index => $crumb ) : ?>
			<li class="auclair-breadcrumb__item">
				<?php if ( $crumb['url'] && $index !== count( $crumbs ) - 1 ) : ?>
					<a href="<?php echo esc_url( $crumb['url'] ); ?>"><?php echo esc_html( $crumb['label'] ); ?></a>
				<?php else : ?>
					<span aria-current="page"><?php echo esc_html( $crumb['label'] ); ?></span>
				<?php endif; ?>
			</li>
			<?php if ( $index !== count( $crumbs ) - 1 ) : ?>
				<li class="auclair-breadcrumb__sep" aria-hidden="true">/</li>
			<?php endif; ?>
		<?php endforeach; ?>
	</ol>
</nav>
