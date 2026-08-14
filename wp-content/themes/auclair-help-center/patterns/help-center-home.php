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
<!-- wp:auclair/logo-bar {"align":"full","homeUrl":"/"} /-->

<!-- wp:auclair/help-hero {"align":"full","eyebrow":"Help Center","heading":"How can we help you today?","subheading":"Search our guides, or browse by topic below."} -->
<div class="wp-block-auclair-help-hero auclair-help-hero alignfull">
	<div class="auclair-help-hero__glow"></div>
	<div class="auclair-help-hero__rings" aria-hidden="true">
		<span class="auclair-help-hero__ring auclair-help-hero__ring--1"></span>
		<span class="auclair-help-hero__ring auclair-help-hero__ring--2"></span>
		<span class="auclair-help-hero__ring auclair-help-hero__ring--3"></span>
	</div>
	<div class="auclair-help-hero__content">
		<span class="auclair-help-hero__eyebrow">Help Center</span>
		<h1 class="auclair-help-hero__heading">How can we help you today?</h1>
		<p class="auclair-help-hero__subheading">Search our guides, or browse by topic below.</p>

		<!-- wp:auclair/search-bar {"placeholder":"Search queries or topics"} /-->

		<!-- wp:auclair/quick-help-chips {"label":"Top Searches:","source":"popular","limit":3} /-->
	</div>
</div>
<!-- /wp:auclair/help-hero -->

<!-- wp:auclair/section-heading {"title":"Quick help"} -->
<div class="wp-block-auclair-section-heading auclair-section-heading has-text-align-left">
	<h2 class="auclair-section-heading__title">Quick help</h2>
</div>
<!-- /wp:auclair/section-heading -->

<!-- wp:auclair/top-queries {"source":"most-viewed","limit":4,"boxed":true} /-->

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

<!-- wp:auclair/cta-banner {"heading":"Still need help?","body":"Our support team is available 7 days a week.\nRaise a ticket and we will follow up asap.","buttonLabel":"Raise A Ticket","buttonUrl":"/raise-a-ticket/","accent":"#E9CA75"} -->
<div class="wp-block-auclair-cta-banner auclair-cta-banner auclair-ring-hover" style="--auclair-ring-accent:#E9CA75;--auclair-ring-from:140deg;--auclair-ring-gap-in:24deg;--auclair-ring-solid-start:90deg;--auclair-ring-solid-end:195deg;--auclair-ring-gap-out:250deg;--auclair-ring-lift:0px">
	<span class="auclair-icon-tile is-large" style="--auclair-icon-accent:#E9CA75">
		<span class="auclair-icon-tile__glow"></span>
		<span class="auclair-icon-tile__icon">
			<svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.375 16.5V17.0156M12.375 13.9219V13.4062L14.1051 10.811C14.3219 10.486 14.4375 10.104 14.4375 9.71332C14.4375 8.56944 13.4832 7.73438 12.375 7.73438C11.2359 7.73438 10.3125 8.65779 10.3125 9.79687" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12.375 22.6875C18.0704 22.6875 22.6875 18.0704 22.6875 12.375C22.6875 6.67956 18.0704 2.0625 12.375 2.0625C6.67956 2.0625 2.0625 6.67956 2.0625 12.375C2.0625 14.0001 2.47719 15.4081 3.15993 16.7317C3.42766 17.2507 3.51358 17.8506 3.34577 18.4099L2.79626 20.2416C2.48161 21.2905 3.45952 22.2684 4.50838 21.9537L6.34006 21.4042C6.89943 21.2364 7.49932 21.3223 8.01834 21.5901C9.34188 22.2728 10.7499 22.6875 12.375 22.6875Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
		</span>
	</span>
	<div class="auclair-cta-banner__body">
		<h2 class="auclair-cta-banner__heading">Still need help?</h2>
		<p class="auclair-cta-banner__text">Our support team is available 7 days a week.
Raise a ticket and we will follow up asap.</p>
	</div>
	<a class="auclair-button is-primary auclair-cta-banner__button" href="/raise-a-ticket/">Raise A Ticket</a>
</div>
<!-- /wp:auclair/cta-banner -->
