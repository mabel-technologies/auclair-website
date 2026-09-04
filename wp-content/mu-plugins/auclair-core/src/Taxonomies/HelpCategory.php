<?php
/**
 * Help category taxonomy.
 *
 * @package AuclairCore
 */

namespace AuclairCore\Taxonomies;

use TenupFramework\Taxonomies\AbstractTaxonomy;

/**
 * `help_category` — drives the landing grid, category pages, breadcrumbs,
 * related categories, and the ticket-form dropdown.
 */
class HelpCategory extends AbstractTaxonomy {

	const NAME = 'help_category';

	/**
	 * Seed terms created on first registration, in display order.
	 *
	 * @var string[]
	 */
	const DEFAULT_TERMS = [
		'Getting started',
		'Subscription & billing',
		'Listening & playback',
		'Hearing test',
		'Discover & your sound',
		'Social & creating',
		'Creators & artists',
		'Account, privacy & safety',
	];

	/**
	 * Get the taxonomy name.
	 *
	 * @return string
	 */
	public function get_name() {
		return self::NAME;
	}

	/**
	 * Get the singular taxonomy label.
	 *
	 * @return string
	 */
	public function get_singular_label() {
		return esc_html__( 'Help Category', 'auclair' );
	}

	/**
	 * Get the plural taxonomy label.
	 *
	 * @return string
	 */
	public function get_plural_label() {
		return esc_html__( 'Help Categories', 'auclair' );
	}

	/**
	 * Allows sub-groups inside a category.
	 *
	 * @return bool
	 */
	public function is_hierarchical() {
		return true;
	}

	/**
	 * Get the options for the taxonomy.
	 *
	 * @return array
	 */
	public function get_options() {
		$options = parent::get_options();

		// Term archives live at the site root (`/{slug}/`). A generated
		// taxonomy rewrite would emit a single-segment catch-all that
		// swallows every page, so the rules are added explicitly per term
		// in add_rules() instead.
		$options['rewrite'] = false;

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
	 * Register term meta and seed default terms after the taxonomy registers.
	 *
	 * @return void
	 */
	public function after_register() {
		// Priority 25 so the static-page rules (init 20) are inserted into
		// `extra_rules_top` first and therefore match first — a page and a
		// term sharing a slug must resolve to the page.
		add_action( 'init', [ $this, 'add_rules' ], 25 );

		// The rules are built from the term list, so it has to be rebuilt
		// whenever that list changes.
		add_action( 'created_' . self::NAME, [ $this, 'schedule_flush' ] );
		add_action( 'edited_' . self::NAME, [ $this, 'schedule_flush' ] );
		add_action( 'delete_' . self::NAME, [ $this, 'schedule_flush' ] );

		// `rewrite => false` stops core generating pretty term links, so
		// they're built here to match the rules added in add_rules().
		add_filter( 'term_link', [ $this, 'filter_term_link' ], 10, 3 );

		register_term_meta(
			self::NAME,
			'icon',
			[
				'type'              => 'string',
				'single'            => true,
				'show_in_rest'      => true,
				'sanitize_callback' => 'sanitize_text_field',
				'auth_callback'     => static function () {
					return current_user_can( 'manage_categories' );
				},
			]
		);

		register_term_meta(
			self::NAME,
			'accent',
			[
				'type'              => 'string',
				'single'            => true,
				'show_in_rest'      => true,
				'default'           => '#0075FF',
				'sanitize_callback' => 'sanitize_hex_color',
				'auth_callback'     => static function () {
					return current_user_can( 'manage_categories' );
				},
			]
		);

		register_term_meta(
			self::NAME,
			'short_description',
			[
				'type'              => 'string',
				'single'            => true,
				'show_in_rest'      => true,
				'sanitize_callback' => 'sanitize_text_field',
				'auth_callback'     => static function () {
					return current_user_can( 'manage_categories' );
				},
			]
		);

		register_term_meta(
			self::NAME,
			'order',
			[
				'type'              => 'integer',
				'single'            => true,
				'show_in_rest'      => true,
				'default'           => 0,
				'sanitize_callback' => 'absint',
				'auth_callback'     => static function () {
					return current_user_can( 'manage_categories' );
				},
			]
		);

		register_term_meta(
			self::NAME,
			'in_ticket_form',
			[
				'type'              => 'boolean',
				'single'            => true,
				'show_in_rest'      => true,
				'default'           => true,
				'sanitize_callback' => 'rest_sanitize_boolean',
				'auth_callback'     => static function () {
					return current_user_can( 'manage_categories' );
				},
			]
		);

		$this->seed_default_terms();

		add_action( self::NAME . '_add_form_fields', [ $this, 'render_add_form_fields' ] );
		add_action( self::NAME . '_edit_form_fields', [ $this, 'render_edit_form_fields' ] );
		add_action( 'created_' . self::NAME, [ $this, 'save_term_meta' ] );
		add_action( 'edited_' . self::NAME, [ $this, 'save_term_meta' ] );
	}

	/**
	 * Get every term slug, for building rewrite rules.
	 *
	 * @return string[]
	 */
	public static function get_slugs() {
		$slugs = get_terms(
			[
				'taxonomy'   => self::NAME,
				'hide_empty' => false,
				'fields'     => 'slugs',
			]
		);

		return is_wp_error( $slugs ) ? [] : $slugs;
	}

	/**
	 * Get terms in display order, tolerating terms that have no `order` meta.
	 *
	 * Passing `meta_key => 'order'` to `get_terms()` makes WP_Meta_Query emit
	 * an EXISTS clause, which is an INNER JOIN on `wp_termmeta` — any term
	 * without an `order` row is dropped from the results entirely rather than
	 * merely sorted last. Only the admin Add/Edit Category form writes that
	 * row (`save_term_meta()` reads `$_POST`), so a term created by WP-CLI,
	 * the REST API, or a direct SQL insert is invisible everywhere until
	 * someone backfills the meta by hand. Sorting in PHP instead keeps every
	 * term in the result set; the taxonomy is a handful of rows, so the cost
	 * is nil.
	 *
	 * @param array $args Optional `get_terms()` args. `meta_key`/`meta_value`
	 *                    and a `meta_value*` `orderby` are ignored; `number`
	 *                    is applied after sorting.
	 *
	 * @return \WP_Term[]
	 */
	public static function ordered_terms( array $args = [] ) {
		$args = wp_parse_args(
			$args,
			[
				'taxonomy'   => self::NAME,
				'hide_empty' => false,
			]
		);

		unset( $args['meta_key'], $args['meta_value'] );

		if ( isset( $args['orderby'] ) && in_array( $args['orderby'], [ 'meta_value', 'meta_value_num' ], true ) ) {
			unset( $args['orderby'], $args['order'] );
		}

		// Truncating before the sort would cut on the database's order, not
		// on ours, so slice after.
		$number = isset( $args['number'] ) ? (int) $args['number'] : 0;
		unset( $args['number'] );

		$args['fields'] = 'all';

		$terms = get_terms( $args );

		if ( is_wp_error( $terms ) ) {
			return [];
		}

		usort(
			$terms,
			static function ( $a, $b ) {
				return [ self::term_order( $a->term_id ), $a->name ] <=> [ self::term_order( $b->term_id ), $b->name ];
			}
		);

		return $number > 0 ? array_slice( $terms, 0, $number ) : $terms;
	}

	/**
	 * Sort key for a term's grid position.
	 *
	 * `order` is registered with a default of 0, so `get_term_meta()` returns
	 * 0 for a term that has no row at all — which would sort every unseeded
	 * term to the front of the grid, ahead of "Getting started". Check for
	 * the row itself and sort those terms last instead.
	 *
	 * @param int $term_id Term ID.
	 *
	 * @return int
	 */
	protected static function term_order( $term_id ) {
		return metadata_exists( 'term', $term_id, 'order' )
			? (int) get_term_meta( $term_id, 'order', true )
			: PHP_INT_MAX;
	}

	/**
	 * Add one explicit root-level archive rule per term (`/{slug}/`, plus
	 * its paged variant), ahead of the generic page rule.
	 *
	 * @return void
	 */
	public function add_rules() {
		/*
		 * The generated rules only reach the router through the cached
		 * `rewrite_rules` option, and the flush that rebuilds it is scheduled
		 * from the created/edited/delete term hooks — which a direct SQL
		 * insert never fires. Notice a term whose rule is missing from the
		 * cache and schedule the flush here instead; `maybe_flush()` runs on
		 * `wp_loaded`, so it is consumed on this same request.
		 */
		$cached  = get_option( 'rewrite_rules' );
		$missing = false;

		foreach ( self::get_slugs() as $slug ) {
			$quoted = preg_quote( $slug, '/' );
			$rule   = '^' . $quoted . '/?$';

			add_rewrite_rule(
				'^' . $quoted . '/page/([0-9]{1,})/?$',
				'index.php?' . self::NAME . '=' . $slug . '&paged=$matches[1]',
				'top'
			);
			add_rewrite_rule(
				$rule,
				'index.php?' . self::NAME . '=' . $slug,
				'top'
			);

			if ( is_array( $cached ) && ! isset( $cached[ $rule ] ) ) {
				$missing = true;
			}
		}

		if ( $missing ) {
			$this->schedule_flush();
		}
	}

	/**
	 * Point term links at the root-level archive (`/{slug}/`).
	 *
	 * @param string   $link     The term link core generated.
	 * @param \WP_Term $term     The term.
	 * @param string   $taxonomy The term's taxonomy.
	 *
	 * @return string
	 */
	public function filter_term_link( $link, $term, $taxonomy ) {
		if ( self::NAME !== $taxonomy ) {
			return $link;
		}

		return user_trailingslashit( home_url( '/' . $term->slug ), 'category' );
	}

	/**
	 * Flush rewrite rules on the next request after the term list changes.
	 *
	 * Deferred rather than immediate: the rules are built on `init`, which
	 * has already run by the time a term is saved.
	 *
	 * @return void
	 */
	public function schedule_flush() {
		update_option( 'auclair_flush_rewrite', 1 );
	}

	/**
	 * Seed the default category terms, once, in display order.
	 *
	 * @return void
	 */
	protected function seed_default_terms() {
		if ( get_option( 'auclair_seeded_' . self::NAME ) ) {
			return;
		}

		foreach ( self::DEFAULT_TERMS as $order => $name ) {
			$term = term_exists( $name, self::NAME );

			if ( ! $term ) {
				$term = wp_insert_term( $name, self::NAME );
			}

			if ( ! is_wp_error( $term ) ) {
				update_term_meta( $term['term_id'], 'order', $order );
				update_term_meta( $term['term_id'], 'in_ticket_form', true );
			}
		}

		update_option( 'auclair_seeded_' . self::NAME, true, false );
	}

	/**
	 * Render the meta fields on the "Add Category" screen.
	 *
	 * @return void
	 */
	public function render_add_form_fields() {
		?>
		<div class="form-field">
			<label for="auclair-icon"><?php esc_html_e( 'Icon', 'auclair' ); ?></label>
			<input type="text" name="auclair_icon" id="auclair-icon" value="" />
			<p><?php esc_html_e( 'Icon identifier used by the card and category header.', 'auclair' ); ?></p>
		</div>
		<div class="form-field">
			<label for="auclair-accent"><?php esc_html_e( 'Accent colour', 'auclair' ); ?></label>
			<input type="text" name="auclair_accent" id="auclair-accent" value="#0075FF" />
			<p><?php esc_html_e( 'Hex colour used for the card ring animation and icon glow.', 'auclair' ); ?></p>
		</div>
		<div class="form-field">
			<label for="auclair-short-description"><?php esc_html_e( 'Short description', 'auclair' ); ?></label>
			<input type="text" name="auclair_short_description" id="auclair-short-description" value="" />
			<p><?php esc_html_e( 'Card and category-header subline.', 'auclair' ); ?></p>
		</div>
		<div class="form-field">
			<label for="auclair-order"><?php esc_html_e( 'Grid order', 'auclair' ); ?></label>
			<input type="number" name="auclair_order" id="auclair-order" value="0" />
		</div>
		<div class="form-field">
			<label>
				<input type="checkbox" name="auclair_in_ticket_form" value="1" checked="checked" />
				<?php esc_html_e( 'Show in the ticket-form category dropdown', 'auclair' ); ?>
			</label>
		</div>
		<?php
	}

	/**
	 * Render the meta fields on the "Edit Category" screen.
	 *
	 * @param \WP_Term $term The term being edited.
	 *
	 * @return void
	 */
	public function render_edit_form_fields( $term ) {
		$icon               = get_term_meta( $term->term_id, 'icon', true );
		$accent             = get_term_meta( $term->term_id, 'accent', true );
		$short_description  = get_term_meta( $term->term_id, 'short_description', true );
		$order              = get_term_meta( $term->term_id, 'order', true );
		$in_ticket_form     = get_term_meta( $term->term_id, 'in_ticket_form', true );
		?>
		<tr class="form-field">
			<th scope="row"><label for="auclair-icon"><?php esc_html_e( 'Icon', 'auclair' ); ?></label></th>
			<td>
				<input type="text" name="auclair_icon" id="auclair-icon" value="<?php echo esc_attr( $icon ); ?>" />
				<p class="description"><?php esc_html_e( 'Icon identifier used by the card and category header.', 'auclair' ); ?></p>
			</td>
		</tr>
		<tr class="form-field">
			<th scope="row"><label for="auclair-accent"><?php esc_html_e( 'Accent colour', 'auclair' ); ?></label></th>
			<td>
				<input type="text" name="auclair_accent" id="auclair-accent" value="<?php echo esc_attr( $accent ? $accent : '#0075FF' ); ?>" />
				<p class="description"><?php esc_html_e( 'Hex colour used for the card ring animation and icon glow.', 'auclair' ); ?></p>
			</td>
		</tr>
		<tr class="form-field">
			<th scope="row"><label for="auclair-short-description"><?php esc_html_e( 'Short description', 'auclair' ); ?></label></th>
			<td>
				<input type="text" name="auclair_short_description" id="auclair-short-description" value="<?php echo esc_attr( $short_description ); ?>" class="regular-text" />
				<p class="description"><?php esc_html_e( 'Card and category-header subline.', 'auclair' ); ?></p>
			</td>
		</tr>
		<tr class="form-field">
			<th scope="row"><label for="auclair-order"><?php esc_html_e( 'Grid order', 'auclair' ); ?></label></th>
			<td><input type="number" name="auclair_order" id="auclair-order" value="<?php echo esc_attr( $order ? $order : 0 ); ?>" /></td>
		</tr>
		<tr class="form-field">
			<th scope="row"><?php esc_html_e( 'Ticket form', 'auclair' ); ?></th>
			<td>
				<label>
					<input type="checkbox" name="auclair_in_ticket_form" value="1" <?php checked( (bool) $in_ticket_form ); ?> />
					<?php esc_html_e( 'Show in the ticket-form category dropdown', 'auclair' ); ?>
				</label>
			</td>
		</tr>
		<?php
	}

	/**
	 * Save the term meta fields.
	 *
	 * @param int $term_id The term ID being saved.
	 *
	 * @return void
	 */
	public function save_term_meta( $term_id ) {
		if ( ! current_user_can( 'manage_categories' ) ) {
			return;
		}

		if ( ! isset( $_POST['_wpnonce'] ) || ! wp_verify_nonce( sanitize_key( $_POST['_wpnonce'] ), 'update-tag_' . $term_id ) ) {
			return;
		}

		if ( isset( $_POST['auclair_icon'] ) ) {
			update_term_meta( $term_id, 'icon', sanitize_text_field( wp_unslash( $_POST['auclair_icon'] ) ) );
		}

		if ( isset( $_POST['auclair_accent'] ) ) {
			$accent = sanitize_hex_color( wp_unslash( $_POST['auclair_accent'] ) );
			if ( $accent ) {
				update_term_meta( $term_id, 'accent', $accent );
			}
		}

		if ( isset( $_POST['auclair_short_description'] ) ) {
			update_term_meta( $term_id, 'short_description', sanitize_text_field( wp_unslash( $_POST['auclair_short_description'] ) ) );
		}

		if ( isset( $_POST['auclair_order'] ) ) {
			update_term_meta( $term_id, 'order', absint( $_POST['auclair_order'] ) );
		}

		update_term_meta( $term_id, 'in_ticket_form', ! empty( $_POST['auclair_in_ticket_form'] ) );
	}
}
