<?php
/**
 * Template Tags
 *
 * @package AuclairHelpCenter
 *
 * This file contains **only** pure functions that relate to templating.
 *
 * Rules:
 * - Functions in this file **must be pure** (i.e., they must not cause side effects).
 * - No hooks, filters, or global state modifications should be added here.
 * - If a function has side effects (e.g., enqueuing scripts, modifying post data, adding filters),
 *   it should be encapsulated within a class in the `src/` directory.
 *
 * A pure function:
 * - Given the same input, it always returns the same output.
 * - Does not modify external state (no global variables, no database writes, etc.).
 * - Does not rely on WordPress hooks or filters.
 *
 * Example of an allowed function:
 * ```php
 * function get_custom_excerpt( string $content, int $length = 50 ): string {
 *     return wp_trim_words( $content, $length );
 * }
 * ```
 *
 * Example of a function **that does not belong here**:
 * ```php
 * function modify_post_title( string $title ): string {
 *     return 'My Great ' . $title;
 * }
 * add_filter( 'the_title', 'modify_post_title' );
 * ```
 *
 * Keeping this file limited to pure functions ensures maintainability and a clear separation of concerns.
 */

namespace AuclairHelpCenter;

/**
 * A small curated set of inline, stroke-based line icons shared across
 * blocks (category cards, hero, ticket form, breadcrumb, etc.). Returns raw
 * SVG markup — callers are responsible for escaping/allowing it via
 * wp_kses_post() or printing it directly in trusted template context.
 *
 * @param string $key  Icon identifier.
 * @param int    $size Icon square size in pixels.
 *
 * @return string
 */
function get_icon_svg( string $key, int $size = 24 ): string {
	$paths = [
		'search'       => '<circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
		'chevron-right' => '<polyline points="9 18 15 12 9 6"/>',
		'chevron-left'  => '<polyline points="15 18 9 12 15 6"/>',
		'chevron-down'  => '<polyline points="6 9 12 15 18 9"/>',
		'close'         => '<line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/>',
		'rocket'        => '<path d="M12 2c2.5 2 4 5.5 4 9 0 2-1 3.8-2 5l-2 2-2-2c-1-1.2-2-3-2-5 0-3.5 1.5-7 4-9z"/><circle cx="12" cy="10" r="1.5"/><path d="M8.5 15.5 6 18l1-3.5M15.5 15.5 18 18l-1-3.5"/>',
		'credit-card'   => '<rect x="2.5" y="5.5" width="19" height="13" rx="2"/><line x1="2.5" y1="10" x2="21.5" y2="10"/>',
		'headphones'    => '<path d="M4 13v-1a8 8 0 0 1 16 0v1"/><rect x="2.5" y="13" width="4" height="6" rx="1.5"/><rect x="17.5" y="13" width="4" height="6" rx="1.5"/>',
		'ear'           => '<path d="M8 12a5 5 0 0 1 5-5 5 5 0 0 1 5 5c0 2.5-2 3-2 5.5a2.5 2.5 0 0 1-5 0"/><path d="M8 12c0 3 1.5 4.5 1.5 7"/>',
		'compass'       => '<circle cx="12" cy="12" r="9.5"/><polygon points="15 9 13 13 9 15 11 11 15 9"/>',
		'users'         => '<circle cx="9" cy="8" r="3.2"/><path d="M2.5 19c0-3.3 3-5.5 6.5-5.5s6.5 2.2 6.5 5.5"/><circle cx="17" cy="9" r="2.5"/><path d="M15.5 13.8c2.6.5 4.5 2.4 4.5 5.2"/>',
		'mic'           => '<rect x="9" y="2.5" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0"/><line x1="12" y1="17.5" x2="12" y2="21.5"/><line x1="8.5" y1="21.5" x2="15.5" y2="21.5"/>',
		'user-star'     => '<circle cx="12" cy="8.5" r="4"/><path d="M4.5 20.5c0-3.9 3.4-6.5 7.5-6.5 1 0 1.9.15 2.8.43"/><path d="M19 13.8l1 2 2.2.3-1.6 1.5.4 2.2-2-1.05-2 1.05.4-2.2-1.6-1.5 2.2-.3z"/>',
		'question-circle' => '<circle cx="12" cy="12" r="9.5"/><path d="M9.5 9.2a2.5 2.5 0 1 1 3.7 2.2c-.9.5-1.2.9-1.2 1.8"/><line x1="12" y1="16.5" x2="12" y2="16.6"/>',
		'shield'        => '<path d="M12 2.5 20 6v6c0 5-3.5 8-8 9.5-4.5-1.5-8-4.5-8-9.5V6z"/><polyline points="9 12 11 14 15 9.5"/>',
		'life-buoy'     => '<circle cx="12" cy="12" r="9.5"/><circle cx="12" cy="12" r="4"/><line x1="5.1" y1="5.1" x2="9.2" y2="9.2"/><line x1="14.8" y1="14.8" x2="18.9" y2="18.9"/><line x1="18.9" y1="5.1" x2="14.8" y2="9.2"/><line x1="9.2" y1="14.8" x2="5.1" y2="18.9"/>',
		'check-circle'  => '<circle cx="12" cy="12" r="9.5"/><polyline points="7.5 12.5 10.5 15.5 16.5 9"/>',
		'paperclip'     => '<path d="M17.5 8.5 9.9 16a3 3 0 1 1-4.2-4.2L14 3.4a2 2 0 0 1 2.8 2.8L8.4 14.6a1 1 0 0 1-1.4-1.4l7-7"/>',
	];

	if ( ! isset( $paths[ $key ] ) ) {
		return '';
	}

	return sprintf(
		'<svg width="%1$d" height="%1$d" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">%2$s</svg>',
		$size,
		$paths[ $key ]
	);
}

/**
 * Get the URL of the Help Center home page.
 *
 * The Help Center is the whole site here (it used to be a `/help/`
 * subsection), so its home is simply the site root.
 *
 * @return string
 */
function get_help_home_url(): string {
	return home_url( '/' );
}

/**
 * Render an icon-tile: a rounded icon square with an accent glow behind it,
 * matching the `auclair/icon-tile` block's markup. Used both by that block's
 * save output and by dynamic blocks (e.g. category-card) that need to
 * reproduce the same markup server-side.
 *
 * @param string $icon   Icon identifier, see get_icon_svg().
 * @param string $accent Hex accent colour.
 * @param string $size   'default' or 'large'.
 *
 * @return string
 */
function render_icon_tile( string $icon, string $accent, string $size = 'default' ): string {
	return sprintf(
		'<span class="auclair-icon-tile is-%1$s" style="--auclair-icon-accent:%2$s;"><span class="auclair-icon-tile__glow"></span><span class="auclair-icon-tile__icon">%3$s</span></span>',
		esc_attr( $size ),
		esc_attr( $accent ),
		get_icon_svg( $icon, 'large' === $size ? 32 : 24 )
	);
}

/**
 * The thumbs-up / thumbs-down icons used by `auclair/article-feedback`.
 * Kept separate from get_icon_svg()'s curated set because the prototype's
 * source paths are drawn on a 20x20 viewBox, not the 24x24 one every other
 * icon in that set shares.
 *
 * @param string $direction 'up' or 'down'.
 * @param int    $size      Icon square size in pixels.
 *
 * @return string
 */
function get_thumb_icon_svg( string $direction, int $size = 20 ): string {
	$paths = [
		'up'   => '<path d="M5.83317 16.6666L2.49983 16.6666C2.0396 16.6666 1.6665 16.2935 1.6665 15.8333V9.16663C1.6665 8.70639 2.0396 8.33329 2.49984 8.33329H5.83317" stroke-linecap="round"/><path d="M14.9566 16.6666H5.8335V8.33329L11.5966 2.49996L11.6558 2.55979C12.8602 3.77888 13.1984 5.62286 12.5067 7.19831L12.0083 8.33329H16.6855C17.8198 8.33329 18.6144 9.46692 18.2397 10.5505L16.5108 15.5505C16.2796 16.219 15.6563 16.6666 14.9566 16.6666Z"/>',
		'down' => '<path d="M5.83317 2.49992L2.49983 2.49993C2.0396 2.49993 1.6665 2.87303 1.6665 3.33327V9.99992C1.6665 10.4602 2.0396 10.8333 2.49984 10.8333H5.83317" stroke-linecap="round"/><path d="M14.9561 2.49996H5.83301V10.8333L11.5962 16.6666L11.6553 16.6068C12.8597 15.3877 13.1979 13.5437 12.5062 11.9683L12.0078 10.8333H16.685C17.8193 10.8333 18.6139 9.69967 18.2392 8.61604L16.5103 3.61604C16.2791 2.94756 15.6558 2.49996 14.9561 2.49996Z"/>',
	];

	if ( ! isset( $paths[ $direction ] ) ) {
		return '';
	}

	return sprintf(
		'<svg width="%1$d" height="%1$d" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" aria-hidden="true" focusable="false">%2$s</svg>',
		$size,
		$paths[ $direction ]
	);
}
