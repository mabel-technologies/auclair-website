<?php
/**
 * `auclair/v1/ticket` REST endpoint — creates a `support_ticket` from the
 * `auclair/ticket-form` block.
 *
 * @package AuclairCore
 */

namespace AuclairCore\Rest;

use TenupFramework\Module;
use TenupFramework\ModuleInterface;
use AuclairCore\PostTypes\SupportTicket;
use AuclairCore\Taxonomies\HelpCategory;
use AuclairCore\Taxonomies\TicketStatus;
use AuclairCore\Taxonomies\TicketPriority;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;

/**
 * Registers and handles `POST auclair/v1/ticket`.
 */
class TicketEndpoint implements ModuleInterface {

	use Module;

	const RATE_LIMIT_MAX    = 5;
	const RATE_LIMIT_WINDOW = HOUR_IN_SECONDS;
	const TOKEN_TTL         = 5 * MINUTE_IN_SECONDS;
	const MAX_UPLOAD_BYTES  = 5 * MB_IN_BYTES;

	/**
	 * File types the endpoint will accept for the attachment, independent
	 * of the block's `allowedTypes` attribute (server is the source of truth).
	 *
	 * @var string[]
	 */
	const ALLOWED_MIME_TYPES = [ 'image/png', 'image/jpeg', 'image/webp', 'application/pdf' ];

	/**
	 * Can this module be registered?
	 *
	 * @return bool
	 */
	public function can_register() {
		return true;
	}

	/**
	 * Register hooks.
	 *
	 * @return void
	 */
	public function register() {
		add_action( 'rest_api_init', [ $this, 'register_routes' ] );
	}

	/**
	 * Register the `auclair/v1/ticket` route.
	 *
	 * @return void
	 */
	public function register_routes() {
		register_rest_route(
			'auclair/v1',
			'/ticket',
			[
				'methods'             => 'POST',
				'callback'            => [ $this, 'handle_submit' ],
				'permission_callback' => '__return_true',
			]
		);
	}

	/**
	 * Handle a ticket submission.
	 *
	 * @param WP_REST_Request $request The incoming request.
	 *
	 * @return WP_REST_Response|WP_Error
	 */
	public function handle_submit( WP_REST_Request $request ) {
		$nonce = $request->get_header( 'X-WP-Nonce' );

		if ( ! $nonce || ! wp_verify_nonce( $nonce, 'wp_rest' ) ) {
			return new WP_Error( 'auclair_invalid_nonce', __( 'Your session has expired. Please refresh the page and try again.', 'auclair' ), [ 'status' => 403 ] );
		}

		// Honeypot: bots that fill this hidden field get a fake success.
		if ( ! empty( $request->get_param( 'website' ) ) ) {
			return new WP_REST_Response( [ 'success' => true, 'redirect' => home_url( '/ticket-submitted/' ) ], 200 );
		}

		$rate_limit_error = $this->check_rate_limit();

		if ( is_wp_error( $rate_limit_error ) ) {
			return $rate_limit_error;
		}

		$fields = $this->validate_fields( $request );

		if ( is_wp_error( $fields ) ) {
			return $fields;
		}

		$attachment_id = 0;

		if ( ! empty( $request->get_file_params()['attachment'] ) ) {
			$attachment_result = $this->handle_attachment( $request->get_file_params()['attachment'] );

			if ( is_wp_error( $attachment_result ) ) {
				return $attachment_result;
			}

			$attachment_id = $attachment_result;
		}

		$post_id = wp_insert_post(
			[
				'post_type'    => SupportTicket::NAME,
				'post_title'   => $fields['subject'],
				'post_content' => $fields['description'],
				'post_status'  => 'publish',
			],
			true
		);

		if ( is_wp_error( $post_id ) ) {
			return new WP_Error( 'auclair_ticket_create_failed', __( 'Could not create the ticket. Please try again.', 'auclair' ), [ 'status' => 500 ] );
		}

		wp_set_object_terms( $post_id, [ $fields['category_id'] ], HelpCategory::NAME );
		$this->assign_default_term( $post_id, TicketStatus::NAME, 'New' );
		$this->assign_default_term( $post_id, TicketPriority::NAME, 'Normal' );

		update_post_meta( $post_id, 'ticket_subject', $fields['subject'] );
		update_post_meta( $post_id, 'ticket_details', $fields['description'] );
		update_post_meta( $post_id, 'ticket_email', $fields['email'] );
		update_post_meta( $post_id, 'ticket_attachment', $attachment_id );
		update_post_meta( $post_id, 'source_url', esc_url_raw( $request->get_header( 'Referer' ) ?: '' ) );
		update_post_meta( $post_id, 'submitted_at', current_time( 'mysql' ) );
		update_post_meta( $post_id, 'user_agent', sanitize_text_field( $request->get_header( 'User-Agent' ) ?: '' ) );

		$this->send_notifications( $post_id, $fields );

		$token = wp_generate_password( 24, false );
		set_transient( 'auclair_ticket_token_' . $token, $post_id, self::TOKEN_TTL );

		return new WP_REST_Response(
			[
				'success'  => true,
				'redirect' => add_query_arg( 't', $token, home_url( '/ticket-submitted/' ) ),
			],
			200
		);
	}

	/**
	 * Enforce a per-IP submission rate limit.
	 *
	 * @return true|WP_Error
	 */
	protected function check_rate_limit() {
		$ip  = $this->get_client_ip();
		$key = 'auclair_ticket_rl_' . md5( $ip );

		$count = (int) get_transient( $key );

		if ( $count >= self::RATE_LIMIT_MAX ) {
			return new WP_Error( 'auclair_rate_limited', __( 'Too many tickets submitted. Please try again later.', 'auclair' ), [ 'status' => 429 ] );
		}

		set_transient( $key, $count + 1, self::RATE_LIMIT_WINDOW );

		return true;
	}

	/**
	 * Get the submitter's IP address.
	 *
	 * @return string
	 */
	protected function get_client_ip() {
		return isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : '0.0.0.0'; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.MissingUnslash -- unslashed above.
	}

	/**
	 * Validate and sanitise the submitted fields.
	 *
	 * @param WP_REST_Request $request The incoming request.
	 *
	 * @return array{category_id:int,subject:string,description:string,email:string}|WP_Error
	 */
	protected function validate_fields( WP_REST_Request $request ) {
		$category_id = absint( $request->get_param( 'category' ) );
		$subject     = sanitize_text_field( (string) $request->get_param( 'subject' ) );
		$description = sanitize_textarea_field( (string) $request->get_param( 'description' ) );
		$email       = sanitize_email( (string) $request->get_param( 'email' ) );

		$errors = new WP_Error();

		$term = $category_id ? get_term( $category_id, HelpCategory::NAME ) : null;

		if ( ! $category_id || ! $term || is_wp_error( $term ) ) {
			$errors->add( 'category', __( 'Please select a category.', 'auclair' ) );
		}

		if ( '' === $subject ) {
			$errors->add( 'subject', __( 'Subject is required.', 'auclair' ) );
		} elseif ( mb_strlen( $subject ) > 120 ) {
			$errors->add( 'subject', __( 'Subject must be 120 characters or fewer.', 'auclair' ) );
		}

		if ( '' === $description ) {
			$errors->add( 'description', __( 'Description is required.', 'auclair' ) );
		}

		if ( '' === $email || ! is_email( $email ) ) {
			$errors->add( 'email', __( 'A valid email address is required.', 'auclair' ) );
		}

		if ( $errors->has_errors() ) {
			return new WP_Error( 'auclair_ticket_invalid', __( 'Please fix the highlighted fields.', 'auclair' ), [ 'status' => 400, 'errors' => $errors->errors ] );
		}

		return [
			'category_id' => $category_id,
			'subject'     => $subject,
			'description' => $description,
			'email'       => $email,
		];
	}

	/**
	 * Validate and store the uploaded attachment.
	 *
	 * @param array $file The `$_FILES`-shaped array for the `attachment` field.
	 *
	 * @return int|WP_Error Attachment post ID, or an error.
	 */
	protected function handle_attachment( array $file ) {
		if ( ! in_array( $file['type'], self::ALLOWED_MIME_TYPES, true ) ) {
			return new WP_Error( 'auclair_ticket_bad_file_type', __( 'That file type is not supported.', 'auclair' ), [ 'status' => 400 ] );
		}

		if ( $file['size'] > self::MAX_UPLOAD_BYTES ) {
			return new WP_Error( 'auclair_ticket_file_too_large', __( 'That file is too large.', 'auclair' ), [ 'status' => 400 ] );
		}

		require_once ABSPATH . 'wp-admin/includes/file.php';
		require_once ABSPATH . 'wp-admin/includes/image.php';
		require_once ABSPATH . 'wp-admin/includes/media.php';

		$uploaded = wp_handle_upload( $file, [ 'test_form' => false ] );

		if ( ! empty( $uploaded['error'] ) ) {
			return new WP_Error( 'auclair_ticket_upload_failed', $uploaded['error'], [ 'status' => 500 ] );
		}

		$attachment_id = wp_insert_attachment(
			[
				'post_mime_type' => $uploaded['type'],
				'post_title'     => sanitize_file_name( basename( $uploaded['file'] ) ),
				'post_status'    => 'inherit',
			],
			$uploaded['file']
		);

		if ( is_wp_error( $attachment_id ) ) {
			return new WP_Error( 'auclair_ticket_attachment_failed', __( 'Could not process the attachment.', 'auclair' ), [ 'status' => 500 ] );
		}

		wp_update_attachment_metadata( $attachment_id, wp_generate_attachment_metadata( $attachment_id, $uploaded['file'] ) );

		return $attachment_id;
	}

	/**
	 * Assign a taxonomy term to a ticket by name, matching the seed terms
	 * created by `TicketStatus`/`TicketPriority`.
	 *
	 * @param int    $post_id  The ticket post ID.
	 * @param string $taxonomy Taxonomy name.
	 * @param string $name     Term name.
	 *
	 * @return void
	 */
	protected function assign_default_term( $post_id, $taxonomy, $name ) {
		$term = get_term_by( 'name', $name, $taxonomy );

		if ( $term && ! is_wp_error( $term ) ) {
			wp_set_object_terms( $post_id, [ $term->term_id ], $taxonomy );
		}
	}

	/**
	 * Email the support team and send an acknowledgement to the submitter.
	 *
	 * @param int   $post_id The ticket post ID.
	 * @param array $fields  Validated fields.
	 *
	 * @return void
	 */
	protected function send_notifications( $post_id, array $fields ) {
		$term         = get_term( $fields['category_id'], HelpCategory::NAME );
		$category_name = ( $term && ! is_wp_error( $term ) ) ? $term->name : '';

		$admin_body = sprintf(
			/* translators: 1: category, 2: email, 3: description, 4: edit link */
			__( "Category: %1\$s\nFrom: %2\$s\n\n%3\$s\n\nManage: %4\$s", 'auclair' ),
			$category_name,
			$fields['email'],
			$fields['description'],
			admin_url( 'post.php?post=' . $post_id . '&action=edit' )
		);

		wp_mail(
			get_option( 'admin_email' ),
			sprintf( /* translators: %s: ticket subject */ __( 'New support ticket: %s', 'auclair' ), $fields['subject'] ),
			$admin_body
		);

		$ack_body = sprintf(
			/* translators: %s: ticket subject */
			__( "Thanks for reaching out. We've received your ticket \"%s\" and our team will get back to you within 24 hours.", 'auclair' ),
			$fields['subject']
		);

		wp_mail( $fields['email'], __( "We've received your ticket", 'auclair' ), $ack_body );
	}
}
