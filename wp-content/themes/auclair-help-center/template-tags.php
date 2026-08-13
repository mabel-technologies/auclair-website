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
 * Figma-exported category icons in assets/svg/. Legacy term-meta keys
 * (ear, compass, users, …) map onto the exported filenames.
 *
 * @var array<string, string>
 */
function get_file_icon_map(): array {
	return [
		'rocket'          => 'rocket.svg',
		'credit-card'     => 'credit-card.svg',
		'headphones'      => 'headphones.svg',
		'ear'             => 'right-ear.svg',
		'right-ear'       => 'right-ear.svg',
		'compass'         => 'discover-circle.svg',
		'discover-circle' => 'discover-circle.svg',
		'users'           => 'user-group.svg',
		'user-group'      => 'user-group.svg',
		'user-star'       => 'user-star-01.svg',
		'user-star-01'    => 'user-star-01.svg',
		'shield'          => 'shield-02.svg',
		'shield-02'       => 'shield-02.svg',
	];
}

/**
 * Load a theme SVG, scale it, and stamp a11y attrs. Returns empty string if
 * the file is missing. Paths use currentColor so the parent accent tints them.
 *
 * @param string $filename SVG filename under assets/svg/.
 * @param int    $size     Icon square size in pixels.
 *
 * @return string
 */
function load_theme_svg( string $filename, int $size ): string {
	$path = get_theme_file_path( 'assets/svg/' . $filename );
	if ( ! $path || ! is_readable( $path ) ) {
		return '';
	}

	$svg = file_get_contents( $path );
	if ( false === $svg ) {
		return '';
	}

	$svg = preg_replace( '/\swidth="[^"]*"/', ' width="' . $size . '"', $svg, 1 ) ?? $svg;
	$svg = preg_replace( '/\sheight="[^"]*"/', ' height="' . $size . '"', $svg, 1 ) ?? $svg;

	if ( ! str_contains( $svg, 'aria-hidden' ) ) {
		$svg = preg_replace( '/<svg\b/', '<svg aria-hidden="true" focusable="false"', $svg, 1 ) ?? $svg;
	}

	return $svg;
}

/**
 * A small curated set of stroke icons shared across blocks (category cards,
 * hero, ticket form, breadcrumb, etc.). Category glyphs prefer the Figma
 * SVGs in assets/svg/; everything else is an inline 24×24 path. Returns raw
 * SVG markup — callers print it in trusted template context.
 *
 * @param string $key  Icon identifier.
 * @param int    $size Icon square size in pixels.
 *
 * @return string
 */
function get_icon_svg( string $key, int $size = 24 ): string {
	$file_icons = get_file_icon_map();
	if ( isset( $file_icons[ $key ] ) ) {
		$from_file = load_theme_svg( $file_icons[ $key ], $size );
		if ( '' !== $from_file ) {
			return $from_file;
		}
	}

	$paths = [
		'search'          => '<circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
		'chevron-right'   => '<polyline points="9 18 15 12 9 6"/>',
		'chevron-left'    => '<polyline points="15 18 9 12 15 6"/>',
		'chevron-down'    => '<polyline points="6 9 12 15 18 9"/>',
		'close'           => '<line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/>',
		'mic'             => '<rect x="9" y="2.5" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0"/><line x1="12" y1="17.5" x2="12" y2="21.5"/><line x1="8.5" y1="21.5" x2="15.5" y2="21.5"/>',
		'question-circle' => '<circle cx="12" cy="12" r="9.5"/><path d="M9.5 9.2a2.5 2.5 0 1 1 3.7 2.2c-.9.5-1.2.9-1.2 1.8"/><line x1="12" y1="16.5" x2="12" y2="16.6"/>',
		'life-buoy'       => '<circle cx="12" cy="12" r="9.5"/><circle cx="12" cy="12" r="4"/><line x1="5.1" y1="5.1" x2="9.2" y2="9.2"/><line x1="14.8" y1="14.8" x2="18.9" y2="18.9"/><line x1="18.9" y1="5.1" x2="14.8" y2="9.2"/><line x1="9.2" y1="14.8" x2="5.1" y2="18.9"/>',
		'check-circle'    => '<circle cx="12" cy="12" r="9.5"/><polyline points="7.5 12.5 10.5 15.5 16.5 9"/>',
		'paperclip'       => '<path d="M17.5 8.5 9.9 16a3 3 0 1 1-4.2-4.2L14 3.4a2 2 0 0 1 2.8 2.8L8.4 14.6a1 1 0 0 1-1.4-1.4l7-7"/>',
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
 * Get the URL of the Help Center home page (the page at `/help`).
 *
 * @return string
 */
function get_help_home_url(): string {
	$page = get_page_by_path( 'help' );

	return $page ? get_permalink( $page ) : home_url( '/help/' );
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
