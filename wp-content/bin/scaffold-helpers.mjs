/**
 * Shared utilities for WordPress scaffold scripts
 *
 * @package TenUpScaffold
 */

import { execSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { join, extname } from 'node:path';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const BINARY_EXTENSIONS = new Set([
	'.png',
	'.jpg',
	'.jpeg',
	'.gif',
	'.webp',
	'.ico',
	'.svg',
	'.woff',
	'.woff2',
	'.eot',
	'.ttf',
	'.otf',
	'.zip',
	'.gz',
	'.tar',
	'.bz2',
	'.mp4',
	'.mp3',
	'.mov',
	'.avi',
	'.pdf',
	'.doc',
	'.docx',
	'.lock',
]);

export const SKIP_DIRS = new Set(['node_modules', 'vendor', '.git', 'plugins']);

// ---------------------------------------------------------------------------
// Naming convention helpers
// ---------------------------------------------------------------------------

/** Convert "Acme Corp" to "acme-corp" */
export function toKebab(name) {
	return name
		.replace(/([a-z])([A-Z])/g, '$1-$2')
		.replace(/[\s_]+/g, '-')
		.replace(/[^a-z0-9-]/gi, '')
		.toLowerCase();
}

/** Convert "acme-corp" to "AcmeCorp" */
export function toPascal(slug) {
	return slug
		.split('-')
		.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
		.join('');
}

/** Convert "acme-corp" to "ACME_CORP" */
export function toConstant(slug) {
	return slug.replace(/-/g, '_').toUpperCase();
}

/** Convert "acme-corp" to "acme_corp" */
export function toSnake(slug) {
	return slug.replace(/-/g, '_');
}

/** Convert "acme-corp" to "Acme Corp" */
export function toTitle(slug) {
	return slug
		.split('-')
		.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
		.join(' ');
}

// ---------------------------------------------------------------------------
// Git helpers
// ---------------------------------------------------------------------------

/** Try to read the git remote origin URL */
export function getGitRemoteUrl(cwd) {
	try {
		const url = execSync('git remote get-url origin', { cwd, encoding: 'utf-8' }).trim();
		// Normalize git@github.com:org/repo.git to https://github.com/org/repo
		if (url.startsWith('git@')) {
			return url.replace(/^git@([^:]+):/, 'https://$1/').replace(/\.git$/, '');
		}
		return url.replace(/\.git$/, '');
	} catch {
		return '';
	}
}

/** Extract the org/user from a GitHub URL */
export function getGitOrgFromUrl(url) {
	const match = url.match(/github\.com\/([^/]+)/);
	return match ? match[1].toLowerCase() : '';
}

// ---------------------------------------------------------------------------
// File-walking helpers
// ---------------------------------------------------------------------------

export function walkFiles(dir, results = [], skipDirs = SKIP_DIRS) {
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		const fullPath = join(dir, entry.name);
		if (entry.isDirectory()) {
			if (skipDirs.has(entry.name)) continue;
			walkFiles(fullPath, results, skipDirs);
		} else if (entry.isFile()) {
			if (BINARY_EXTENSIONS.has(extname(entry.name).toLowerCase())) continue;
			if (entry.name === 'package-lock.json') continue;
			results.push(fullPath);
		}
	}
	return results;
}

// ---------------------------------------------------------------------------
// Replacement map builder (shared between scaffold.mjs and scaffold-vip.mjs)
// ---------------------------------------------------------------------------

/**
 * Build the replacement map for project scaffold.
 *
 * @param {object}  options
 * @param {boolean} options.isBlock - Whether the theme is a block theme
 * @param {boolean} options.isVip   - Whether the hosting is VIP
 * @param {object}  options.values  - The derived values object
 * @param {string}  options.slug    - The project slug (kebab-case)
 * @returns {Array<[string, string]>} Sorted replacement pairs (longest first)
 */
export function buildReplacementMap({ isBlock, isVip, values, slug }) {
	const replacements = [];

	// Theme replacements (chosen theme)
	if (isBlock) {
		// The block theme uses both "auclair-help-center" (directory/style.css) AND
		// "au-clair-help-center-theme" (internal handles, text domain, pattern slugs). We need
		// to replace both. Longer strings first to avoid partial matches.
		replacements.push(
			['AuclairHelpCenter', values.themeNamespace],
			['AuclairHelpCenter', values.themeNamespace],
			['AU_CLAIR_HELP_CENTER_THEME', values.themeConstant],
			['auclair-help-center', values.themeSlug],
			['au_clair_help_center_theme', values.themeHookPrefix],
			['auclair-help-center', values.themeSlug],
			['Au Clair Help Center Theme', values.themeHumanName],
			['AuclairHelpCenter', values.themeNamespace],
			['AU_CLAIR_HELP_CENTER_THEME', values.themeConstant],
			['au-clair-help-center-theme', values.themeNpmName],
			['au_clair_help_center_theme', values.themeHookPrefix],
			['auclair-help-center', values.themeSlug],
			['Au Clair Help Center Theme', values.themeHumanName],
		);
	} else {
		replacements.push(
			['AuclairHelpCenter', values.themeNamespace],
			['AU_CLAIR_HELP_CENTER_THEME', values.themeConstant],
			['au-clair-help-center-theme', values.themeSlug],
			['au_clair_help_center_theme', values.themeHookPrefix],
			['auclair-help-center', values.themeSlug],
			['Au Clair Help Center Theme', values.themeHumanName],
		);
	}

	// Plugin replacements
	replacements.push(
		['AuclairCore', values.pluginNamespace],
		['AU_CLAIR_HELP_CENTER_PLUGIN', values.pluginConstant],
		['auclair-core', values.pluginSlug],
		['au_clair_help_center_plugin', values.pluginHookPrefix],
		['auclair-core', values.pluginSlug],
		['Au Clair Help Center Plugin', values.pluginHumanName],
	);

	// VIP: mu-plugins -> client-mu-plugins path replacement.
	// Use targeted patterns to avoid changing generic "mu-plugins" WordPress references.
	if (isVip) {
		replacements.push(
			['mu-plugins/auclair-core', 'client-mu-plugins/auclair-core'],
			['<file>mu-plugins</file>', '<file>client-mu-plugins</file>'],
		);
	}

	// Composer package names
	replacements.push(
		['au-clair-help-center/au-clair-help-center', `${values.composerVendor}/${slug}`],
		['au-clair-help-center/auclair-core', `${values.composerVendor}/${values.pluginSlug}`],
		['au-clair-help-center/auclair-help-center', `${values.composerVendor}/${values.themeSlug}`],
		['au-clair-help-center/auclair-help-center', `${values.composerVendor}/${values.themeSlug}`],
	);

	// npm root package name
	replacements.push(['au-clair-help-center', slug]);

	// Author / metadata
	if (values.authorEmail) {
		replacements.push(['me@kt12.in', values.authorEmail]);
	}
	if (values.authorUri) {
		replacements.push(['https://10up.com', values.authorUri]);
	}

	// Description strings (longer matches first)
	if (values.description) {
		replacements.push(
			['AuClair Help Center — WordPress knowledge base and support site', values.description],
			['AuClair Help Center — WordPress knowledge base and support site', values.description],
			['AuClair Help Center — WordPress knowledge base and support site', values.description],
			['AuClair Help Center — WordPress knowledge base and support site', values.description],
			['AuClair Help Center — WordPress knowledge base and support site', values.description],
			['AuClair Help Center — WordPress knowledge base and support site', values.description],
		);
	}

	// URLs
	if (values.repoUrl) {
		replacements.push(
			['https://github.com/au-clair-help-center/au-clair-help-center', values.repoUrl],
			['https://project-git-repo.tld', values.repoUrl],
		);
	}
	if (values.homepageUrl) {
		replacements.push(['https://project-domain.tld', values.homepageUrl]);
	}

	// Author name replacement (must be last / most targeted to avoid over-matching).
	// We only replace the exact author patterns to avoid mangling things like
	// "10up-toolkit" or "10up/phpcs-composer".
	if (values.authorName) {
		replacements.push(
			['"name": "10up"', `"name": "${values.authorName}"`],
			['Author:            10up', `Author:            ${values.authorName}`],
			['Author:      10up', `Author:      ${values.authorName}`],
			['Author:        10up', `Author:        ${values.authorName}`],
		);
	}

	// Sort by length of search string descending to prevent partial matches.
	replacements.sort((a, b) => b[0].length - a[0].length);

	return replacements;
}
