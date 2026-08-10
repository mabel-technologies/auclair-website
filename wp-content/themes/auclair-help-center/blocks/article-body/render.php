<?php
/**
 * Article Body block render.
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

$steps = get_post_meta( $post_id, 'steps', true );
$steps = is_array( $steps ) ? array_filter( $steps ) : [];

$post    = get_post( $post_id );
$content = $post ? apply_filters( 'the_content', $post->post_content ) : '';

if ( empty( $steps ) && ! $content ) {
	return;
}

$wrapper_attributes = get_block_wrapper_attributes( [ 'class' => 'auclair-article-body' ] );
?>
<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- pre-escaped. ?>>
	<?php if ( ! empty( $steps ) ) : ?>
		<ol class="auclair-article-body__steps">
			<?php foreach ( $steps as $step ) : ?>
				<li><?php echo esc_html( $step ); ?></li>
			<?php endforeach; ?>
		</ol>
	<?php endif; ?>
	<?php if ( $content ) : ?>
		<div class="auclair-article-body__content">
			<?php echo wp_kses_post( $content ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- wp_kses_post() sanitised. ?>
		</div>
	<?php endif; ?>
</div>
