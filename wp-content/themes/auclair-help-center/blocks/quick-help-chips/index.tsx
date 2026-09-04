import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, SelectControl, RangeControl } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';
import { __ } from '@wordpress/i18n';
import metadata from './block.json';
import ArticlePicker from '../shared/ArticlePicker';

const SOURCES = [
	{ label: __( 'Most viewed', 'auclair' ), value: 'popular' },
	{ label: __( 'Help tags', 'auclair' ), value: 'term' },
	{ label: __( 'Manual', 'auclair' ), value: 'manual' },
];

registerBlockType( metadata.name, {
	edit: ( { attributes, setAttributes } ) => {
		const label = attributes.label as string;
		const source = attributes.source as string;
		const limit = attributes.limit as number;
		const posts = ( attributes.posts as number[] ) || [];
		const blockProps = useBlockProps();

		return (
			<>
				<InspectorControls>
					<PanelBody title={ __( 'Settings', 'auclair' ) }>
						<TextControl
							label={ __( 'Label', 'auclair' ) }
							value={ label }
							onChange={ ( label: string ) => setAttributes( { label } ) }
						/>
						<SelectControl
							label={ __( 'Source', 'auclair' ) }
							value={ source }
							options={ SOURCES }
							onChange={ ( source: string ) => setAttributes( { source } ) }
						/>
						<RangeControl
							label={ __( 'Number of chips', 'auclair' ) }
							value={ limit }
							min={ 1 }
							max={ 8 }
							onChange={ ( limit?: number ) => setAttributes( { limit: limit || 4 } ) }
						/>
						<ArticlePicker
							value={ posts }
							onChange={ ( posts: number[] ) => setAttributes( { posts } ) }
							help={
								'manual' === source
									? __( 'Only these articles are shown.', 'auclair' )
									: __( 'Shown first; the source above fills the remaining chips.', 'auclair' )
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
