<?php
/**
 * Title: Help Center Home
 * Slug: auclair-help-center/help-center-home
 * Description: The full Help Center landing page composition.
 * Categories: auclair
 *
 * @package AuclairHelpCenter
 */

?>
<!-- wp:auclair/logo-bar {"align":"full","homeUrl":"/help/"} /-->

<!-- wp:auclair/help-hero {"align":"full","eyebrow":"Help Center","heading":"How can we help you today?","subheading":"Search our guides, or browse by topic below."} -->
<div class="wp-block-auclair-help-hero auclair-help-hero alignfull">
	<div class="auclair-help-hero__glow"></div>
	<div class="auclair-help-hero__content">
		<span class="auclair-help-hero__eyebrow">Help Center</span>
		<h1 class="auclair-help-hero__heading">How can we help you today?</h1>
		<p class="auclair-help-hero__subheading">Search our guides, or browse by topic below.</p>

		<!-- wp:auclair/search-bar {"placeholder":"Search queries or topics"} -->
		<div class="wp-block-auclair-search-bar">
			<div class="auclair-search-bar" data-wp-interactive="auclair" data-wp-context="{&quot;action&quot;:&quot;\/?s=%s&amp;post_type=kb_article&quot;,&quot;liveSuggest&quot;:true}">
				<span class="auclair-search-bar__icon" aria-hidden="true">
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
				</span>
				<input type="text" class="auclair-search-bar__input" placeholder="Search queries or topics" data-wp-bind--value="state.searchQuery" data-wp-on--input="actions.setSearchQuery" data-wp-on--keydown="actions.handleSearchKeydown" aria-label="Search for help" />
				<ul class="auclair-search-bar__suggestions" hidden data-wp-bind--hidden="!state.hasSuggestions">
					<template data-wp-each--item="state.suggestions">
						<li><a data-wp-bind--href="context.item.url" data-wp-text="context.item.title"></a></li>
					</template>
				</ul>
			</div>
		</div>
		<!-- /wp:auclair/search-bar -->

		<!-- wp:auclair/quick-help-chips {"label":"Top Searches:","source":"popular","limit":3} /-->
	</div>
</div>
<!-- /wp:auclair/help-hero -->

<!-- wp:auclair/section-heading {"title":"Quick help"} -->
<div class="wp-block-auclair-section-heading auclair-section-heading has-text-align-left">
	<h2 class="auclair-section-heading__title">Quick help</h2>
</div>
<!-- /wp:auclair/section-heading -->

<!-- wp:auclair/top-queries {"source":"most-viewed","limit":4} /-->

<!-- wp:auclair/section-heading {"title":"Browse by category"} -->
<div class="wp-block-auclair-section-heading auclair-section-heading has-text-align-left">
	<h2 class="auclair-section-heading__title">Browse by category</h2>
</div>
<!-- /wp:auclair/section-heading -->

<!-- wp:auclair/category-grid {"columns":4,"showCount":true} /-->

<!-- wp:auclair/section-heading {"title":"Top queries","subtitle":"The most-read guides across all topics."} -->
<div class="wp-block-auclair-section-heading auclair-section-heading has-text-align-left">
	<h2 class="auclair-section-heading__title">Top queries</h2>
	<p class="auclair-section-heading__subtitle">The most-read guides across all topics.</p>
</div>
<!-- /wp:auclair/section-heading -->

<!-- wp:auclair/top-queries {"source":"sticky","limit":10} /-->

<!-- wp:auclair/cta-banner {"heading":"Still need help?","body":"Our support team is available 7 days a week. Raise a ticket and we will follow up asap.","buttonLabel":"Raise A Ticket","buttonUrl":"/help/raise-a-ticket/","accent":"#E9CA75"} -->
<div class="wp-block-auclair-cta-banner auclair-cta-banner auclair-ring-hover" style="--auclair-ring-accent:#E9CA75;--auclair-ring-from:140deg;--auclair-ring-gap-in:24deg;--auclair-ring-solid-start:90deg;--auclair-ring-solid-end:195deg;--auclair-ring-gap-out:250deg;--auclair-ring-lift:0px">
	<span class="auclair-icon-tile is-large" style="--auclair-icon-accent:#E9CA75">
		<span class="auclair-icon-tile__glow"></span>
		<span class="auclair-icon-tile__icon">
			<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9.5"></circle><path d="M9.5 9.2a2.5 2.5 0 1 1 3.7 2.2c-.9.5-1.2.9-1.2 1.8"></path><line x1="12" y1="16.5" x2="12" y2="16.6"></line></svg>
		</span>
	</span>
	<div class="auclair-cta-banner__body">
		<h2 class="auclair-cta-banner__heading">Still need help?</h2>
		<p class="auclair-cta-banner__text">Our support team is available 7 days a week. Raise a ticket and we will follow up asap.</p>
	</div>
	<a class="auclair-button is-primary auclair-cta-banner__button" href="/help/raise-a-ticket/">Raise A Ticket</a>
</div>
<!-- /wp:auclair/cta-banner -->
