<?php
/**
 * WP Constants used by PHPStan
 *
 * These should be updated to match constants that are set in any custom plugins or themes that will be anylised.
 *
 * @package TenUpPhpStan
 */

// Change these when you update the constants in the plugin.
define( 'AU_CLAIR_HELP_CENTER_PLUGIN_VERSION', '0.1.0' );
define( 'AU_CLAIR_HELP_CENTER_PLUGIN_URL', '' );
define( 'AU_CLAIR_HELP_CENTER_PLUGIN_PATH', '' );
define( 'AU_CLAIR_HELP_CENTER_PLUGIN_INC', AU_CLAIR_HELP_CENTER_PLUGIN_PATH . 'includes/' );

// Change these when you update the constants in the theme.

define( 'AU_CLAIR_HELP_CENTER_THEME_VERSION', '1.0.0' );
define( 'AU_CLAIR_HELP_CENTER_THEME_TEMPLATE_URL', '' );
define( 'AU_CLAIR_HELP_CENTER_THEME_PATH', '/' );
define( 'AU_CLAIR_HELP_CENTER_THEME_DIST_PATH', AU_CLAIR_HELP_CENTER_THEME_PATH . 'dist/' );
define( 'AU_CLAIR_HELP_CENTER_THEME_DIST_URL', AU_CLAIR_HELP_CENTER_THEME_TEMPLATE_URL . '/dist/' );
define( 'AU_CLAIR_HELP_CENTER_THEME_INC', AU_CLAIR_HELP_CENTER_THEME_PATH . 'includes/' );
define( 'AU_CLAIR_HELP_CENTER_THEME_BLOCK_DIST_DIR', AU_CLAIR_HELP_CENTER_THEME_DIST_PATH . '/blocks/' );
