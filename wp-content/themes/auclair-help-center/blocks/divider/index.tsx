import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import metadata from './block.json';

registerBlockType( metadata.name, {
	edit: ( { attributes, setAttributes } ) => {
		const inset = attributes.inset as boolean;
		const blockProps = useBlockProps( {
			className: `auclair-divider${ inset ? ' is-inset' : '' }`,
		} );

		return (
			<>
				<InspectorControls>
					<PanelBody title={ __( 'Settings', 'auclair' ) }>
						<ToggleControl
							label={ __( 'Inset', 'auclair' ) }
							checked={ !! inset }
							onChange={ ( inset: boolean ) => setAttributes( { inset } ) }
						/>
					</PanelBody>
				</InspectorControls>
				<hr { ...blockProps } />
			</>
		);
	},
	save: ( { attributes } ) => {
		const blockProps = useBlockProps.save( {
			className: `auclair-divider${ attributes.inset ? ' is-inset' : '' }`,
		} );
		return <hr { ...blockProps } />;
	},
} );
