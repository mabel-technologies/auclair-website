<?php
/**
 * Title: Ticket Submitted Page
 * Slug: auclair-help-center/ticket-submitted-page
 * Description: Confirmation screen shown after a support ticket is submitted.
 * Categories: auclair
 *
 * @package AuclairHelpCenter
 */

?>
<!-- wp:auclair/logo-bar {"align":"full","homeUrl":"/"} /-->

<!-- wp:group {"className":"auclair-ticket-submitted","layout":{"type":"flex","orientation":"vertical"}} -->
<div class="wp-block-group auclair-ticket-submitted">
	<span class="auclair-ticket-submitted__check" aria-hidden="true">
		<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12.5L9.5 17L19 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
	</span>

	<!-- wp:heading {"level":1} -->
	<h1 class="wp-block-heading auclair-ticket-submitted__title"><?php esc_html_e( 'Ticket submitted', 'auclair' ); ?></h1>
	<!-- /wp:heading -->

	<!-- wp:paragraph -->
	<p class="auclair-ticket-submitted__text"><?php esc_html_e( "We've received your request and our support team will follow up by email within 24 hours.", 'auclair' ); ?></p>
	<!-- /wp:paragraph -->

	<!-- wp:auclair/button {"label":"Back to Help Center","href":"/","variant":"primary","fullWidthMobile":true} -->
	<a class="auclair-button is-primary is-full-width-mobile" href="/"><?php esc_html_e( 'Back to Help Center', 'auclair' ); ?></a>
	<!-- /wp:auclair/button -->
</div>
<!-- /wp:group -->
