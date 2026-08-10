<?php
/**
 * Support ticket post type.
 *
 * @package AuclairCore
 */

namespace AuclairCore\PostTypes;

use TenupFramework\PostTypes\AbstractPostType;
use AuclairCore\Taxonomies\HelpCategory;
use AuclairCore\Taxonomies\TicketStatus;
use AuclairCore\Taxonomies\TicketPriority;

/**
 * `support_ticket` — created via the `auclair/v1/ticket` REST endpoint, not
 * publicly readable. Restricted to users who can manage tickets.
 */
class SupportTicket extends AbstractPostType {

	const NAME = 'support_ticket';

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
		return esc_html__( 'Ticket', 'auclair' );
	}

	/**
	 * Get the plural post type label.
	 *
	 * @return string
	 */
	public function get_plural_label() {
		return esc_html__( 'Tickets', 'auclair' );
	}

	/**
	 * Get the menu icon for the post type.
	 *
	 * @return string
	 */
	public function get_menu_icon() {
		return 'dashicons-tickets-alt';
	}

	/**
	 * Default post type supported features.
	 *
	 * @return array<string>
	 */
	public function get_editor_supports() {
		return [ 'title', 'editor' ];
	}

	/**
	 * Get the options for the post type.
	 *
	 * Not public — tickets are never queryable on the front end, only
	 * created via the REST endpoint and managed in wp-admin.
	 *
	 * @return array
	 */
	public function get_options() {
		$options = parent::get_options();

		$options['public']             = false;
		$options['publicly_queryable'] = false;
		$options['exclude_from_search'] = true;
		$options['has_archive']        = false;
		$options['rewrite']            = false;
		$options['show_in_rest']       = true;
		$options['capability_type']    = [ 'support_ticket', 'support_tickets' ];
		$options['map_meta_cap']       = true;

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
			TicketStatus::NAME,
			TicketPriority::NAME,
		];
	}

	/**
	 * Grant ticket capabilities to the administrator role and register meta.
	 *
	 * @return void
	 */
	public function after_register() {
		$this->grant_capabilities();
		$this->register_meta();
	}

	/**
	 * Grant the custom `support_ticket` capabilities to administrators so
	 * the post type is manageable in wp-admin out of the box.
	 *
	 * @return void
	 */
	protected function grant_capabilities() {
		if ( get_option( 'auclair_seeded_support_ticket_caps' ) ) {
			return;
		}

		$role = get_role( 'administrator' );

		if ( $role ) {
			foreach ( [ 'edit_support_ticket', 'read_support_ticket', 'delete_support_ticket', 'edit_support_tickets', 'edit_others_support_tickets', 'publish_support_tickets', 'read_private_support_tickets', 'delete_support_tickets' ] as $cap ) {
				$role->add_cap( $cap );
			}
		}

		update_option( 'auclair_seeded_support_ticket_caps', true, false );
	}

	/**
	 * Register the ticket field group as native post meta.
	 *
	 * @return void
	 */
	protected function register_meta() {
		$editable = static function () {
			return current_user_can( 'edit_support_tickets' );
		};

		register_post_meta(
			self::NAME,
			'ticket_subject',
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
			'ticket_details',
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
			'ticket_email',
			[
				'type'              => 'string',
				'single'            => true,
				'show_in_rest'      => true,
				'sanitize_callback' => 'sanitize_email',
				'auth_callback'     => $editable,
			]
		);

		register_post_meta(
			self::NAME,
			'ticket_attachment',
			[
				'type'              => 'integer',
				'single'            => true,
				'show_in_rest'      => true,
				'sanitize_callback' => 'absint',
				'auth_callback'     => $editable,
			]
		);

		register_post_meta(
			self::NAME,
			'source_url',
			[
				'type'              => 'string',
				'single'            => true,
				'show_in_rest'      => true,
				'sanitize_callback' => 'sanitize_url',
				'auth_callback'     => $editable,
			]
		);

		register_post_meta(
			self::NAME,
			'submitted_at',
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
			'user_agent',
			[
				'type'              => 'string',
				'single'            => true,
				'show_in_rest'      => true,
				'sanitize_callback' => 'sanitize_text_field',
				'auth_callback'     => $editable,
			]
		);
	}
}
