<?php
/**
 * Quick Help Chips block render.
 *
 * @package AuclairHelpCenter
 *
 * @var array $attributes Block attributes.
 */

use AuclairCore\PostTypes\KbArticle;
use AuclairCore\Taxonomies\HelpTag;

$source = ! empty( $attributes['source'] ) ? $attributes['source'] : 'popular';
$limit  = ! empty( $attributes['limit'] ) ? (int) $attributes['limit'] : 4;
$picked = ! empty( $attributes['posts'] ) ? array_map( 'absint', $attributes['posts'] ) : [];
$chips  = [];

// Hand-picked articles lead, in the order chosen; the source fills what's left.
foreach ( $picked as $post_id ) {
	$post = get_post( $post_id );

	if ( $post && KbArticle::NAME === $post->post_type && 'publish' === $post->post_status ) {
		$chips[] = [
			'label' => get_the_title( $post ),
			'url'   => get_permalink( $post ),
		];
	}
}

$remaining = $limit - count( $chips );

if ( $remaining <= 0 || ( 'manual' === $source && ! empty( $picked ) ) ) {
	$chips = array_slice( $chips, 0, $limit );
} elseif ( 'manual' === $source && ! empty( $attributes['items'] ) ) {
	foreach ( $attributes['items'] as $item ) {
		$chips[] = [
			'label' => $item['label'] ?? '',
			'url'   => $item['url'] ?? '',
		];
	}
} elseif ( 'term' === $source ) {
	$terms = get_terms(
		[
			'taxonomy'   => HelpTag::NAME,
			'orderby'    => 'count',
			'order'      => 'DESC',
			'number'     => $remaining,
			'hide_empty' => true,
		]
	);

	if ( ! is_wp_error( $terms ) ) {
		foreach ( $terms as $term ) {
			$chips[] = [
				'label' => $term->name,
				'url'   => get_term_link( $term ),
			];
		}
	}
} else {
	$articles = get_posts(
		[
			'post_type'      => KbArticle::NAME,
			'posts_per_page' => $remaining,
			'post__not_in'   => $picked,
			'meta_key'       => 'view_count',
			'orderby'        => 'meta_value_num',
			'order'          => 'DESC',
		]
	);

	foreach ( $articles as $article ) {
		$chips[] = [
			'label' => get_the_title( $article ),
			'url'   => get_permalink( $article ),
		];
	}
}

if ( empty( $chips ) ) {
	return;
}

$wrapper_attributes = get_block_wrapper_attributes( [ 'class' => 'auclair-quick-help-chips' ] );
?>
<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- pre-escaped. ?> data-wp-interactive="auclair">
	<span class="auclair-quick-help-chips__label"><?php echo esc_html( $attributes['label'] ); ?></span>
	<div class="auclair-quick-help-chips__list">
		<?php foreach ( $chips as $chip ) : ?>
			<?php if ( ! empty( $chip['url'] ) ) : ?>
				<a class="auclair-quick-help-chips__chip" href="<?php echo esc_url( $chip['url'] ); ?>">
					<?php echo esc_html( $chip['label'] ); ?>
				</a>
			<?php else : ?>
				<button
					type="button"
					class="auclair-quick-help-chips__chip"
					data-wp-context="<?php echo esc_attr( wp_json_encode( [ 'chipLabel' => $chip['label'] ] ) ); ?>"
					data-wp-on--click="actions.fillSearchFromChip"
				>
					<?php echo esc_html( $chip['label'] ); ?>
				</button>
			<?php endif; ?>
		<?php endforeach; ?>
	</div>
</div>
