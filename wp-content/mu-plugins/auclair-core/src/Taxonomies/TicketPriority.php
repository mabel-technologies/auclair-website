<?php
/**
 * Ticket priority taxonomy.
 *
 * @package AuclairCore
 */

namespace AuclairCore\Taxonomies;

use TenupFramework\Taxonomies\AbstractTaxonomy;

/**
 * `ticket_priority` — admin-only priority level on `support_ticket`.
 */
class TicketPriority extends AbstractTaxonomy {

	const NAME = 'ticket_priority';

	/**
	 * Default terms created on first registration.
	 *
	 * @var string[]
	 */
	const DEFAULT_TERMS = [ 'Low', 'Normal', 'High', 'Urgent' ];

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
		return esc_html__( 'Ticket Priority', 'auclair' );
	}

	/**
	 * Get the plural taxonomy label.
	 *
	 * @return string
	 */
	public function get_plural_label() {
		return esc_html__( 'Ticket Priorities', 'auclair' );
	}

	/**
	 * Get the options for the taxonomy.
	 *
	 * @return array
	 */
	public function get_options() {
		$options = parent::get_options();

		$options['public']             = false;
		$options['publicly_queryable'] = false;
		$options['show_in_rest']       = true;
		$options['rewrite']            = false;

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
	 * Seed default priority terms, once.
	 *
	 * @return void
	 */
	public function after_register() {
		if ( get_option( 'auclair_seeded_' . self::NAME ) ) {
			return;
		}

		foreach ( self::DEFAULT_TERMS as $term ) {
			if ( ! term_exists( $term, self::NAME ) ) {
				wp_insert_term( $term, self::NAME );
			}
		}

		update_option( 'auclair_seeded_' . self::NAME, true, false );
	}
}
