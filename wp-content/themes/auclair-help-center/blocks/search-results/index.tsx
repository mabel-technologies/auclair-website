import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, RangeControl } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';
import { __ } from '@wordpress/i18n';
import metadata from './block.json';

registerBlockType( metadata.name, {
	edit: ( { attributes, setAttributes } ) => {
		const placeholder = attributes.placeholder as string;
		const limit = attributes.limit as number;
		const blockProps = useBlockProps();

		return (
			<>
				<InspectorControls>
					<PanelBody title={ __( 'Settings', 'auclair' ) }>
						<TextControl
							label={ __( 'Placeholder', 'auclair' ) }
							value={ placeholder }
							onChange={ ( placeholder: string ) => setAttributes( { placeholder } ) }
						/>
						<RangeControl
							label={ __( 'Result limit', 'auclair' ) }
							value={ limit }
							min={ 1 }
							max={ 24 }
							onChange={ ( limit?: number ) => setAttributes( { limit: limit || 12 } ) }
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
