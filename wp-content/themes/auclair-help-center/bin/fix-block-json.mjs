#!/usr/bin/env node
/**
 * Post-build fixup for dist/blocks/*\/block.json.
 *
 * 10up-toolkit's build (with `useScriptModules: true`, needed here for the
 * Interactivity API blocks' viewScriptModule) runs two webpack compilers in
 * parallel — one classic, one ESM — and both run their own CopyWebpackPlugin
 * pass over blocks/**\/block.json with a transform that's supposed to rewrite
 * `.ts`/`.tsx` script references to `.js` for the compiled dist copy. In this
 * project the two parallel copy passes race and the untransformed copy (still
 * pointing at `.tsx`, which doesn't exist in dist/) consistently wins,
 * silently breaking every block's editorScript enqueue — WordPress can't find
 * the file, so it just never registers the block editor-side (frontend still
 * renders fine via render.php, so this only shows up as "your site doesn't
 * include support for this block" in wp-admin).
 *
 * This mirrors 10up-toolkit's own transformTSAsset() rewrite rule and reapplies
 * it directly to whatever the build actually emitted, as a `postbuild` step.
 */

import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DIST_BLOCKS_DIR = join( import.meta.dirname, '..', 'dist', 'blocks' );
const JS_ASSET_KEYS = [ 'script', 'editorScript', 'viewScript', 'viewScriptModule', 'scriptModule' ];

function rewriteTsExtension( value ) {
	if ( typeof value !== 'string' || ! value.startsWith( 'file:' ) ) {
		return value;
	}
	return value.replace( /\.tsx?$/, '.js' );
}

function fixBlockJson( filePath ) {
	const raw = readFileSync( filePath, 'utf8' );
	if ( ! raw.trim() ) {
		return false;
	}

	const metadata = JSON.parse( raw );
	let changed = false;

	for ( const key of JS_ASSET_KEYS ) {
		const value = metadata[ key ];
		if ( value === undefined ) {
			continue;
		}
		const fixed = Array.isArray( value ) ? value.map( rewriteTsExtension ) : rewriteTsExtension( value );
		if ( JSON.stringify( fixed ) !== JSON.stringify( value ) ) {
			metadata[ key ] = fixed;
			changed = true;
		}
	}

	if ( changed ) {
		writeFileSync( filePath, JSON.stringify( metadata, null, 2 ) + '\n' );
	}

	return changed;
}

let fixedCount = 0;
let checkedCount = 0;

for ( const entry of readdirSync( DIST_BLOCKS_DIR ) ) {
	const blockJsonPath = join( DIST_BLOCKS_DIR, entry, 'block.json' );
	try {
		if ( ! statSync( blockJsonPath ).isFile() ) {
			continue;
		}
	} catch {
		continue;
	}

	checkedCount += 1;
	if ( fixBlockJson( blockJsonPath ) ) {
		fixedCount += 1;
		console.log( `fix-block-json: rewrote ${ entry }/block.json` );
	}
}

console.log( `fix-block-json: checked ${ checkedCount } block(s), fixed ${ fixedCount }.` );
