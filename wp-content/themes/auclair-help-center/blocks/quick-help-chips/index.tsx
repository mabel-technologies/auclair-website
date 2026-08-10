import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, SelectControl, RangeControl } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';
import { __ } from '@wordpress/i18n';
import metadata from './block.json';

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
						{ 'manual' === source && (
							<p>{ __( 'Manual items are edited via the Code Editor block attributes for now.', 'auclair' ) }</p>
						) }
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
