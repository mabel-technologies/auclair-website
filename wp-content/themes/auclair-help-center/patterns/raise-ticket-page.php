<?php
/**
 * Title: Raise Ticket Page
 * Slug: auclair-help-center/raise-ticket-page
 * Description: The full Help Center "Raise a ticket" page composition.
 * Categories: auclair
 *
 * @package AuclairHelpCenter
 */

?>
<!-- wp:auclair/logo-bar {"align":"full","homeUrl":"/help/"} /-->

<!-- wp:auclair/breadcrumb {"showBack":false} /-->

<!-- wp:group {"className":"auclair-ticket-page-header","style":{"spacing":{"blockGap":"16px","margin":{"top":"32px"}}},"layout":{"type":"flex","orientation":"vertical"}} -->
<div class="wp-block-group auclair-ticket-page-header" style="display:flex;flex-direction:column;gap:16px;margin-top:32px">
	<!-- wp:heading {"level":1} -->
	<h1 class="wp-block-heading auclair-ticket-page-header__title"><?php esc_html_e( 'Raise a ticket', 'auclair' ); ?></h1>
	<!-- /wp:heading -->

	<!-- wp:paragraph -->
	<p class="auclair-ticket-page-header__intro"><?php esc_html_e( "Can't find the answer? Tell us what's going on and our team will get back to you within 24 hours.", 'auclair' ); ?></p>
	<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->

<!-- wp:auclair/ticket-form /-->
