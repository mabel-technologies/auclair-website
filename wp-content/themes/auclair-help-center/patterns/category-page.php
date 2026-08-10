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
<div class="wp-block-auclair-cta-banner auclair-cta-banner auclair-ring-hover" style="--auclair-ring-accent:#E9CA75;--auclair-ring-from:140deg;--auclair-ring-gap-in:24deg;--auclair-ring-solid-start:90deg;--auclair-ring-solid-end:195deg;--auclair-ring-gap-out:250deg;--auclair-ring-lift:0px">
	<span class="auclair-icon-tile is-large" style="--auclair-icon-accent:#E9CA75">
		<span class="auclair-icon-tile__glow"></span>
		<span class="auclair-icon-tile__icon">
			<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9.5"></circle><circle cx="12" cy="12" r="4"></circle><line x1="5.1" y1="5.1" x2="9.2" y2="9.2"></line><line x1="14.8" y1="14.8" x2="18.9" y2="18.9"></line><line x1="18.9" y1="5.1" x2="14.8" y2="9.2"></line><line x1="9.2" y1="14.8" x2="5.1" y2="18.9"></line></svg>
		</span>
	</span>
	<div class="auclair-cta-banner__body">
		<h2 class="auclair-cta-banner__heading">Still need help?</h2>
		<p class="auclair-cta-banner__text">Our support team is available 7 days a week. Raise a ticket and we will follow up asap.</p>
	</div>
	<a class="auclair-button is-primary auclair-cta-banner__button" href="/help/raise-a-ticket/">Raise a ticket</a>
</div>
<!-- /wp:auclair/cta-banner -->
