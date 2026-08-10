<?php
/**
 * Admin-list voting/helpfulness columns for kb_article.
 *
 * @package AuclairCore
 */

namespace AuclairCore\Admin;

use TenupFramework\Module;
use TenupFramework\ModuleInterface;
use AuclairCore\PostTypes\KbArticle;

/**
 * Adds Helpful / Score / Votes / Views columns to the kb_article admin list,
 * makes Score/Votes/Views sortable, adds a "Needs attention" filter, and a
 * Feedback metabox with a reset button on the article edit screen.
 */
class ArticleColumns implements ModuleInterface {

	use Module;

	/**
	 * Can the class be registered?
	 *
	 * @return bool
	 */
	public function can_register() {
		return is_admin();
	}

	/**
	 * Register hooks.
	 *
	 * @return void
	 */
	public function register() {
		add_filter( 'manage_' . KbArticle::NAME . '_posts_columns', [ $this, 'add_columns' ] );
		add_action( 'manage_' . KbArticle::NAME . '_posts_custom_column', [ $this, 'render_column' ], 10, 2 );
		add_filter( 'manage_edit-' . KbArticle::NAME . '_sortable_columns', [ $this, 'sortable_columns' ] );
		add_action( 'pre_get_posts', [ $this, 'sort_by_meta' ] );
		add_action( 'restrict_manage_posts', [ $this, 'render_needs_attention_filter' ] );
		add_action( 'parse_query', [ $this, 'filter_needs_attention' ] );
		add_action( 'add_meta_boxes', [ $this, 'add_feedback_metabox' ] );
		add_action( 'admin_post_auclair_reset_article_feedback', [ $this, 'handle_reset_feedback' ] );
	}

	/**
	 * Add the Helpful / Score / Votes / Views columns.
	 *
	 * @param array<string, string> $columns Existing columns.
	 *
	 * @return array<string, string>
	 */
	public function add_columns( $columns ) {
		$columns['helpful']    = esc_html__( 'Helpful', 'auclair' );
		$columns['vote_score'] = esc_html__( 'Score', 'auclair' );
		$columns['vote_total'] = esc_html__( 'Votes', 'auclair' );
		$columns['view_count'] = esc_html__( 'Views', 'auclair' );

		return $columns;
	}

	/**
	 * Render a custom column's content.
	 *
	 * @param string $column  The column key.
	 * @param int    $post_id The post ID.
	 *
	 * @return void
	 */
	public function render_column( $column, $post_id ) {
		$up    = (int) get_post_meta( $post_id, 'vote_up', true );
		$down  = (int) get_post_meta( $post_id, 'vote_down', true );
		$total = $up + $down;
		$score = $total > 0 ? round( ( $up / $total ) * 100 ) : 0;

		switch ( $column ) {
			case 'helpful':
				printf(
					'<span style="color:#1a7f37">&#9650; %1$d</span> &middot; <span style="color:#cf222e">&#9660; %2$d</span><br /><span style="display:block;height:3px;width:60px;background:#e1e4e8;border-radius:2px;margin-top:4px;"><span style="display:block;height:100%%;width:%3$d%%;background:%4$s;border-radius:2px;"></span></span>',
					$up,
					$down,
					$score,
					$score < 50 && $total >= 5 ? '#cf222e' : '#1a7f37'
				);
				break;

			case 'vote_score':
				echo $total > 0 ? esc_html( $score . '%' ) : '&#8212;';
				break;

			case 'vote_total':
				echo esc_html( $total );
				break;

			case 'view_count':
				echo esc_html( (int) get_post_meta( $post_id, 'view_count', true ) );
				break;
		}
	}

	/**
	 * Declare which columns are sortable.
	 *
	 * @param array<string, string> $columns Existing sortable columns.
	 *
	 * @return array<string, string>
	 */
	public function sortable_columns( $columns ) {
		$columns['vote_score'] = 'vote_score';
		$columns['vote_total'] = 'vote_total';
		$columns['view_count'] = 'view_count';

		return $columns;
	}

	/**
	 * Translate the Score/Views sort into a meta query.
	 *
	 * @param \WP_Query $query The current query.
	 *
	 * @return void
	 */
	public function sort_by_meta( $query ) {
		if ( ! is_admin() || ! $query->is_main_query() ) {
			return;
		}

		$orderby = $query->get( 'orderby' );

		if ( 'vote_score' === $orderby || 'view_count' === $orderby ) {
			$query->set( 'meta_key', $orderby );
			$query->set( 'orderby', 'meta_value_num' );
		}
	}

	/**
	 * Render the "Needs attention" filter dropdown (score < 50% with >= 5 votes).
	 *
	 * @return void
	 */
	public function render_needs_attention_filter() {
		global $typenow;

		if ( KbArticle::NAME !== $typenow ) {
			return;
		}

		$selected = isset( $_GET['auclair_needs_attention'] ) ? '1' : '';
		?>
		<label style="display:inline-block;margin-left:6px;">
			<input type="checkbox" name="auclair_needs_attention" value="1" <?php checked( $selected, '1' ); ?> onchange="this.form.submit()" />
			<?php esc_html_e( 'Needs attention', 'auclair' ); ?>
		</label>
		<?php
	}

	/**
	 * Apply the "Needs attention" filter to the admin list query.
	 *
	 * @param \WP_Query $query The current query.
	 *
	 * @return void
	 */
	public function filter_needs_attention( $query ) {
		global $pagenow, $typenow;

		if ( 'edit.php' !== $pagenow || KbArticle::NAME !== $typenow || empty( $_GET['auclair_needs_attention'] ) ) {
			return;
		}

		$ids = get_posts(
			[
				'post_type'      => KbArticle::NAME,
				'post_status'    => 'any',
				'posts_per_page' => -1,
				'fields'         => 'ids',
			]
		);

		$needs_attention = array_values(
			array_filter(
				$ids,
				static function ( $id ) {
					$up    = (int) get_post_meta( $id, 'vote_up', true );
					$down  = (int) get_post_meta( $id, 'vote_down', true );
					$total = $up + $down;

					return $total >= 5 && ( $up / $total ) < 0.5;
				}
			)
		);

		$query->query_vars['post__in'] = ! empty( $needs_attention ) ? $needs_attention : [ 0 ];
	}

	/**
	 * Add the Feedback metabox to the article edit screen.
	 *
	 * @return void
	 */
	public function add_feedback_metabox() {
		add_meta_box(
			'auclair-article-feedback',
			esc_html__( 'Feedback', 'auclair' ),
			[ $this, 'render_feedback_metabox' ],
			KbArticle::NAME,
			'side',
			'default'
		);
	}

	/**
	 * Render the Feedback metabox.
	 *
	 * @param \WP_Post $post The post being edited.
	 *
	 * @return void
	 */
	public function render_feedback_metabox( $post ) {
		$up     = (int) get_post_meta( $post->ID, 'vote_up', true );
		$down   = (int) get_post_meta( $post->ID, 'vote_down', true );
		$total  = $up + $down;
		$score  = $total > 0 ? round( ( $up / $total ) * 100 ) : 0;
		$last   = get_post_meta( $post->ID, 'vote_last', true );
		$reset_url = wp_nonce_url(
			admin_url( 'admin-post.php?action=auclair_reset_article_feedback&post=' . $post->ID ),
			'auclair_reset_article_feedback_' . $post->ID
		);
		?>
		<p>
			<strong><?php esc_html_e( 'Helpful:', 'auclair' ); ?></strong>
			<?php echo esc_html( sprintf( '%1$d up / %2$d down (%3$d%%)', $up, $down, $score ) ); ?>
		</p>
		<?php if ( $last ) : ?>
			<p><strong><?php esc_html_e( 'Last voted:', 'auclair' ); ?></strong> <?php echo esc_html( $last ); ?></p>
		<?php endif; ?>
		<p>
			<a class="button" href="<?php echo esc_url( $reset_url ); ?>" onclick="return confirm('<?php echo esc_js( __( 'Reset the helpful vote counts for this article?', 'auclair' ) ); ?>');">
				<?php esc_html_e( 'Reset feedback', 'auclair' ); ?>
			</a>
		</p>
		<?php
	}

	/**
	 * Handle the reset-feedback admin action.
	 *
	 * @return void
	 */
	public function handle_reset_feedback() {
		$post_id = isset( $_GET['post'] ) ? absint( $_GET['post'] ) : 0;

		if ( ! $post_id || ! current_user_can( 'edit_post', $post_id ) ) {
			wp_die( esc_html__( 'You are not allowed to do that.', 'auclair' ) );
		}

		check_admin_referer( 'auclair_reset_article_feedback_' . $post_id );

		update_post_meta( $post_id, 'vote_up', 0 );
		update_post_meta( $post_id, 'vote_down', 0 );
		update_post_meta( $post_id, 'vote_score', 0 );
		delete_post_meta( $post_id, 'vote_last' );

		wp_safe_redirect( get_edit_post_link( $post_id, 'raw' ) );
		exit;
	}
}
