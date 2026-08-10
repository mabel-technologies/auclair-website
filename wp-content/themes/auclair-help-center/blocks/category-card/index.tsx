import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';
import { __ } from '@wordpress/i18n';
import metadata from './block.json';

registerBlockType( metadata.name, {
	edit: ( { attributes, setAttributes } ) => {
		const termId = attributes.termId as number;
		const animate = attributes.animate as boolean;
		const blockProps = useBlockProps();

		return (
			<>
				<InspectorControls>
					<PanelBody title={ __( 'Settings', 'auclair' ) }>
						<TextControl
							label={ __( 'Term ID', 'auclair' ) }
							type="number"
							value={ termId ? String( termId ) : '' }
							onChange={ ( value: string ) => setAttributes( { termId: Number( value ) || 0 } ) }
						/>
						<ToggleControl
							label={ __( 'Ring animation on hover', 'auclair' ) }
							checked={ !! animate }
							onChange={ ( animate: boolean ) => setAttributes( { animate } ) }
						/>
					</PanelBody>
				</InspectorControls>
				<div { ...blockProps }>
					{ termId ? (
						<ServerSideRender block={ metadata.name } attributes={ attributes } />
					) : (
						<p>{ __( 'Choose a help_category term ID in the sidebar.', 'auclair' ) }</p>
					) }
				</div>
			</>
		);
	},
	save: () => null,
} );
