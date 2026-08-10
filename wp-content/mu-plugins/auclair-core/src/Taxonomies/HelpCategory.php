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

		$options['rewrite'] = [
			'slug'       => 'help',
			'with_front' => false,
		];

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
