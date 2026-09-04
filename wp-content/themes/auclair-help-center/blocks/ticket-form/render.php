<?php
/**
 * Ticket Form block render.
 *
 * @package AuclairHelpCenter
 *
 * @var array $attributes Block attributes.
 */

use AuclairCore\Taxonomies\HelpCategory;
use AuclairCore\Rest\TicketEndpoint;

$success_url    = ! empty( $attributes['successUrl'] ) ? $attributes['successUrl'] : '/ticket-submitted/';
$max_upload_mb  = ! empty( $attributes['maxUploadMb'] ) ? (float) $attributes['maxUploadMb'] : 5;
$allowed_types  = ! empty( $attributes['allowedTypes'] ) ? (array) $attributes['allowedTypes'] : [ 'image/png', 'image/jpeg', 'image/webp', 'application/pdf' ];

$terms = HelpCategory::ordered_terms(
	[
		'taxonomy'   => HelpCategory::NAME,
		'hide_empty' => false,
		/*
		 * `in_ticket_form` is registered with a default of true, so a term
		 * that has no row yet belongs in the dropdown — an `=` clause on its
		 * own would exclude it.
		 */
		'meta_query' => [ // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query -- small, seeded taxonomy.
			'relation' => 'OR',
			[
				'key'     => 'in_ticket_form',
				'value'   => '1',
				'compare' => '=',
			],
			[
				'key'     => 'in_ticket_form',
				'compare' => 'NOT EXISTS',
			],
		],
	]
);

if ( is_wp_error( $terms ) ) {
	$terms = [];
}

$categories = array_map(
	static function ( $term ) {
		return [
			'id'    => $term->term_id,
			'label' => $term->name,
			'slug'  => $term->slug,
		];
	},
	$terms
);

$default_category = ! empty( $attributes['defaultCategory'] ) ? (int) $attributes['defaultCategory'] : 0;

if ( ! empty( $_GET['category'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- read-only pre-fill, no state change.
	$requested = sanitize_text_field( wp_unslash( $_GET['category'] ) ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- read-only pre-fill.

	foreach ( $categories as $category ) {
		if ( (string) $category['id'] === $requested || $category['slug'] === $requested ) {
			$default_category = $category['id'];
			break;
		}
	}
}

$selected_label = __( 'Select a query', 'auclair' );

foreach ( $categories as $category ) {
	if ( $category['id'] === $default_category ) {
		$selected_label = $category['label'];
		break;
	}
}

$context = [
	'categories'            => $categories,
	'categoryId'            => $default_category,
	'categoryLabel'         => $selected_label,
	'categoryOpen'          => false,
	'subject'               => '',
	'description'           => '',
	'email'                 => '',
	'website'               => '',
	'fileName'              => '',
	'attachmentPlaceholder' => __( 'Attach a screenshot', 'auclair' ),
	'errors'                => new stdClass(),
	'submitting'            => false,
	'submitError'           => '',
	'nonce'                 => wp_create_nonce( 'wp_rest' ),
	'endpoint'              => esc_url_raw( rest_url( 'auclair/v1/ticket' ) ),
	'successUrl'            => esc_url_raw( $success_url ),
	'maxUploadBytes'        => (int) ( $max_upload_mb * 1024 * 1024 ),
	'allowedTypes'          => $allowed_types,
	'subjectMax'            => TicketEndpoint::SUBJECT_MAX,
	'descriptionMin'        => TicketEndpoint::DESCRIPTION_MIN,
	'touched'               => new stdClass(),
];

$wrapper_attributes = get_block_wrapper_attributes( [ 'class' => 'auclair-ticket-form' ] );
?>
<form
	<?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- pre-escaped. ?>
	data-wp-interactive="auclair"
	data-wp-context="<?php echo esc_attr( wp_json_encode( $context ) ); ?>"
	data-wp-on--submit="actions.submitTicket"
	novalidate
>
	<div class="auclair-ticket-form__field">
		<label class="auclair-ticket-form__label" id="auclair-ticket-category-label"><?php esc_html_e( 'Category', 'auclair' ); ?></label>
		<div class="auclair-ticket-form__select" data-wp-class--is-open="context.categoryOpen">
			<button
				type="button"
				class="auclair-ticket-form__select-trigger"
				aria-haspopup="listbox"
				aria-expanded="false"
				aria-labelledby="auclair-ticket-category-label"
				data-wp-bind--aria-expanded="context.categoryOpen"
				data-wp-on--click="actions.toggleCategory"
				data-wp-on-document--click="actions.closeCategoryOnOutsideClick"
				data-wp-on-window--keydown="actions.closeCategoryOnEscape"
			>
				<span class="<?php echo $default_category ? '' : 'is-placeholder'; ?>" data-wp-class--is-placeholder="!context.categoryId" data-wp-text="context.categoryLabel"><?php echo esc_html( $selected_label ); ?></span>
				<?php echo AuclairHelpCenter\get_icon_svg( 'chevron-down', 20 ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- trusted, static icon markup. ?>
			</button>
			<ul class="auclair-ticket-form__select-list" role="listbox" hidden data-wp-bind--hidden="!context.categoryOpen">
				<?php foreach ( $categories as $category ) : ?>
					<li
						role="option"
						data-wp-context="<?php echo esc_attr( wp_json_encode( [ 'categoryOptionId' => $category['id'], 'categoryOptionLabel' => $category['label'] ] ) ); ?>"
					>
						<button
							type="button"
							class="auclair-ticket-form__select-option"
							aria-selected="<?php echo $category['id'] === $default_category ? 'true' : 'false'; ?>"
							data-wp-bind--aria-selected="state.isSelectedCategory"
							data-wp-on--click="actions.selectCategory"
						>
							<span><?php echo esc_html( $category['label'] ); ?></span>
						</button>
					</li>
				<?php endforeach; ?>
			</ul>
		</div>
		<span class="auclair-ticket-form__error" hidden data-wp-text="context.errors.category" data-wp-bind--hidden="!context.errors.category"></span>
	</div>

	<div class="auclair-ticket-form__honeypot" aria-hidden="true">
		<label for="auclair-ticket-website"><?php esc_html_e( 'Leave this field empty', 'auclair' ); ?></label>
		<input
			type="text"
			id="auclair-ticket-website"
			name="website"
			tabindex="-1"
			autocomplete="off"
			data-wp-bind--value="context.website"
			data-wp-on--input="actions.setWebsite"
		/>
	</div>

	<div class="auclair-ticket-form__field">
		<label class="auclair-ticket-form__label" for="auclair-ticket-subject"><?php esc_html_e( 'Subject', 'auclair' ); ?></label>
		<div class="auclair-ticket-form__control">
			<input
				type="text"
				id="auclair-ticket-subject"
				maxlength="<?php echo esc_attr( (string) TicketEndpoint::SUBJECT_MAX ); ?>"
				placeholder="<?php esc_attr_e( 'Briefly describe the issue', 'auclair' ); ?>"
				data-wp-bind--value="context.subject"
				data-wp-on--input="actions.setSubject"
				data-wp-on--blur="actions.blurSubject"
			/>
		</div>
		<div class="auclair-ticket-form__field-foot">
			<span class="auclair-ticket-form__error" hidden data-wp-text="context.errors.subject" data-wp-bind--hidden="!context.errors.subject"></span>
			<span class="auclair-ticket-form__count" aria-hidden="true" data-wp-text="state.subjectCount">0/<?php echo esc_html( (string) TicketEndpoint::SUBJECT_MAX ); ?></span>
		</div>
	</div>

	<div class="auclair-ticket-form__field">
		<label class="auclair-ticket-form__label" for="auclair-ticket-description"><?php esc_html_e( 'Description', 'auclair' ); ?></label>
		<div class="auclair-ticket-form__control auclair-ticket-form__control--textarea">
			<textarea
				id="auclair-ticket-description"
				minlength="<?php echo esc_attr( (string) TicketEndpoint::DESCRIPTION_MIN ); ?>"
				placeholder="<?php esc_attr_e( 'Add any details that will help us assist you faster', 'auclair' ); ?>"
				data-wp-bind--value="context.description"
				data-wp-on--input="actions.setDescription"
				data-wp-on--blur="actions.blurDescription"
			></textarea>
		</div>
		<span class="auclair-ticket-form__error" hidden data-wp-text="context.errors.description" data-wp-bind--hidden="!context.errors.description"></span>
	</div>

	<div class="auclair-ticket-form__row">
		<div class="auclair-ticket-form__field">
			<label class="auclair-ticket-form__label" for="auclair-ticket-email"><?php esc_html_e( 'Email', 'auclair' ); ?></label>
			<div class="auclair-ticket-form__control">
				<input
					type="email"
					id="auclair-ticket-email"
					placeholder="<?php esc_attr_e( 'Enter your email', 'auclair' ); ?>"
					data-wp-bind--value="context.email"
					data-wp-on--input="actions.setEmail"
					data-wp-on--blur="actions.blurEmail"
				/>
			</div>
			<span class="auclair-ticket-form__error" hidden data-wp-text="context.errors.email" data-wp-bind--hidden="!context.errors.email"></span>
		</div>

		<div class="auclair-ticket-form__field">
			<label class="auclair-ticket-form__label" id="auclair-ticket-attachment-label"><?php esc_html_e( 'Attachment (optional)', 'auclair' ); ?></label>
			<div class="auclair-ticket-form__control auclair-ticket-form__attachment" data-wp-on--click="actions.openFilePicker">
				<?php echo AuclairHelpCenter\get_icon_svg( 'paperclip', 20 ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- trusted, static icon markup. ?>
				<span class="is-placeholder" data-wp-class--is-placeholder="!context.fileName" data-wp-text="state.attachmentLabel"><?php echo esc_html( $context['attachmentPlaceholder'] ); ?></span>
				<input
					type="file"
					class="auclair-ticket-form__file-input"
					aria-labelledby="auclair-ticket-attachment-label"
					accept="<?php echo esc_attr( implode( ',', $allowed_types ) ); ?>"
					data-wp-on--change="actions.setFile"
				/>
			</div>
			<span class="auclair-ticket-form__error" hidden data-wp-text="context.errors.attachment" data-wp-bind--hidden="!context.errors.attachment"></span>
		</div>
	</div>

	<span class="auclair-ticket-form__submit-error" hidden data-wp-text="context.submitError" data-wp-bind--hidden="!context.submitError"></span>

	<button type="submit" class="auclair-ticket-form__submit" data-wp-bind--disabled="context.submitting">
		<span data-wp-bind--hidden="context.submitting"><?php esc_html_e( 'Submit Ticket', 'auclair' ); ?></span>
		<span class="auclair-ticket-form__spinner" hidden data-wp-bind--hidden="!context.submitting" aria-hidden="true"></span>
	</button>
</form>
<p class="auclair-ticket-form__helper"><?php esc_html_e( "We'll email updates to the address on your account", 'auclair' ); ?></p>
