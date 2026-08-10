<?php
/**
 * Article Header block render.
 *
 * @package AuclairHelpCenter
 *
 * @var array $attributes Block attributes.
 */

use AuclairCore\PostTypes\KbArticle;

$post_id = ! empty( $attributes['postId'] ) ? (int) $attributes['postId'] : 0;

if ( ! $post_id && is_singular( KbArticle::NAME ) ) {
	$post_id = get_the_ID();
}

if ( ! $post_id ) {
	return;
}

$intro = get_post_meta( $post_id, 'intro', true );

$wrapper_attributes = get_block_wrapper_attributes( [ 'class' => 'auclair-article-header' ] );
?>
<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- pre-escaped. ?>>
	<h1 class="auclair-article-header__title"><?php echo esc_html( get_the_title( $post_id ) ); ?></h1>
	<?php if ( $intro ) : ?>
		<p class="auclair-article-header__intro"><?php echo esc_html( $intro ); ?></p>
	<?php endif; ?>
</div>
