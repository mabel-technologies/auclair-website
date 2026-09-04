import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, RangeControl } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';
import { __ } from '@wordpress/i18n';
import metadata from './block.json';
import ArticlePicker from '../shared/ArticlePicker';

const SOURCES = [
	{ label: __( 'Sticky (is_top_query)', 'auclair' ), value: 'sticky' },
	{ label: __( 'Most viewed', 'auclair' ), value: 'most-viewed' },
	{ label: __( 'Manual', 'auclair' ), value: 'manual' },
];

registerBlockType( metadata.name, {
	edit: ( { attributes, setAttributes } ) => {
		const source = attributes.source as string;
		const limit = attributes.limit as number;
		const posts = ( attributes.posts as number[] ) || [];
		const blockProps = useBlockProps();

		return (
			<>
				<InspectorControls>
					<PanelBody title={ __( 'Settings', 'auclair' ) }>
						<SelectControl
							label={ __( 'Source', 'auclair' ) }
							value={ source }
							options={ SOURCES }
							onChange={ ( source: string ) => setAttributes( { source } ) }
						/>
						<RangeControl
							label={ __( 'Number of items', 'auclair' ) }
							value={ limit }
							min={ 1 }
							max={ 20 }
							onChange={ ( limit?: number ) => setAttributes( { limit: limit || 10 } ) }
						/>
						<ArticlePicker
							value={ posts }
							onChange={ ( posts: number[] ) => setAttributes( { posts } ) }
							help={
								'manual' === source
									? __( 'Only these articles are shown.', 'auclair' )
									: __( 'Shown first; the source above fills the remaining items.', 'auclair' )
							}
						/>
					</PanelBody>
				</InspectorControls>
				<div { ...blockProps }>
					<ServerSideRender block={ metadata.name } attributes={ attributes } />
				</div>
			</>
		);
	},
	save: () => null,
} );
