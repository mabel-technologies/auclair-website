/**
 * "Article content" sidebar panel for the kb_article post type.
 *
 * article-header (intro) and article-body (steps) read these directly from
 * post meta rather than block attributes — they're shared template blocks
 * used identically across every article page, so the actual per-article copy
 * has to live on the article post itself, not in a block instance. Before
 * this panel there was no wp-admin UI to edit `intro`/`steps` at all.
 */
import { registerPlugin } from '@wordpress/plugins';
import { PluginDocumentSettingPanel } from '@wordpress/editor';
import { useEntityProp } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { TextControl, TextareaControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const KB_ARTICLE_POST_TYPE = 'kb_article';

type KbArticleMeta = {
	intro?: string;
	steps?: string[];
	group?: string;
};

const ArticleMetaPanel = () => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const postType = useSelect( ( select: any ) => select( 'core/editor' ).getCurrentPostType(), [] );

	// Hooks must run unconditionally — call useEntityProp regardless, and
	// bail on render for other post types.
	const [ meta, setMeta ] = useEntityProp< KbArticleMeta >( 'postType', KB_ARTICLE_POST_TYPE, 'meta' );

	if ( postType !== KB_ARTICLE_POST_TYPE ) {
		return null;
	}

	const intro = meta?.intro ?? '';
	const steps = meta?.steps ?? [];
	const group = meta?.group ?? '';

	return (
		<PluginDocumentSettingPanel
			name="auclair-article-content"
			title={ __( 'Article content', 'auclair' ) }
			className="auclair-article-content-panel"
		>
			<TextControl
				label={ __( 'Group', 'auclair' ) }
				help={ __(
					'The sub-heading this article is listed under on its category page (e.g. "Getting started"). Articles in the same category that share this exact text are grouped together into one section — change it to move an article between sections, or type a new name to create a new section. Leave empty to fall back to a generic "Articles" section. Sections appear in the order their first article appears when the category\'s articles are sorted by Order (Page Attributes, below).',
					'auclair'
				) }
				value={ group }
				onChange={ ( group: string ) => setMeta( { ...meta, group } ) }
			/>
			<TextareaControl
				label={ __( 'Intro', 'auclair' ) }
				help={ __( 'Shown under the article title.', 'auclair' ) }
				value={ intro }
				onChange={ ( intro: string ) => setMeta( { ...meta, intro } ) }
				rows={ 3 }
			/>
			<TextareaControl
				label={ __( 'Steps', 'auclair' ) }
				help={ __( 'One step per line. Shown as a numbered list above the article body.', 'auclair' ) }
				value={ steps.join( '\n' ) }
				onChange={ ( value: string ) =>
					setMeta( {
						...meta,
						steps: value.split( '\n' ).map( ( step ) => step.trim() ).filter( Boolean ),
					} )
				}
				rows={ 6 }
			/>
		</PluginDocumentSettingPanel>
	);
};

registerPlugin( 'auclair-article-meta-panel', { render: ArticleMetaPanel } );
