<?php
/**
 * Title: Category Page
 * Slug: auclair-help-center/category-page
 * Description: The full Help Center category page composition.
 * Categories: auclair
 *
 * @package AuclairHelpCenter
 */

?>
<!-- wp:auclair/logo-bar {"align":"full","homeUrl":"/help/"} /-->

<!-- wp:auclair/breadcrumb {"showBack":false} /-->

<!-- wp:auclair/category-header /-->

<!-- wp:auclair/divider -->
<hr class="wp-block-auclair-divider auclair-divider"/>
<!-- /wp:auclair/divider -->

<!-- wp:auclair/article-group /-->

<!-- wp:auclair/section-heading {"title":"Related categories"} -->
<div class="wp-block-auclair-section-heading auclair-section-heading has-text-align-left">
	<h2 class="auclair-section-heading__title">Related categories</h2>
</div>
<!-- /wp:auclair/section-heading -->

<!-- wp:auclair/related-categories /-->

<!-- wp:auclair/cta-banner {"heading":"Still need help?","body":"Our support team is available 7 days a week. Raise a ticket and we will follow up asap.","buttonLabel":"Raise a ticket","buttonUrl":"/help/raise-a-ticket/","accent":"#E9CA75"} -->
<div class="wp-block-auclair-cta-banner">
	<div class="auclair-cta-banner auclair-ring-hover" style="--auclair-ring-accent:#E9CA75">
		<span class="auclair-icon-tile is-large" style="--auclair-icon-accent:#E9CA75">
			<span class="auclair-icon-tile__glow"></span>
			<span class="auclair-icon-tile__icon">
				<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9.5"/><path d="M9.5 9.2a2.5 2.5 0 1 1 3.7 2.2c-.9.5-1.2.9-1.2 1.8"/><line x1="12" y1="16.5" x2="12" y2="16.6"/></svg>
			</span>
		</span>
		<div class="auclair-cta-banner__body">
			<h2 class="auclair-cta-banner__heading">Still need help?</h2>
			<p class="auclair-cta-banner__text">Our support team is available 7 days a week. Raise a ticket and we will follow up asap.</p>
		</div>
		<a class="auclair-button is-primary auclair-cta-banner__button" href="/help/raise-a-ticket/">Raise a ticket</a>
	</div>
</div>
<!-- /wp:auclair/cta-banner -->
