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
<!-- wp:auclair/logo-bar {"align":"full","homeUrl":"/"} /-->

<!-- wp:auclair/breadcrumb {"showBack":false} /-->

<!-- wp:group {"style":{"spacing":{"blockGap":"16px","margin":{"top":"32px"}}},"layout":{"type":"flex","orientation":"vertical"}} -->
<div class="wp-block-group" style="display:flex;flex-direction:column;gap:16px;margin-top:32px">
	<!-- wp:heading {"level":1,"style":{"typography":{"fontSize":"var(--wp--preset--font-size--display)","fontWeight":"700"}}} -->
	<h1 class="wp-block-heading" style="font-size:var(--wp--preset--font-size--display);font-weight:700"><?php esc_html_e( 'Raise a ticket', 'auclair' ); ?></h1>
	<!-- /wp:heading -->

	<!-- wp:paragraph {"style":{"typography":{"fontSize":"16px","fontWeight":"400"},"color":{"text":"var(--wp--preset--color--foreground-primary)"}}} -->
	<p style="max-width:455px;font-size:16px;font-weight:400;color:var(--wp--preset--color--foreground-primary)"><?php esc_html_e( "Can't find the answer? Tell us what's going on and our team will get back to you within 24 hours.", 'auclair' ); ?></p>
	<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->

<!-- wp:auclair/ticket-form /-->
