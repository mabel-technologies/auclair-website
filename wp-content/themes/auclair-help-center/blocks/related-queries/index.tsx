import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, RangeControl, TextControl } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';
import { __ } from '@wordpress/i18n';
import metadata from './block.json';

const SOURCES = [
	{ label: __( 'Same category (falls back from related field)', 'auclair' ), value: 'same-category' },
	{ label: __( 'Manual', 'auclair' ), value: 'manual' },
];

registerBlockType( metadata.name, {
	edit: ( { attributes, setAttributes } ) => {
		const heading = attributes.heading as string;
		const source = attributes.source as string;
		const limit = attributes.limit as number;
		const blockProps = useBlockProps();

		return (
			<>
				<InspectorControls>
					<PanelBody title={ __( 'Settings', 'auclair' ) }>
						<TextControl
							label={ __( 'Heading', 'auclair' ) }
							value={ heading }
							onChange={ ( heading: string ) => setAttributes( { heading } ) }
						/>
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
							max={ 8 }
							onChange={ ( limit?: number ) => setAttributes( { limit: limit || 4 } ) }
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
