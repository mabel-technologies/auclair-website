/**
 * "Related queries" sidebar panel for the kb_article post type.
 *
 * Writes the `related` post meta (ordered array of kb_article IDs) that the
 * related-queries template block reads first, before falling back to
 * same-category articles. Until this panel the meta had no wp-admin UI.
 */
import { registerPlugin } from '@wordpress/plugins';
import { PluginDocumentSettingPanel } from '@wordpress/editor';
import { useEntityProp } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import ArticlePicker from '../../../blocks/shared/ArticlePicker';

const KB_ARTICLE_POST_TYPE = 'kb_article';

type KbArticleMeta = { related?: number[] };

const RelatedArticlesPanel = () => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const { postType, postId } = useSelect( ( select: any ) => {
		const editor = select( 'core/editor' );
		return { postType: editor.getCurrentPostType(), postId: editor.getCurrentPostId() };
	}, [] );

	// Hooks must run unconditionally — bail on render for other post types.
	const [ meta, setMeta ] = useEntityProp< KbArticleMeta >( 'postType', KB_ARTICLE_POST_TYPE, 'meta' );

	if ( postType !== KB_ARTICLE_POST_TYPE ) {
		return null;
	}

	return (
		<PluginDocumentSettingPanel
			name="auclair-related-articles"
			title={ __( 'Related queries', 'auclair' ) }
			className="auclair-related-articles-panel"
		>
			<ArticlePicker
				label={ __( 'Related articles', 'auclair' ) }
				value={ meta?.related ?? [] }
				exclude={ postId ? [ postId ] : [] }
				onChange={ ( related: number[] ) => setMeta( { ...meta, related } ) }
				help={ __(
					'Shown under "Related queries" on this article, in this order. Leave empty to show other articles from the same category.',
					'auclair'
				) }
			/>
		</PluginDocumentSettingPanel>
	);
};

registerPlugin( 'auclair-related-articles-panel', { render: RelatedArticlesPanel } );
