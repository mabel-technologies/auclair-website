<?php
/**
 * Help article post type.
 *
 * @package AuclairCore
 */

namespace AuclairCore\PostTypes;

use TenupFramework\PostTypes\AbstractPostType;
use AuclairCore\Taxonomies\HelpCategory;
use AuclairCore\Taxonomies\HelpTag;
use AuclairCore\Taxonomies\Platform;
use AuclairCore\Taxonomies\Audience;

/**
 * `kb_article` — the single content unit behind category pages, top queries,
 * related queries, and search.
 */
class KbArticle extends AbstractPostType {

	const NAME = 'kb_article';

	/**
	 * Get the post type name.
	 *
	 * @return string
	 */
	public function get_name() {
		return self::NAME;
	}

	/**
	 * Get the singular post type label.
	 *
	 * @return string
	 */
	public function get_singular_label() {
		return esc_html__( 'Article', 'auclair' );
	}

	/**
	 * Get the plural post type label.
	 *
	 * @return string
	 */
	public function get_plural_label() {
		return esc_html__( 'Articles', 'auclair' );
	}

	/**
	 * Get the menu icon for the post type.
	 *
	 * @return string
	 */
	public function get_menu_icon() {
		return 'dashicons-media-document';
	}

	/**
	 * Default post type supported features.
	 *
	 * @return array<string>
	 */
	public function get_editor_supports() {
		return [ 'title', 'editor', 'excerpt', 'revisions', 'custom-fields', 'page-attributes' ];
	}

	/**
	 * Get the options for the post type.
	 *
	 * Category pages are term archives, so this post type has no archive of
	 * its own. The permalink structure is `%help_category%/%postname%`,
	 * built via a custom permastruct in after_register() rather than the
	 * `rewrite` arg, since core rewrite doesn't support taxonomy tokens.
	 *
	 * @return array
	 */
	public function get_options() {
		$options = parent::get_options();

		$options['has_archive'] = false;
		$options['rewrite']     = false;

		return $options;
	}

	/**
	 * Can the class be registered?
	 *
	 * @return bool
	 */
	public function can_register() {
		return true;
	}

	/**
	 * Get the taxonomies associated with this post type.
	 *
	 * @return array<string>
	 */
	public function get_supported_taxonomies() {
		return [
			HelpCategory::NAME,
			HelpTag::NAME,
			Platform::NAME,
			Audience::NAME,
		];
	}

	/**
	 * Set up the `%help_category%/%postname%` permastruct, register
	 * post meta, and wire the admin-list voting/helpfulness columns.
	 *
	 * @return void
	 */
	public function after_register() {
		add_rewrite_tag( '%help_category%', '([^/]+)', 'help_category=' );
		add_rewrite_tag( '%' . self::NAME . '%', '([^/]+)', self::NAME . '=' );
		add_permastruct(
			self::NAME,
			'%help_category%/%' . self::NAME . '%',
			[
				'with_front' => false,
				'ep_mask'    => EP_PERMALINK,
				// Without this, core also emits rules for each leading
				// segment of the struct — including a bare `([^/]+)/?$`
				// catch-all that would swallow every root-level page.
				'walk_dirs'  => false,
			]
		);

		add_filter( 'post_type_link', [ $this, 'filter_permalink' ], 10, 2 );

		$this->register_meta();
	}

	/**
	 * Replace the `%help_category%` token in the permalink with the
	 * article's primary help_category term slug.
	 *
	 * @param string   $post_link The post's permalink.
	 * @param \WP_Post $post      The post object.
	 *
	 * @return string
	 */
	public function filter_permalink( $post_link, $post ) {
		if ( false === strpos( $post_link, '%help_category%' ) || self::NAME !== $post->post_type ) {
			return $post_link;
		}

		$terms = get_the_terms( $post, HelpCategory::NAME );
		$slug  = 'uncategorized';

		if ( ! empty( $terms ) && ! is_wp_error( $terms ) ) {
			$slug = $terms[0]->slug;
		}

		return str_replace( '%help_category%', $slug, $post_link );
	}

	/**
	 * Register the Article field group as native post meta.
	 *
	 * @return void
	 */
	protected function register_meta() {
		$editable = static function () {
			return current_user_can( 'edit_posts' );
		};

		register_post_meta(
			self::NAME,
			'intro',
			[
				'type'              => 'string',
				'single'            => true,
				'show_in_rest'      => true,
				'sanitize_callback' => 'sanitize_textarea_field',
				'auth_callback'     => $editable,
			]
		);

		register_post_meta(
			self::NAME,
			'steps',
			[
				'type'          => 'array',
				'single'        => true,
				'show_in_rest'  => [
					'schema' => [
						'type'  => 'array',
						'items' => [ 'type' => 'string' ],
					],
				],
				'auth_callback' => $editable,
			]
		);

		register_post_meta(
			self::NAME,
			'group',
			[
				'type'              => 'string',
				'single'            => true,
				'show_in_rest'      => true,
				'sanitize_callback' => 'sanitize_text_field',
				'auth_callback'     => $editable,
			]
		);

		register_post_meta(
			self::NAME,
			'related',
			[
				'type'          => 'array',
				'single'        => true,
				'show_in_rest'  => [
					'schema' => [
						'type'  => 'array',
						'items' => [ 'type' => 'integer' ],
					],
				],
				'auth_callback' => $editable,
			]
		);

		register_post_meta(
			self::NAME,
			'is_top_query',
			[
				'type'              => 'boolean',
				'single'            => true,
				'show_in_rest'      => true,
				'default'           => false,
				'sanitize_callback' => 'rest_sanitize_boolean',
				'auth_callback'     => $editable,
			]
		);

		register_post_meta(
			self::NAME,
			'chip_label',
			[
				'type'              => 'string',
				'single'            => true,
				'show_in_rest'      => true,
				'sanitize_callback' => 'sanitize_text_field',
				'auth_callback'     => $editable,
			]
		);

		// Feedback counters — written by the article-feedback REST endpoint
		// directly via update_post_meta(), not through the REST meta PUT
		// path, so auth_callback only needs to gate manual admin edits.
		register_post_meta(
			self::NAME,
			'vote_up',
			[
				'type'              => 'integer',
				'single'            => true,
				'show_in_rest'      => true,
				'default'           => 0,
				'sanitize_callback' => 'absint',
				'auth_callback'     => $editable,
			]
		);

		register_post_meta(
			self::NAME,
			'vote_down',
			[
				'type'              => 'integer',
				'single'            => true,
				'show_in_rest'      => true,
				'default'           => 0,
				'sanitize_callback' => 'absint',
				'auth_callback'     => $editable,
			]
		);

		register_post_meta(
			self::NAME,
			'vote_score',
			[
				'type'              => 'number',
				'single'            => true,
				'show_in_rest'      => true,
				'default'           => 0,
				'auth_callback'     => $editable,
			]
		);

		register_post_meta(
			self::NAME,
			'vote_last',
			[
				'type'              => 'string',
				'single'            => true,
				'show_in_rest'      => true,
				'sanitize_callback' => 'sanitize_text_field',
				'auth_callback'     => $editable,
			]
		);

		register_post_meta(
			self::NAME,
			'view_count',
			[
				'type'              => 'integer',
				'single'            => true,
				'show_in_rest'      => true,
				'default'           => 0,
				'sanitize_callback' => 'absint',
				'auth_callback'     => $editable,
			]
		);
	}
}
